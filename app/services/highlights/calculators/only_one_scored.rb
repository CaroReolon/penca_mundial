module Highlights
  module Calculators
    class OnlyOneScored < HighlightCalculator
      def call
        Highlight.where(kind: :only_one_scored, play_group_id: play_group.id)
                 .update_all(shown: false)

        member_ids = play_group.members.pluck(:id)
        return if member_ids.empty?

        recent_match_ids = Match
          .where(
            id: Prediction.where(user_id: member_ids).select(:match_id),
            tournament_id: play_group.tournament_id,
            completed: true
          )
          .order(kickoff_at: :desc)
          .limit(10)
          .pluck(:id)

        return if recent_match_ids.empty?

        qualifying_match = nil
        qualifying_user  = nil

        recent_match_ids.each do |match_id|
          scorers = Prediction
            .joins(:user)
            .where(match_id: match_id, user_id: member_ids)
            .where('points_awarded >= 2')
            .includes(:user)

          next unless scorers.size == 1

          qualifying_match = Match.includes(:home_team, :away_team).find(match_id)
          qualifying_user  = scorers.first.user
          break
        end

        return unless qualifying_match

        highlight = Highlight.find_or_initialize_by(kind: :only_one_scored, play_group_id: play_group.id)
        highlight.match          = qualifying_match
        highlight.user           = qualifying_user
        highlight.title          = "🎪 El distinto" 
        highlight.description = "#{qualifying_user.first_name} apostó por la sorpresa en #{qualifying_match.home_team&.name} vs #{qualifying_match.away_team&.name}... Y le salió."
        highlight.title_en       = "🎪 The odd one out"
        highlight.description_en = "#{qualifying_user.first_name} backed the upset in #{qualifying_match.home_team&.name} vs #{qualifying_match.away_team&.name}... and it paid off."
        highlight.shown          = true
        highlight.save!
      end
    end
  end
end
