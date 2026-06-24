class Api::HighlightsController < ApplicationController
  before_action :authenticate_user!

  def index
    play_group = current_user.play_groups.find(params[:play_group_id])
    highlights = Highlight.where(play_group_id: play_group.id, shown: true)

    render json: highlights.map { |h|
      {
        id:              h.id,
        kind:            h.kind,
        title:           h.title,
        description:     h.description,
        title_en:        h.title_en,
        description_en:  h.description_en,
        shown:           h.shown,
        play_group_id:   h.play_group_id
      }
    }
  end
end
