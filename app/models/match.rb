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
  after_update_commit :update_highlights, if: -> { saved_change_to_completed?(to: true) }

  private

  def update_predictions_scores
    return unless previous_changes.key?("home_score") ||
                  previous_changes.key?("away_score")

    UpdateMatchPredictionsJob.perform_later(id)
  end

  def update_highlights
    UpdateHighlightsJob.perform_later(id)
  end
end