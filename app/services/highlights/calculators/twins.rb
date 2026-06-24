module Highlights
  module Calculators
    class Twins < HighlightCalculator
      MATCH_WINDOW = 3

      def call
        Highlight.where(kind: :twins, play_group_id: play_group.id)
                 .update_all(shown: false)

        member_ids = play_group.members.pluck(:id)
        return if member_ids.size < 2

        recent_match_ids = Match
          .where(
            id: Prediction.where(user_id: member_ids).select(:match_id),
            tournament_id: play_group.tournament_id,
            completed: true
          )
          .order(kickoff_at: :desc)
          .limit(MATCH_WINDOW)
          .pluck(:id)

        return if recent_match_ids.size < MATCH_WINDOW

        # Build a prediction map: { user_id => { match_id => [home, away] } }
        predictions = Prediction
          .where(match_id: recent_match_ids, user_id: member_ids)
          .pluck(:user_id, :match_id, :home_score, :away_score)

        by_user = predictions.each_with_object({}) do |(uid, mid, h, a), h_map|
          h_map[uid] ||= {}
          h_map[uid][mid] = [h, a]
        end

        # Only consider users who have predictions for all MATCH_WINDOW matches
        complete_users = by_user.select { |_, preds| preds.size == MATCH_WINDOW }
        return if complete_users.size < 2

        user_ids = complete_users.keys
        twin_pair = nil

        user_ids.combination(2).each do |uid1, uid2|
          preds1 = complete_users[uid1]
          preds2 = complete_users[uid2]

          identical = recent_match_ids.all? { |mid| preds1[mid] == preds2[mid] }
          next unless identical

          twin_pair = [uid1, uid2]
          break
        end

        return unless twin_pair

        users = play_group.members.where(id: twin_pair)
        u1, u2 = users.first, users.last

        highlight = Highlight.find_or_initialize_by(kind: :twins, play_group_id: play_group.id)
        highlight.user           = u1
        highlight.match          = nil
        highlight.title          = "👯 ¡Gemelos!"
        highlight.description    = "#{u1.first_name} y #{u2.first_name} apostaron exactamente lo mismo en los últimos #{MATCH_WINDOW} partidos."
        highlight.title_en       = "👯 Twins!"
        highlight.description_en = "#{u1.first_name} and #{u2.first_name} predicted the exact same scores in the last #{MATCH_WINDOW} matches."
        highlight.shown          = true
        highlight.save!
      end
    end
  end
end
