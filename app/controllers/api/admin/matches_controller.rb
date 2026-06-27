class Api::Admin::MatchesController < ApplicationController
  include AdminRequired
  before_action :authenticate_user!
  before_action :set_match, only: [:update]

  TOURNAMENT_ID = 1

  # GET /api/admin/matches
  def index
    matches = Match
      .includes(:group, :home_team, :away_team)
      .where(tournament_id: TOURNAMENT_ID)
      .order(:kickoff_at)

    render json: matches.map { |m| serialize(m) }
  end

  # POST /api/admin/matches
  def create
    match = Match.new(match_params)
    match.tournament_id = TOURNAMENT_ID

    if match.save
      render json: serialize(match), status: :created
    else
      render json: { errors: match.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH /api/admin/matches/:id
  def update
    if @match.update(update_params)
      render json: serialize(@match)
    else
      render json: { errors: @match.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_match
    @match = Match.find(params[:id])
  end

  def match_params
    params.require(:match).permit(
      :home_team_id, :away_team_id, :kickoff_at,
      :stadium, :stadium_en, :stage, :group_id
    )
  end

  def update_params
    params.require(:match).permit(
      :home_team_id, :away_team_id,
      :home_score, :away_score,
      :completed, :kickoff_at,
      :stadium, :stadium_en,
      :went_to_penalties, :penalty_winner_team_id
    )
  end

  def serialize(match)
    {
      id:                     match.id,
      stage:                  match.stage,
      kickoff_at:             match.kickoff_at,
      stadium:                match.stadium,
      stadium_en:             match.stadium_en,
      group:                  match.group&.name,
      home_team:              serialize_team(match.home_team),
      away_team:              serialize_team(match.away_team),
      home_score:             match.home_score,
      away_score:             match.away_score,
      completed:              match.completed,
      went_to_penalties:      match.went_to_penalties,
      penalty_winner_team_id: match.penalty_winner_team_id
    }
  end

  def serialize_team(team)
    return nil unless team
    {
      id:   team.id,
      name: team.name,
      name_en: team.name_en,
      flag: team.flag,
      short_name: team.short_name
    }
  end
end
