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

    matches = matches.order(:kickoff_at)

    render json: matches.map { |match|
      {
        id: match.id,

        kickoff_at: match.kickoff_at,

        stadium: match.stadium,

        group: match.group&.name,

        home_team: {
          id: match.home_team.id,
          name: match.home_team.name,
          code: match.home_team.code,
          flag: match.home_team.flag
        },

        away_team: {
          id: match.away_team.id,
          name: match.away_team.name,
          code: match.away_team.code,
          flag: match.away_team.flag
        },

        home_score: match.home_score,
        away_score: match.away_score,

        prediction: current_user
          .predictions
          .find_by(match_id: match.id)
          &.slice(:id, :home_score, :away_score, :points_awarded)
      }
    }
  end
end