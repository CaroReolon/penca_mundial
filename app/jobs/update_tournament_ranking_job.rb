class UpdateTournamentRankingJob < ApplicationJob
  queue_as :default

  def perform(tournament_id)
    tournament = Tournament.find(tournament_id)

    puts "RECALCULATING RANKING FOR TOURNAMENT #{tournament.id}"

    rankings = calculate_rankings(tournament)

    ActiveRecord::Base.transaction do
      rankings.each_with_index do |data, index|
        ranking = TournamentRanking.find_or_initialize_by(
          tournament: tournament,
          user_id: data[:user_id]
        )

        ranking.previous_position = ranking.position
        ranking.points = data[:points]
        ranking.position = index + 1

        ranking.save!
      end
    end
  end

  private

  def calculate_rankings(tournament)
    Prediction
      .joins(:match)
      .where(matches: { tournament_id: tournament.id })
      .group(:user_id)
      .select("user_id, SUM(points_awarded) as points")
      .order("points DESC")
      .map do |row|
        {
          user_id: row.user_id,
          points: row.points.to_i
        }
      end
  end
end