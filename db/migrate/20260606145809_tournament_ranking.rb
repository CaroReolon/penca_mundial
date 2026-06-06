class TournamentRanking < ActiveRecord::Migration[7.1]
  def change
    create_table :tournament_rankings do |t|
      t.references :tournament, null: false
      t.references :user, null: false
    
      t.integer :points, default: 0, null: false
    
      t.integer :position
    
      t.integer :previous_position
    
      t.timestamps
    end
  end
end
