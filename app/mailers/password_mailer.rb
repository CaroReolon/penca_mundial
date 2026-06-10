class PasswordMailer < ApplicationMailer
  def reset_instructions(user, token)
    @user  = user
    @token = token

    # Link points to the React frontend reset page
    frontend_host = Rails.env.production? ? "https://pencaworldcup.webhop.me" : "http://localhost:5173"
    @reset_url = "#{frontend_host}/reset-password?token=#{token}"

    mail(
      to:      @user.email,
      subject: "Penca Mundial – Reset your password"
    )
  end
end
