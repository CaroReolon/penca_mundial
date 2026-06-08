class MakeInvitationEmailOptional < ActiveRecord::Migration[7.1]
  def change
    change_column_null :play_group_invitations, :email, true
    change_column_default :play_group_invitations, :email, from: nil, to: nil
  end
end
