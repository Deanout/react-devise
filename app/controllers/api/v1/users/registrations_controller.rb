# app/controllers/users/registrations_controller.rb
class Api::V1::Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  def create
    build_resource(sign_up_params)

    resource.save
    yield resource if block_given?
    if resource.persisted?
      if resource.active_for_authentication?
        set_flash_message! :notice, :signed_up
        sign_up(resource_name, resource)
        respond_with resource, location: after_sign_up_path_for(resource)
      else
        set_flash_message! :notice, :"signed_up_but_#{resource.inactive_message}"
        expire_data_after_sign_in!
        respond_with resource, location: after_inactive_sign_up_path_for(resource)
      end
    else
      clean_up_passwords resource
      set_minimum_password_length
      respond_with resource
    end
  end

  def destroy
    user = get_user_from_token
    if user.destroy
      destroy_user_success
    else
      destroy_user_failure
    end
  end

  private

  def respond_with(resource, _opts = {})
    register_success && return if resource.persisted?

    register_failed
  end

  def register_success
    puts 'REGISTER USER SUCCESS'
    puts current_api_v1_user
    render json: {
      message: 'Signed up sucessfully.',
      user: current_api_v1_user
    }, status: :ok
  end

  def register_failed
    puts 'REGISTER USER FAILURE'
    render json: { message: 'Something went wrong.' }, status: :unprocessable_entity
  end

  def destroy_user_success
    puts 'DESTROY USER SUCCESS'
    render json: {
      message: 'User deleted.'
    }, status: :ok
  end

  def destroy_user_failure
    puts 'DESTROY USER FAILURE'
    render json: {
      message: 'Something went wrong.'
    }, status: :unprocessable_entity
  end

  def get_user_from_token
    jwt_payload = JWT.decode(request.headers['Authorization'].split(' ')[1],
                             Rails.application.credentials.devise[:jwt_secret_key]).first
    user_id = jwt_payload['sub']
    User.find(user_id.to_s)
  end

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end
end
