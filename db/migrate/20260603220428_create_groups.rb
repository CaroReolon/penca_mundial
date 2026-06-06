class CreateGroups < ActiveRecord::Migration[7.1]
  def change
    create_table :groups do |t|
      t.references :tournament, null: false, foreign_key: true
      t.string :name, null: false

      t.timestamps
    end

    add_index :groups,
              [:tournament_id, :name],
              unique: true
  end
end