class Api::MeController < ApplicationController
  before_action :authenticate_user!

  def show
    render json: {
      id: current_user.id,
      first_name: current_user.first_name,
      last_name: current_user.last_name,
      email: current_user.email
    }
  end
end