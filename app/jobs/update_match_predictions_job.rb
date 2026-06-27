class UpdateMatchPredictionsJob < ApplicationJob
  queue_as :default

  def perform(match_id)
    match = Match.find(match_id)

    match.predictions.find_each do |prediction|
      prediction.update_columns(
        points_awarded: Predictions::ScoreCalculator.new(prediction).call
      )
    end

    UpdateTournamentRankingJob.perform_later(match.tournament_id)
  end
end