class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  before_action :configure_sign_up_params, only: [:create]

  # POST /
  def create
    build_resource(sign_up_params)

    if resource.save
      # Manually encode and dispatch JWT — avoids needing session middleware
      # (which breaks login when added to an API-only app).
      token, _payload = Warden::JWTAuth::UserEncoder.new.call(resource, :user, nil)
      response.set_header('Authorization', "Bearer #{token}")

      render json: {
        id:         resource.id,
        email:      resource.email,
        first_name: resource.first_name,
        last_name:  resource.last_name
      }, status: :created
    else
      render json: { errors: resource.errors }, status: :unprocessable_entity
    end
  end

  private

  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name, :last_name])
  end
end
