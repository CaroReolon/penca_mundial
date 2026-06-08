class CreatePlayGroups < ActiveRecord::Migration[7.1]
  def change
    create_table :play_groups do |t|
      t.string  :name,           null: false
      t.bigint  :tournament_id,  null: false
      t.bigint  :created_by_id,  null: false
      t.timestamps
    end

    add_index :play_groups, :tournament_id

    create_table :play_group_memberships do |t|
      t.bigint  :play_group_id, null: false
      t.bigint  :user_id,       null: false
      t.integer :role,          null: false, default: 0  # 0: member, 1: admin
      t.timestamps
    end

    add_index :play_group_memberships, [:play_group_id, :user_id], unique: true
    add_index :play_group_memberships, :user_id
    add_foreign_key :play_group_memberships, :play_groups
    add_foreign_key :play_group_memberships, :users

    create_table :play_group_invitations do |t|
      t.bigint  :play_group_id,  null: false
      t.string  :email,          null: false
      t.bigint  :invited_by_id,  null: false
      t.string  :token,          null: false
      t.integer :status,         null: false, default: 0  # 0: pending, 1: accepted, 2: declined
      t.bigint  :accepted_by_id
      t.timestamps
    end

    add_index :play_group_invitations, :token, unique: true
    add_index :play_group_invitations, :play_group_id
    add_foreign_key :play_group_invitations, :play_groups
  end
end
