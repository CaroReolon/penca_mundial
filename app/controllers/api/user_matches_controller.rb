class Api::UserMatchesController < ApplicationController
  before_action :authenticate_user!

  def index
    target_user = User.find(params[:user_id])

    matches = Match
      .includes(:group, :home_team, :away_team)
      .where("kickoff_at <= ?", Time.current)
      .order(:kickoff_at)

    render json: matches.map { |match|
      {
        id: match.id,

        kickoff_at: match.kickoff_at,

        stadium:    match.stadium,
        stadium_en: match.stadium_en,

        group: match.group&.name,

        home_team: serialize_team(match.home_team),
        away_team: serialize_team(match.away_team),

        home_score: match.home_score,
        away_score: match.away_score,

        prediction: target_user
          .predictions
          .find_by(match_id: match.id)
          &.slice(:id, :home_score, :away_score, :points_awarded)
      }
    }
  end

  private

  def serialize_team(team)
    {
      id:            team.id,
      name:          team.name,
      name_en:       team.name_en,
      short_name:    team.short_name,
      short_name_en: team.short_name_en,
      code:          team.code,
      flag:          team.flag
    }
  end
end
