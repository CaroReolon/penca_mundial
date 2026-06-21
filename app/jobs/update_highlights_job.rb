class UpdateHighlightsJob < ApplicationJob
  queue_as :default

  def perform(match_id)
    match = Match.find(match_id)

    puts "Generating highlights for match #{match.id} - #{match.home_team&.name} vs #{match.away_team&.name}"

    match.tournament.play_groups.each do |play_group|
      Highlights::HighlightGenerator.call(play_group: play_group)
    end
  end
end
