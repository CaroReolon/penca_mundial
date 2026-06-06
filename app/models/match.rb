class Match < ApplicationRecord
  belongs_to :tournament
  belongs_to :group, optional: true

  belongs_to :home_team,
             class_name: "Team",
             optional: true

  belongs_to :away_team,
             class_name: "Team",
             optional: true

  belongs_to :winner_team,
             class_name: "Team",
             optional: true

  belongs_to :next_match,
             class_name: "Match",
             optional: true

  has_many :predictions,
           dependent: :destroy

  enum :stage, {
    group_stage: 0,
    round_of_32: 1,
    round_of_16: 2,
    quarter_final: 3,
    semi_final: 4,
    third_place: 5,
    final: 6
  }

  enum :next_match_slot, {
    home: 0,
    away: 1
  }, allow_nil: true

  scope :upcoming, -> { where("kickoff_at > ?", Time.current) }
  scope :completed, -> { where(completed: true) }
  scope :group_stage, -> { where(stage: :group_stage) }

  validates :stage, presence: true
  validates :kickoff_at, presence: true

  after_update_commit :update_predictions_scores

  private

  def result_changed?
    saved_change_to_home_score? ||
      saved_change_to_away_score? ||
      saved_change_to_completed?
  end

  def update_predictions_scores
    return unless previous_changes.key?("home_score") ||
                  previous_changes.key?("away_score") ||
                  previous_changes.key?("completed")

    UpdateMatchPredictionsJob.perform_later(id)
  end
end