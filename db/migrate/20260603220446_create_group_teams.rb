class CreateGroupTeams < ActiveRecord::Migration[7.1]
  def change
    create_table :group_teams do |t|
      t.references :group, null: false, foreign_key: true
      t.references :team, null: false, foreign_key: true

      t.timestamps
    end

    add_index :group_teams,
              [:group_id, :team_id],
              unique: true
  end
end