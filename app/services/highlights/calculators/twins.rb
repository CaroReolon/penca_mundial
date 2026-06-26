module Highlights
  module Calculators
    class Twins < HighlightCalculator
      MIN_MATCHES  = 3
      LOOKUP_WINDOW = 30

      def call
        Highlight.where(kind: :twins, play_group_id: play_group.id)
                 .update_all(shown: false)

        member_ids = play_group.members.pluck(:id)
        return if member_ids.size < 2

        # Fetch a broad window of recent matches (ordered newest first)
        all_match_ids = Match
          .where(tournament_id: play_group.tournament_id, completed: true)
          .order(kickoff_at: :desc)
          .limit(LOOKUP_WINDOW)
          .pluck(:id)

        return if all_match_ids.size < MIN_MATCHES

        predictions = Prediction
          .where(match_id: all_match_ids, user_id: member_ids)
          .pluck(:user_id, :match_id, :home_score, :away_score)

        by_user = predictions.each_with_object({}) do |(uid, mid, h, a), h_map|
          h_map[uid] ||= {}
          h_map[uid][mid] = [h, a]
        end

        user_ids = by_user.keys
        return if user_ids.size < 2

        best_pair  = nil
        best_count = 0

        user_ids.combination(2).each do |uid1, uid2|
          preds1 = by_user[uid1]
          preds2 = by_user[uid2]

          # Walk matches newest-first, count consecutive identical predictions
          count = 0
          all_match_ids.each do |mid|
            next unless preds1[mid] && preds2[mid]
            break if preds1[mid] != preds2[mid]
            count += 1
          end

          if count > best_count
            best_count = count
            best_pair  = [uid1, uid2]
          end
        end

        return if best_pair.nil? || best_count < MIN_MATCHES

        users = play_group.members.where(id: best_pair)
        u1, u2 = users.first, users.last

        highlight = Highlight.find_or_initialize_by(kind: :twins, play_group_id: play_group.id)
        highlight.user           = u1
        highlight.match          = nil
        highlight.title          = "👯 ¡Gemelos!"
        highlight.description    = "#{u1.first_name} y #{u2.first_name} apostaron exactamente lo mismo en los últimos #{best_count} partidos."
        highlight.title_en       = "👯 Twins!"
        highlight.description_en = "#{u1.first_name} and #{u2.first_name} predicted the exact same scores in the last #{best_count} matches."
        highlight.shown          = true
        highlight.save!
      end
    end
  end
end
