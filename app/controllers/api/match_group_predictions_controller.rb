class Api::MatchGroupPredictionsController < ApplicationController
  before_action :authenticate_user!

  # GET /api/matches/:match_id/group_predictions?play_group_id=X
  def index
    match = Match.includes(:home_team, :away_team).find(params[:id])
    play_group = current_user.play_groups.find(params[:play_group_id])

    members = play_group.members.includes(:predictions)

    predictions_by_user = Prediction
      .where(match_id: match.id, user_id: members.map(&:id))
      .index_by(&:user_id)

    render json: {
      match: {
        id:         match.id,
        home_team:  serialize_team(match.home_team),
        away_team:  serialize_team(match.away_team),
        home_score: match.home_score,
        away_score: match.away_score,
        completed:  match.completed,
        kickoff_at: match.kickoff_at,
        stage:      match.stage,
        group:      match.group&.name
      },
      members: members.map do |user|
        pred = predictions_by_user[user.id]
        {
          id:         user.id,
          name:       "#{user.first_name} #{user.last_name}",
          avatar_url: avatar_url_for(user),
          prediction: pred ? {
            home_score:     pred.home_score,
            away_score:     pred.away_score,
            points_awarded: pred.points_awarded
          } : nil
        }
      end
    }
  end

  private

  def serialize_team(team)
    return nil unless team
    {
      name:          team.name,
      name_en:       team.name_en,
      short_name:    team.short_name,
      short_name_en: team.short_name_en,
      flag:          team.flag,
      code:          team.code
    }
  end

  def avatar_url_for(user)
    return nil unless user.avatar.attached?
    rails_blob_url(user.avatar, host: request.base_url)
  end
end
