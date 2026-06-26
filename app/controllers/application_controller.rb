class ApplicationController < ActionController::API
  include PaperTrail::Rails::Controller

  before_action :set_paper_trail_whodunnit

  def user_for_paper_trail
    if current_user
      "user:#{current_user.id} (#{current_user.email})"
    else
      "app"
    end
  end
end
