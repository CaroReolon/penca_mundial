class Team < ApplicationRecord
  CONFEDERATIONS = %w[
    CONMEBOL
    CONCACAF
    UEFA
    CAF
    AFC
    OFC
  ].freeze

  has_many :tournament_teams

  has_many :home_matches,
           class_name: "Match",
           foreign_key: :home_team_id

  has_many :away_matches,
           class_name: "Match",
           foreign_key: :away_team_id

  validates :name, presence: true
  validates :code, presence: true, uniqueness: true
  validates :flag, presence: true

  validates :confederation,
            presence: true,
            inclusion: { in: CONFEDERATIONS }
end