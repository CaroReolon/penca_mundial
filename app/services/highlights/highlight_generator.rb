module Highlights
  class HighlightGenerator
    CALCULATORS = [
      Calculators::ExactScoreStreak,
      Calculators::ImpossibleMatch,
      Calculators::OnlyExactScorer,
      Calculators::PointsStreak,
      Calculators::NoPointsStreak,
      Calculators::WinnerGuesser,
      Calculators::OnlyOneScored
    ]

    def self.call(play_group:)
      CALCULATORS.each do |calculator|
        calculator.call(
          play_group: play_group
        )
      end
    end
  end
end