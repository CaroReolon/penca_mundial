module Highlights
  module Calculators
    class WinnerGuesser < HighlightCalculator
      MATCH_WINDOW    = 12
      MIN_COUNT       = 7

      def call
        Highlight.where(kind: :winner_guesser, play_group_id: play_group.id)
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
          .limit(MATCH_WINDOW)
          .pluck(:id)

        return if recent_match_ids.empty?

        results = play_group.members.filter_map do |user|
          count = Prediction
            .where(user_id: user.id, match_id: recent_match_ids, points_awarded: 2)
            .count

          next if count < MIN_COUNT

          { user: user, count: count }
        end

        return if results.empty?

        highest = results.max_by { |r| r[:count] }[:count]
        leaders = results.select { |r| r[:count] == highest }
        unique_leader = leaders.size == 1

        leaders.each do |r|
          highlight = Highlight.find_or_initialize_by(
            kind: :winner_guesser,
            play_group_id: play_group.id,
            user: r[:user]
          )
          highlight.match          = nil
          highlight.title          = "🔭 Buen ojo, mala puntería"
          highlight.description    = "#{r[:user].first_name} ve venir al ganador, pero los números finales se le escapan."
          highlight.title_en       = "🔭 Good eye, bad aim"
          highlight.description_en = "#{r[:user].first_name} sees the winner coming, but the final score slips away every time."
          highlight.shown          = unique_leader
          highlight.save!
        end
      end
    end
  end
end
