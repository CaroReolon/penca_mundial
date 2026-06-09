class TournamentRanking < ApplicationRecord
  belongs_to :tournament
  belongs_to :user
  belongs_to :play_group, optional: true
end