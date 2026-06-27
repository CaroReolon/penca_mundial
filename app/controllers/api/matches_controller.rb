class Api::MatchesController < ApplicationController
  before_action :authenticate_user!

  def index
    matches = Match
      .includes(:group, :home_team, :away_team)

    matches =
      case params[:status]
      when "upcoming"
        matches.where("kickoff_at > ?", Time.current)
      when "past"
        matches.where("kickoff_at <= ?", Time.current)
      else
        matches
      end

    matches = matches.order(kickoff_at: params[:status] == "past" ? :desc : :asc)

    render json: matches.map { |match|
      {
        id: match.id,

        kickoff_at: match.kickoff_at,

        stadium:    match.stadium,
        stadium_en: match.stadium_en,

        stage: match.stage,
        group: match.group&.name,

        home_team: serialize_team(match.home_team),
        away_team: serialize_team(match.away_team),

        home_score: match.home_score,
        away_score: match.away_score,
        completed:  match.completed,

        went_to_penalties:      match.went_to_penalties,
        penalty_winner_team_id: match.penalty_winner_team_id,

        prediction: current_user
          .predictions
          .find_by(match_id: match.id)
          &.slice(:id, :home_score, :away_score, :points_awarded, :penalty_winner_team_id)
      }
    }
  end

  private

  def serialize_team(team)
    {
      id:           team.id,
      name:         team.name,
      name_en:      team.name_en,
      short_name:   team.short_name,
      short_name_en: team.short_name_en,
      code:         team.code,
      flag:         team.flag
    }
  end
end
