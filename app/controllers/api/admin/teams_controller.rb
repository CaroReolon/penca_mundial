class Api::Admin::TeamsController < ApplicationController
  include AdminRequired
  before_action :authenticate_user!

  # GET /api/admin/teams  — returns all teams for dropdowns
  def index
    teams = Team.order(:name)
    render json: teams.map { |t|
      {
        id:         t.id,
        name:       t.name,
        name_en:    t.name_en,
        short_name: t.short_name,
        flag:       t.flag
      }
    }
  end
end
