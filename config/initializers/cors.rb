# config/initializers/cors.rb

# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      # This could be changed from '*' to 'ip' if you wanted to allow list only one IP.
      # Say, for example, you wanted to only allow access from the server running your Vue application.
      # origins '172.0.0.1'
      origins '*'
  
      resource '*',
               headers: :any,
               methods: %i[get post put patch delete options head],
               expose: %w[Authorization Uid]
    end
  end