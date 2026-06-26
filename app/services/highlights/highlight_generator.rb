module Highlights
  class HighlightGenerator
    CALCULATORS = [
      Calculators::ExactScoreStreak,
      Calculators::ImpossibleMatch,
      Calculators::OnlyExactScorer,
      Calculators::PointsStreak,
      Calculators::NoPointsStreak,
      Calculators::WinnerGuesser,
      Calculators::OnlyOneScored,
      Calculators::Twins,
      Calculators::LastMinute,
      Calculators::PlayerOfTheDay
    ]

    def self.call(play_group:)
      CALCULATORS.each do |calculator|
        calculator.call(play_group: play_group)
      rescue => e
        Rails.logger.error "[HighlightGenerator] #{calculator} failed: #{e.class} #{e.message}\n#{e.backtrace.first(5).join("\n")}"
      end
    end
  end
end