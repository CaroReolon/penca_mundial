class Api::PlayGroupsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_group,       only: [:show, :destroy]
  before_action :require_member!, only: [:show]
  before_action :require_admin!,  only: [:destroy]

  TOURNAMENT_ID = 1

  # GET /api/play_groups  — groups I belong to
  def index
    groups = current_user.play_groups
      .includes(:members, memberships: nil)
      .where(tournament_id: TOURNAMENT_ID)

    render json: groups.map { |g| serialize_summary(g) }
  end

  # POST /api/play_groups
  def create
    group = PlayGroup.new(
      name:          params[:name],
      tournament_id: TOURNAMENT_ID,
      creator:       current_user
    )

    if group.save
      group.memberships.create!(user: current_user, role: :admin)
      render json: serialize_detail(group), status: :created
    else
      render json: { errors: group.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /api/play_groups/:id
  def show
    render json: serialize_detail(@group)
  end

  # DELETE /api/play_groups/:id
  def destroy
    @group.destroy
    render json: { ok: true }
  end

  private

  def set_group
    @group = PlayGroup.includes(memberships: :user, invitations: nil).find(params[:id])
  end

  def require_member!
    unless @group.memberships.any? { |m| m.user_id == current_user.id }
      render json: { error: 'Forbidden' }, status: :forbidden
    end
  end

  def require_admin!
    unless @group.memberships.any? { |m| m.user_id == current_user.id && m.admin? }
      render json: { error: 'Forbidden' }, status: :forbidden
    end
  end

  def current_user_admin?(group)
    group.memberships.any? { |m| m.user_id == current_user.id && m.admin? }
  end

  def serialize_summary(group)
    {
      id:           group.id,
      name:         group.name,
      member_count: group.members.size,
      is_admin:     group.memberships.any? { |m| m.user_id == current_user.id && m.admin? }
    }
  end

  def serialize_detail(group)
    {
      id:       group.id,
      name:     group.name,
      is_admin: current_user_admin?(group),
      members:  group.memberships.map { |m|
        u = m.user
        {
          id:         u.id,
          name:       "#{u.first_name} #{u.last_name}",
          email:      u.email,
          role:       m.role,
          avatar_url: avatar_url_for(u)
        }
      },
      pending_invitations: current_user_admin?(group) ? pending_invitations(group) : []
    }
  end

  def pending_invitations(group)
    group.invitations.select(&:pending?).map { |inv|
      {
        id:         inv.id,
        email:      inv.email,
        invite_url: "#{request.base_url}/invite/#{inv.token}"
      }
    }
  end

  def avatar_url_for(user)
    return nil unless user.avatar.attached?
    rails_blob_url(user.avatar, host: request.base_url)
  end
end
