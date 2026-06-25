class Highlight < ApplicationRecord
  belongs_to :match, optional: true
  belongs_to :user, optional: true
  belongs_to :play_group, optional: true

  enum :kind, {
    exact_score_streak: 0,
    no_points_streak:   1,
    only_user_scored:   2,
    nobody_scored:      3,
    impossible_match:   4,
    only_exact_scorer:  5,
    points_streak:      6,
    winner_guesser:     8,
    only_one_scored:    9,
    twins:              10,
    last_minute:        11
  }
end
