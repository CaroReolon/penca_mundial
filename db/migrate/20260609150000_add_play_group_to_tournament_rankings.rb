class AddPlayGroupToTournamentRankings < ActiveRecord::Migration[7.1]
  def change
    add_column :tournament_rankings, :play_group_id, :bigint

    add_index :tournament_rankings, :play_group_id

    # Unique ranking record per user per group per tournament
    add_index :tournament_rankings,
              [:tournament_id, :user_id, :play_group_id],
              unique: true,
              name: 'index_tournament_rankings_on_tournament_user_group'
  end
end
