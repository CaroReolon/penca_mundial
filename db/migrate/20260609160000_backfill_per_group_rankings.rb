class BackfillPerGroupRankings < ActiveRecord::Migration[7.1]
  def up
    # For each play group, derive per-group rankings from the existing global records
    # (global records = those with play_group_id IS NULL, created before this migration)
    PlayGroup.find_each do |group|
      tournament_id = group.tournament_id
      member_ids    = group.memberships.pluck(:user_id)
      next if member_ids.empty?

      # Fetch global rankings for members of this group, ordered by points desc
      global_rankings = TournamentRanking
        .where(tournament_id: tournament_id, user_id: member_ids, play_group_id: nil)
        .order(points: :desc, created_at: :asc)

      global_rankings.each_with_index do |r, i|
        TournamentRanking.create!(
          tournament_id:     tournament_id,
          user_id:           r.user_id,
          play_group_id:     group.id,
          points:            r.points,
          position:          i + 1,
          previous_position: r.previous_position
        )
      end
    end

    # Remove the old global (group-less) records — they are now replaced by
    # per-group records above.
    TournamentRanking.where(play_group_id: nil).delete_all
  end

  def down
    raise ActiveRecord::IrreversibleMigration,
      "Cannot restore global rankings from per-group data. Re-run UpdateTournamentRankingJob instead."
  end
end
