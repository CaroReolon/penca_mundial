class AddPenaltyToMatchesAndPredictions < ActiveRecord::Migration[7.1]
  def change
    add_column :matches, :went_to_penalties, :boolean, default: false, null: false
    add_reference :matches, :penalty_winner_team, null: true, foreign_key: { to_table: :teams }

    add_reference :predictions, :penalty_winner_team, null: true, foreign_key: { to_table: :teams }
  end
end
