class Api::TournamentRankingsController < ApplicationController
  def show
    tournament = Tournament.find(params[:tournament_id])

    ranking = tournament.tournament_rankings
      .includes(:user)
      .find_by(user_id: params[:id])

    render json: {
      user: {
        id: ranking.user.id,
        name: ranking.user.name,
        email: ranking.user.email
      },
      points: ranking.points,
      position: ranking.position,
      previous_position: ranking.previous_position
    }
  end

  def index 
    tournament = Tournament.find(params[:tournament_id])

    rankings = tournament.tournament_rankings
      .includes(:user)
      .order(:position)

    render json: rankings.map { |ranking|
      {
        user: {
          id: ranking.user.id,
          name: ranking.user.first_name + " " + ranking.user.last_name,
          email: ranking.user.email
        },
        points: ranking.points,
        position: ranking.position,
        previous_position: ranking.previous_position
      }
    }
  end
end