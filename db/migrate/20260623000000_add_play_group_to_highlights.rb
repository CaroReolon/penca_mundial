class AddPlayGroupToHighlights < ActiveRecord::Migration[7.1]
  def change
    add_reference :highlights, :play_group, null: true, foreign_key: true
  end
end
