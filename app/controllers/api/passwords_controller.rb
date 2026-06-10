class Api::PasswordsController < ApplicationController
  # POST /api/password/forgot
  # Generates a reset token and emails a link to the React reset page.
  def forgot
    user = User.find_by(email: params[:email]&.downcase&.strip)

    # Always return success to avoid leaking which emails are registered
    return render json: { message: 'ok' } unless user

    raw_token, hashed_token = Devise.token_generator.generate(User, :reset_password_token)

    user.update!(
      reset_password_token:   hashed_token,
      reset_password_sent_at: Time.current
    )

    PasswordMailer.reset_instructions(user, raw_token).deliver_later

    render json: { message: 'ok' }
  end

  # POST /api/password/reset
  def reset
    user = User.reset_password_by_token(
      reset_password_token:  params[:token],
      password:              params[:password],
      password_confirmation: params[:password]
    )

    if user.errors.empty?
      render json: { message: 'Password updated successfully' }
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
