class Api::PlayGroupInvitationsController < ApplicationController
  before_action :authenticate_user!

  # POST /api/play_groups/:play_group_id/invitations
  def create
    group = PlayGroup.includes(:memberships).find(params[:play_group_id])

    unless group.memberships.any? { |m| m.user_id == current_user.id && m.admin? }
      return render json: { error: 'Forbidden' }, status: :forbidden
    end

    invitation = group.invitations.create!(invited_by: current_user)

    render json: {
      id:         invitation.id,
      invite_url: "#{frontend_base_url}/invite/#{invitation.token}"
    }, status: :created
  end

  # DELETE /api/play_groups/:play_group_id/invitations/:id
  def destroy
    group      = PlayGroup.includes(:memberships).find(params[:play_group_id])
    invitation = group.invitations.find(params[:id])

    unless group.memberships.any? { |m| m.user_id == current_user.id && m.admin? }
      return render json: { error: 'Forbidden' }, status: :forbidden
    end

    invitation.destroy
    render json: { ok: true }
  end

  private

  def frontend_base_url
    ENV.fetch('FRONTEND_URL') do
      Rails.env.development? ? "#{request.scheme}://#{request.host}:5173" : request.base_url
    end
  end
end
