class PlayGroupMembership < ApplicationRecord
  belongs_to :play_group
  belongs_to :user

  enum :role, { member: 0, admin: 1 }
end
