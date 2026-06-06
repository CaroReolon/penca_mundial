class Api::MeController < ApplicationController
  before_action :authenticate_user!

  def show
    render json: {
      id:         current_user.id,
      first_name: current_user.first_name,
      last_name:  current_user.last_name,
      email:      current_user.email,
      avatar_url: avatar_url_for(current_user)
    }
  end

  private

  def avatar_url_for(user)
    return nil unless user.avatar.attached?
    rails_blob_url(user.avatar, host: request.base_url)
  end
end
