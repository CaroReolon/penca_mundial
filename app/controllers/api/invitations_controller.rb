# Public controller for accepting invitations via token link
class Api::InvitationsController < ApplicationController
  before_action :authenticate_user!, only: [:accept]

  # GET /api/invitations/:token  — preview (no auth required)
  def show
    invitation = PlayGroupInvitation.includes(:play_group, :invited_by).find_by!(token: params[:token])

    if invitation.accepted? || invitation.declined?
      return render json: { error: 'Esta invitación ya fue utilizada', status: invitation.status }
    end

    render json: {
      group_name: invitation.play_group.name,
      invited_by: "#{invitation.invited_by.first_name} #{invitation.invited_by.last_name}",
      status:     invitation.status
    }
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Invitación no encontrada' }, status: :not_found
  end

  # POST /api/invitations/:token/accept
  def accept
    invitation = PlayGroupInvitation.includes(:play_group).find_by!(token: params[:token])

    if invitation.accepted?
      return render json: { ok: true, group_id: invitation.play_group_id }
    end

    if invitation.declined?
      return render json: { error: 'Esta invitación fue rechazada' }, status: :unprocessable_entity
    end

    group = invitation.play_group

    # Already a member — just mark accepted
    unless group.memberships.exists?(user: current_user)
      group.memberships.create!(user: current_user, role: :member)
    end

    invitation.update!(status: :accepted, accepted_by: current_user)

    render json: { ok: true, group_id: group.id, group_name: group.name }
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Invitación no encontrada' }, status: :not_found
  end

  # DELETE /api/play_groups/:play_group_id/memberships/:user_id  — leave group
  def leave
    group = PlayGroup.find(params[:id])
    membership = group.memberships.find_by!(user: current_user)

    if membership.admin? && group.memberships.where(role: :admin).count == 1
      return render json: { error: 'No puedes salir siendo el único admin. Elimina el grupo o asigna otro admin.' },
                    status: :unprocessable_entity
    end

    membership.destroy
    render json: { ok: true }
  end
end
