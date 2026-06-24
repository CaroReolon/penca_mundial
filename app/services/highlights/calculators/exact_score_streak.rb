module Highlights
  module Calculators
    class ExactScoreStreak < HighlightCalculator
      STREAK_THRESHOLD = 2

      def call
        # Hide all stale records first; re-show valid ones below
        Highlight.where(kind: :exact_score_streak, play_group_id: play_group.id)
                 .update_all(shown: false)

        results = play_group.members.filter_map do |user|
          streak, last_match = compute_streak(user)
          next if streak <= STREAK_THRESHOLD

          { user: user, streak: streak, last_match: last_match }
        end

        return if results.empty?

        longest = results.max_by { |r| r[:streak] }[:streak]
        leaders = results.select { |r| r[:streak] == longest }
        unique_leader = leaders.size == 1

        leaders.each do |r|
          highlight = Highlight.find_or_initialize_by(
            kind: :exact_score_streak,
            play_group_id: play_group.id,
            user: r[:user]
          )
          highlight.match          = r[:last_match]
          highlight.title          = "🎯 ¡Racha exacta!"
          highlight.description    = "#{r[:user].first_name} acertó el marcador exacto en los últimos #{r[:streak]} partidos seguidos."
          highlight.title_en       = "🎯 Exact Score Streak!"
          highlight.description_en = "#{r[:user].first_name} nailed the exact score in the last #{r[:streak]} matches in a row."
          highlight.shown          = unique_leader
          highlight.save!
        end
      end

      private

      def compute_streak(user)
        predictions = Prediction
          .joins(:match)
          .where(
            user_id: user.id,
            matches: { tournament_id: play_group.tournament_id, completed: true }
          )
          .order('matches.kickoff_at DESC')
          .includes(:match)

        streak     = 0
        last_match = nil

        predictions.each do |prediction|
          break unless prediction.points_awarded == 5

          streak    += 1
          last_match = prediction.match if last_match.nil?
        end

        [streak, last_match]
      end
    end
  end
end
