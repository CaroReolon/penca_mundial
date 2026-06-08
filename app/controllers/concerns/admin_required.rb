module AdminRequired
  extend ActiveSupport::Concern

  included do
    before_action :require_admin!
  end

  private

  def require_admin!
    unless current_user&.admin?
      render json: { error: 'Forbidden' }, status: :forbidden
    end
  end
end
