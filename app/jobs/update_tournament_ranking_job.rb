class UpdateTournamentRankingJob < ApplicationJob
  queue_as :default

  def perform(tournament_id)
    tournament = Tournament.find(tournament_id)

    puts "RECALCULATING RANKING FOR TOURNAMENT #{tournament.id}"

    # Compute total points per user across all predictions in this tournament
    points_by_user = Prediction
      .joins(:match)
      .where(matches: { tournament_id: tournament.id })
      .group(:user_id)
      .sum(:points_awarded)
    # => { user_id => total_points }

    # Recalculate rankings independently for each play group
    tournament.play_groups.each do |group|
      member_ids = group.memberships.pluck(:user_id)
      next if member_ids.empty?

      # Only rank members who have made at least one prediction
      ranked = member_ids
        .select { |uid| points_by_user.key?(uid) }
        .map    { |uid| { user_id: uid, points: points_by_user[uid].to_i } }
        .sort_by { |r| -r[:points] }

      ActiveRecord::Base.transaction do
        ranked.each_with_index do |data, index|
          ranking = TournamentRanking.find_or_initialize_by(
            tournament:    tournament,
            user_id:       data[:user_id],
            play_group_id: group.id
          )

          ranking.previous_position = ranking.position
          ranking.points            = data[:points]
          ranking.position          = index + 1

          ranking.save!
        end
      end
    end
  end
end
