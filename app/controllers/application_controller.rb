class ApplicationController < ActionController::API
  before_action :set_paper_trail_whodunnit

  def set_paper_trail_whodunnit
    PaperTrail.request.whodunnit = if current_user
      "user:#{current_user.id} (#{current_user.email})"
    else
      "app"
    end
  end
end
