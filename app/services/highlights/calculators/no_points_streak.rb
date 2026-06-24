module Highlights
  module Calculators
    class NoPointsStreak < HighlightCalculator
      STREAK_THRESHOLD = 5

      def call
        Highlight.where(kind: :no_points_streak, play_group_id: play_group.id)
                 .update_all(shown: false)

        results = play_group.members.filter_map do |user|
          streak, last_match = compute_active_streak(user)
          next if streak < STREAK_THRESHOLD

          { user: user, streak: streak, last_match: last_match }
        end

        return if results.empty?

        longest = results.max_by { |r| r[:streak] }[:streak]
        leaders = results.select { |r| r[:streak] == longest }
        unique_leader = leaders.size == 1

        leaders.each do |r|
          highlight = Highlight.find_or_initialize_by(
            kind: :no_points_streak,
            play_group_id: play_group.id,
            user: r[:user]
          )
          highlight.match          = r[:last_match]
          highlight.title          = "🚑 Que alguien lo ayude"
          highlight.description    = "#{r[:user].first_name} ya lleva #{r[:streak]} partidos seguidos sin sumar puntos."
          highlight.title_en       = "🚑 Send help!"
          highlight.description_en = "#{r[:user].first_name} has now gone #{r[:streak]} matches in a row without scoring a single point."
          highlight.shown          = unique_leader
          highlight.save!
        end
      end

      private

      def compute_active_streak(user)
        # Only count completed matches where the user actually submitted a prediction
        completed_match_ids = Match
          .where(tournament_id: play_group.tournament_id, completed: true)
          .pluck(:id)

        predictions = Prediction
          .joins(:match)
          .where(user_id: user.id, match_id: completed_match_ids)
          .order('matches.kickoff_at DESC')
          .includes(:match)

        # The streak must start from the user's most recent prediction.
        # If their latest prediction has points, streak is 0.
        streak     = 0
        last_match = nil

        predictions.each do |pred|
          break unless pred.points_awarded.to_i == 0

          streak    += 1
          last_match = pred.match if last_match.nil?
        end

        [streak, last_match]
      end
    end
  end
end
