class AddMultilingualFields < ActiveRecord::Migration[7.1]
  def up
    # Teams: add English name, English short name; rename existing short_name to proper Spanish short name
    add_column :teams, :name_en, :string
    add_column :teams, :short_name_en, :string

    # Matches: add English stadium name
    add_column :matches, :stadium_en, :string
  end

  def down
    remove_column :teams, :name_en
    remove_column :teams, :short_name_en
    remove_column :matches, :stadium_en
  end

end
