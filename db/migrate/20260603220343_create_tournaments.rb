class CreateTournaments < ActiveRecord::Migration[7.1]
  def change
    create_table :tournaments do |t|
      t.string :name, null: false
      t.date :start_date
      t.date :end_date
      t.integer :status, null: false, default: 0

      t.timestamps
    end
  end
end