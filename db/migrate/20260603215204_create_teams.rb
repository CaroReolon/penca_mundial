class CreateTeams < ActiveRecord::Migration[7.1]
  def change
    create_table :teams do |t|
      t.string :name, null: false
      t.string :short_name, null: false
      t.string :code, null: false
      t.string :flag, null: false
      t.string :confederation, null: false

      t.timestamps
    end

    add_index :teams, :code, unique: true
  end
end