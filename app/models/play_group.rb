class PlayGroup < ApplicationRecord
  belongs_to :tournament
  belongs_to :creator, class_name: 'User', foreign_key: :created_by_id

  has_many :memberships,  class_name: 'PlayGroupMembership', dependent: :destroy
  has_many :members,      through: :memberships, source: :user
  has_many :invitations,  class_name: 'PlayGroupInvitation', dependent: :destroy

  validates :name, presence: true, length: { maximum: 60 }
end
