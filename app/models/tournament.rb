class Tournament < ApplicationRecord
  has_many :tournament_teams
  has_many :teams, through: :tournament_teams
  has_many :tournament_rankings
  has_many :play_groups

  has_many :groups
  has_many :matches

  enum :status, {
    scheduled: 0,
    in_progress: 1,
    finished: 2
  }
end