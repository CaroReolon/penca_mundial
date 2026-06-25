module Highlights
  module Calculators
    class LastMinute < HighlightCalculator
      MATCH_WINDOW  = 6
      CUTOFF_MINS   = 30

      def call
        Highlight.where(kind: :last_minute, play_group_id: play_group.id)
                 .update_all(shown: false)

        member_ids = play_group.members.pluck(:id)
        return if member_ids.empty?

        recent_matches = Match
          .where(tournament_id: play_group.tournament_id, completed: true)
          .order(kickoff_at: :desc)
          .limit(MATCH_WINDOW)

        return if recent_matches.empty?

        # Find predictions updated within 30 minutes before kickoff
        # Pick the one updated closest to kickoff (smallest positive gap)
        best_prediction = nil
        best_gap        = nil

        recent_matches.each do |match|
          cutoff = match.kickoff_at - CUTOFF_MINS.minutes

          Prediction
            .where(match_id: match.id, user_id: member_ids)
            .where('updated_at >= ? AND updated_at <= ?', cutoff, match.kickoff_at)
            .each do |pred|
              gap = match.kickoff_at - pred.updated_at
              if best_gap.nil? || gap < best_gap
                best_gap        = gap
                best_prediction = pred
                @best_match     = match
              end
            end
        end

        return unless best_prediction

        user  = best_prediction.user
        match = @best_match
        mins  = (best_gap / 60).round

        highlight = Highlight.find_or_initialize_by(kind: :last_minute, play_group_id: play_group.id)
        highlight.user           = user
        highlight.match          = match
        highlight.title          = "🚨 Última llamada"
        highlight.description    = "#{user.first_name} hizo un último cambio #{mins} minuto#{'s' if mins != 1} antes del inicio de #{match.home_team&.name} vs #{match.away_team&.name}."
        highlight.title_en       = "🚨 Last call"
        highlight.description_en = "#{user.first_name} made one final change #{mins} minute#{'s' if mins != 1} before kick-off in #{match.home_team&.name} vs #{match.away_team&.name}."  
        highlight.shown          = true
        highlight.save!
      end
    end
  end
end
