module Highlights
  class HighlightGenerator
    CALCULATORS = [
      Calculators::ExactScoreStreak,
      Calculators::NoPointsStreak,
      Calculators::OnlyUserScored,
      Calculators::NobodyScored
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