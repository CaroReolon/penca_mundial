class Highlight < ApplicationRecord
  belongs_to :match
  belongs_to :user, optional: true

  enum :kind, {
    exact_score_streak: 0,
    no_points_streak:   1,
    only_user_scored:   2,
    nobody_scored:      3
  }
end
