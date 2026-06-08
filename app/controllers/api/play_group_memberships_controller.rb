class Api::PlayGroupMembershipsController < ApplicationController
  before_action :authenticate_user!

  # DELETE /api/play_groups/:play_group_id/members/:user_id
  # Admin removes another member from the group.
  def destroy
    group = PlayGroup.find(params[:id])

    # Only admins can remove members
    my_membership = group.memberships.find_by(user: current_user)
    unless my_membership&.admin?
      return render json: { error: 'Solo los admins pueden eliminar miembros.' }, status: :forbidden
    end

    # Can't remove yourself this way — use the leave endpoint
    if params[:user_id].to_i == current_user.id
      return render json: { error: 'Para salir del grupo usá "Salir del grupo".' }, status: :unprocessable_entity
    end

    membership = group.memberships.find_by(user_id: params[:user_id])
    return render json: { error: 'El usuario no pertenece al grupo.' }, status: :not_found unless membership

    membership.destroy
    render json: { ok: true }
  end
end
