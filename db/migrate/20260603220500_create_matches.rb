class CreateMatches < ActiveRecord::Migration[7.1]
  def change
    create_table :matches do |t|
      t.references :tournament,
                   null: false,
                   foreign_key: true

      t.references :group,
                   foreign_key: true

      t.references :home_team,
                   null: true,
                   foreign_key: { to_table: :teams }

      t.references :away_team,
                   null: true,
                   foreign_key: { to_table: :teams }

      t.references :winner_team,
                   null: true,
                   foreign_key: { to_table: :teams }

      t.datetime :kickoff_at

      t.integer :home_score
      t.integer :away_score

      t.integer :stage, null: false

      t.references :next_match,
                   foreign_key: {
                     to_table: :matches
                   }

      t.integer :next_match_slot

      t.boolean :completed,
                null: false,
                default: false

      t.timestamps
    end
  end
end