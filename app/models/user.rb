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
end
