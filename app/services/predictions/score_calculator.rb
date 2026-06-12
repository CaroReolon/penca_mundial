module Predictions
  class ScoreCalculator
    def initialize(prediction)
      @prediction = prediction
      @match = prediction.match
    end

    def call
      return 0 unless @match.home_score.present? && @match.away_score.present?

      if exact_score?
        5
      elsif goal_difference_matches?
        3
      elsif winner_matches?
        2
      else
        0
      end
    end

    private

    attr_reader :prediction, :match

    def exact_score?
      prediction.home_score == match.home_score &&
        prediction.away_score == match.away_score
    end

    def goal_difference_matches?
      predicted_difference == actual_difference
    end

    def winner_matches?
      predicted_result == actual_result
    end

    def predicted_difference
      prediction.home_score - prediction.away_score
    end

    def actual_difference
      match.home_score - match.away_score
    end

    def predicted_result
      result_for(
        prediction.home_score,
        prediction.away_score
      )
    end

    def actual_result
      result_for(
        match.home_score,
        match.away_score
      )
    end

    def result_for(home, away)
      return :home if home > away
      return :away if away > home

      :draw
    end
  end
end