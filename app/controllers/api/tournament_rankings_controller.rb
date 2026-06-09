class Api::TournamentRankingsController < ApplicationController
  def show
    tournament = Tournament.find(params[:tournament_id])

    ranking = tournament.tournament_rankings
      .includes(user: { avatar_attachment: :blob })
      .find_by(user_id: params[:id], play_group_id: params[:play_group_id])

    return render json: { error: 'Not found' }, status: :not_found unless ranking

    render json: {
      user: {
        id:         ranking.user.id,
        name:       ranking.user.name,
        email:      ranking.user.email,
        avatar_url: avatar_url_for(ranking.user)
      },
      points:            ranking.points,
      position:          ranking.position,
      previous_position: ranking.previous_position
    }
  end

  def index
    return render json: [] unless params[:play_group_id].present?

    tournament = Tournament.find(params[:tournament_id])

    rankings = tournament.tournament_rankings
      .includes(user: { avatar_attachment: :blob })
      .where(play_group_id: params[:play_group_id])
      .order(:position)

    render json: rankings.map { |ranking|
      {
        user: {
          id:         ranking.user.id,
          name:       "#{ranking.user.first_name} #{ranking.user.last_name}",
          email:      ranking.user.email,
          avatar_url: avatar_url_for(ranking.user)
        },
        points:            ranking.points,
        position:          ranking.position,
        previous_position: ranking.previous_position
      }
    }
  end

  private

  def avatar_url_for(user)
    return nil unless user.avatar.attached?
    rails_blob_url(user.avatar, host: request.base_url)
  end
end
