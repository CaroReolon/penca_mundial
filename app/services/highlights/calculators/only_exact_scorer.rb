module Highlights
  module Calculators
    class OnlyExactScorer < HighlightCalculator
      def call
        # Hide stale record first; re-show if still valid below
        Highlight.where(kind: :only_exact_scorer, play_group_id: play_group.id)
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

        recent_matches.each do |match|
          exact_scorers = Prediction
            .joins(:user)
            .where(match_id: match.id, user_id: member_ids, points_awarded: 5)
            .includes(:user)

          next unless exact_scorers.size == 1

          user = exact_scorers.first.user

          highlight = Highlight.find_or_initialize_by(kind: :only_exact_scorer, play_group_id: play_group.id)
          highlight.match          = match
          highlight.user           = user
          highlight.title          = "🦄 Acierto legendario"
          highlight.description    = "Solo una persona vio venir ese resultado. #{user.first_name} acertó el marcador exacto en #{match.home_team&.name} vs #{match.away_team&.name}."
          highlight.title_en       = "🦄 Legendary prediction"
          highlight.description_en = "Only one person saw that result coming. #{user.first_name} predicted the exact score in #{match.home_team&.name} vs #{match.away_team&.name}."
          highlight.shown          = true
          highlight.save!

          return
        end
      end
    end
  end
end
