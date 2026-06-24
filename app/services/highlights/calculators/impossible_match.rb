module Highlights
  module Calculators
    class ImpossibleMatch < HighlightCalculator
      def call
        # Hide stale record first; re-show if still valid below
        Highlight.where(kind: :impossible_match, play_group_id: play_group.id)
                 .update_all(shown: false)

        member_ids = play_group.members.pluck(:id)
        return if member_ids.empty?

        recent_matches = Match
          .joins(:predictions)
          .where(
            predictions: { user_id: member_ids },
            tournament_id: play_group.tournament_id,
            completed: true
          )
          .order(kickoff_at: :desc)
          .distinct
          .limit(12)

        impossible = recent_matches.find do |match|
          points = Prediction
            .where(match_id: match.id, user_id: member_ids)
            .pluck(:points_awarded)

          points.any? && points.all? { |p| p == 0 }
        end

        return unless impossible

        highlight = Highlight.find_or_initialize_by(kind: :impossible_match, play_group_id: play_group.id)
        highlight.match          = impossible
        highlight.title          = "😵 ¡Partido imposible!"
        highlight.description    = "Nadie en el grupo acertó nada en #{impossible.home_team&.name} vs #{impossible.away_team&.name}."
        highlight.title_en       = "😵 Impossible Match!"
        highlight.description_en = "Nobody in the group got any points in #{impossible.home_team&.name} vs #{impossible.away_team&.name}."
        highlight.shown          = true
        highlight.save!
      end
    end
  end
end
