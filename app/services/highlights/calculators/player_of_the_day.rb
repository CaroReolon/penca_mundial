module Highlights
  module Calculators
    class PlayerOfTheDay < HighlightCalculator
      def call
        Highlight.where(kind: :player_of_the_day, play_group_id: play_group.id)
                 .update_all(shown: false)

        member_ids = play_group.members.pluck(:id)
        return if member_ids.empty?

        # Find the most recent calendar day (UTC) where every match is completed.
        # Group matches by date and walk backwards until we find a fully-done day.
        all_match_days = Match
          .where(tournament_id: play_group.tournament_id)
          .where('kickoff_at <= ?', Time.current)
          .order(kickoff_at: :desc)
          .pluck(:id, :kickoff_at, :completed)

        return if all_match_days.empty?

        by_day = all_match_days.group_by { |_, kickoff, _| kickoff.utc.to_date }

        last_complete_day = by_day.keys.sort.reverse.find do |date|
          by_day[date].all? { |_, _, completed| completed }
        end

        return unless last_complete_day

        match_ids_that_day = by_day[last_complete_day].map { |id, _, _| id }

        # Sum points per member for that day
        totals = Prediction
          .where(match_id: match_ids_that_day, user_id: member_ids)
          .group(:user_id)
          .sum(:points_awarded)

        return if totals.empty?

        top_points = totals.values.max
        return if top_points.to_i == 0

        top_user_id = totals.select { |_, pts| pts == top_points }.keys.first
        user = play_group.members.find(top_user_id)

        matches_count = match_ids_that_day.size
        date_label    = last_complete_day.strftime('%-d/%-m')

        highlight = Highlight.find_or_initialize_by(kind: :player_of_the_day, play_group_id: play_group.id)
        highlight.user           = user
        highlight.match          = nil
        highlight.title          = "🌟 Jugador del día"
        highlight.description    = "#{user.first_name} se levantó inspirado ayer y arrasó con #{top_points} pts en #{matches_count} partido#{'s' if matches_count != 1}."

        highlight.title_en       = "🌟 Player of the day"
        highlight.description_en = "#{user.first_name} woke up inspired yesterday and crushed it with #{top_points} pts across #{matches_count} match#{'es' if matches_count != 1}."
        highlight.shown          = true
        highlight.save!
      end
    end
  end
end
