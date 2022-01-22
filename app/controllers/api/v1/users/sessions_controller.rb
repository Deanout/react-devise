# app/controllers/users/sessions_controller.rb
class Api::V1::Users::SessionsController < Devise::SessionsController
  before_action :ensure_params_exist
  respond_to :json

  def create
    # Changing scope from :api_v1_user to :user
    Devise.mappings[:user] = Devise.mappings[:api_v1_user]
    warden.config[:default_strategies][:user] = warden.config[:default_strategies].delete(:api_v1_user)
    auth_opts = auth_options
    auth_opts[:scope] = :user

    self.resource = warden.authenticate!(auth_opts)
    set_flash_message!(:notice, :signed_in)
    sign_in(resource_name, resource)
    yield resource if block_given?

    render json: current_api_v1_user
  end

  protected
  def ensure_params_exist
    return unless params[:user].blank?

    render json: { success: false, message: 'missing user_login parameter' }, status: 422
  end

  def invalid_login_attempt
    warden.custom_failure!
    render json: { success: false, message: 'Error with your login or password' }, status: 401
  end

  private

  def respond_with(_resource, _opts = {})
    puts 'RESPOND WITH'
    log_in_success && return if current_api_v1_user

    invalid_login_attempt
  end

  def respond_to_on_destroy
    log_out_success && return if current_api_v1_user

    log_out_failure
  end

  def log_in_success
    render json: {
      message: 'You are logged in.',
      user: current_api_v1_user
    }, status: :ok
  end

  def log_out_success
    render json: {
      message: 'You are logged out.'
    }, status: :ok
  end

  def log_out_failure
    render json: { message: 'Hmm nothing happened.' }, status: :unauthorized
  end
end
