class AddMessageToPlayGroupMemberships < ActiveRecord::Migration[7.1]
  def change
    add_column :play_group_memberships, :message, :string, limit: 100
  end
end
