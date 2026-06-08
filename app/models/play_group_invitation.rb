class PlayGroupInvitation < ApplicationRecord
  belongs_to :play_group
  belongs_to :invited_by, class_name: 'User', foreign_key: :invited_by_id
  belongs_to :accepted_by, class_name: 'User', foreign_key: :accepted_by_id, optional: true

  enum :status, { pending: 0, accepted: 1, declined: 2 }

  validates :token, presence: true, uniqueness: true

  before_validation :generate_token, on: :create

  private

  def generate_token
    self.token ||= SecureRandom.urlsafe_base64(20)
  end
end
