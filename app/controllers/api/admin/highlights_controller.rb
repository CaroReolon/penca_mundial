class Api::Admin::HighlightsController < ApplicationController
  include AdminRequired
  before_action :authenticate_user!

  def run
    last_match = Match.where(completed: true).order(kickoff_at: :desc).first
    return render json: { error: 'No completed matches found' }, status: :unprocessable_entity unless last_match

    UpdateHighlightsJob.perform_later(last_match.id)
    render json: { message: 'Highlights job enqueued' }
  end
end
