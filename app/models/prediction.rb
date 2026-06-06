class Prediction < ApplicationRecord
  belongs_to :user
  belongs_to :match

  validates :home_score, numericality: {
    greater_than_or_equal_to: 0
  }

  validates :away_score, numericality: {
    greater_than_or_equal_to: 0
  }

  # validate :match_has_not_started, if: :prediction_changed?

  after_create :ensure_ranking
  
  def recalculate_points!
    update!(
      points_awarded:
        Predictions::ScoreCalculator
          .new(self)
          .call
    )
  end

  private

  def prediction_changed?
    will_save_change_to_home_score? ||
      will_save_change_to_away_score?
  end

  def match_has_not_started
    return unless match.present?

    if match.kickoff_at <= Time.current
      errors.add(
        :base,
        "Predictions can no longer be modified after kickoff"
      )
    end
  end

  def ensure_ranking
    TournamentRanking.find_or_create_by!(
      tournament: match.tournament,
      user: user,
      points: 0,
      position: match.tournament.tournament_rankings.count + 1,
      previous_position: match.tournament.tournament_rankings.count + 1
    )
  end

end