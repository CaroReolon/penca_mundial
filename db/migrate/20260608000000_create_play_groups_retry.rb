class CreatePlayGroupsRetry < ActiveRecord::Migration[7.1]
  def change
    create_table :play_groups, if_not_exists: true do |t|
      t.string  :name,          null: false
      t.bigint  :tournament_id, null: false
      t.bigint  :created_by_id, null: false
      t.timestamps
    end

    add_index :play_groups, :tournament_id,
              if_not_exists: true

    create_table :play_group_memberships, if_not_exists: true do |t|
      t.bigint  :play_group_id, null: false
      t.bigint  :user_id,       null: false
      t.integer :role,          null: false, default: 0
      t.timestamps
    end

    add_index :play_group_memberships, [:play_group_id, :user_id],
              unique: true, name: 'idx_play_group_memberships_unique',
              if_not_exists: true
    add_index :play_group_memberships, :user_id,
              if_not_exists: true

    create_table :play_group_invitations, if_not_exists: true do |t|
      t.bigint  :play_group_id,  null: false
      t.string  :email,          null: false
      t.bigint  :invited_by_id,  null: false
      t.string  :token,          null: false
      t.integer :status,         null: false, default: 0
      t.bigint  :accepted_by_id
      t.timestamps
    end

    add_index :play_group_invitations, :token,
              unique: true, if_not_exists: true
    add_index :play_group_invitations, :play_group_id,
              if_not_exists: true
  end
end
