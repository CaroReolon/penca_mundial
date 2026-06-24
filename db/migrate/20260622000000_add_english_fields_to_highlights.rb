class AddEnglishFieldsToHighlights < ActiveRecord::Migration[7.1]
  def change
    add_column :highlights, :title_en, :string
    add_column :highlights, :description_en, :text
  end
end
