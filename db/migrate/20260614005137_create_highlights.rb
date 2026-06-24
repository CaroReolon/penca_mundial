class CreateHighlights < ActiveRecord::Migration[7.1]
  def change
    create_table :highlights do |t|
      t.references :match, foreign_key: true
      t.references :user, foreign_key: true, null: true

      t.integer :kind, null: false
      t.string :title, null: false
      t.text :description

      t.boolean :shown, default: false, null: false

      t.timestamps
    end
  end
end