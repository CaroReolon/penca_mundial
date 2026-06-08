class User < ApplicationRecord
  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :validatable,
         :jwt_authenticatable,
         jwt_revocation_strategy: Devise::JWT::RevocationStrategies::Null

  validates :first_name, presence: true
  validates :last_name, presence: true

  has_many :predictions, dependent: :destroy
  has_one_attached :avatar

  has_many :play_group_memberships, class_name: 'PlayGroupMembership', dependent: :destroy
  has_many :play_groups, through: :play_group_memberships

  def can_view_profile_of?(other_user)
    return true if id == other_user.id
    my_ids    = play_group_ids
    other_ids = other_user.play_group_ids
    return true if my_ids.empty? || other_ids.empty?
    (my_ids & other_ids).any?
  end
end
