class Api::AvatarController < ApplicationController
  before_action :authenticate_user!

  # PUT /api/me/avatar
  def update
    unless params[:avatar].present?
      return render json: { error: 'No file provided' }, status: :unprocessable_entity
    end

    current_user.avatar.attach(params[:avatar])

    if current_user.avatar.attached?
      render json: { avatar_url: avatar_url_for(current_user) }
    else
      render json: { error: 'Could not attach avatar' }, status: :unprocessable_entity
    end
  end

  # DELETE /api/me/avatar
  def destroy
    current_user.avatar.purge if current_user.avatar.attached?
    render json: { avatar_url: nil }
  end

  private

  def avatar_url_for(user)
    return nil unless user.avatar.attached?
    rails_blob_url(user.avatar, host: request.base_url)
  end
end
