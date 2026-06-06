class Api::PredictionsController < ApplicationController
  before_action :authenticate_user!

  def index
    predictions = current_user.predictions.includes(:match)

    render json: predictions.map { |prediction|
      {
        id: prediction.id,

        match_id: prediction.match_id,

        home_score: prediction.home_score,

        away_score: prediction.away_score
      }
    }
  end

  def create
    prediction = current_user.predictions.new(prediction_params)

    if prediction.save
      render json: {
        id: prediction.id,

        match_id: prediction.match_id,

        home_score: prediction.home_score,

        away_score: prediction.away_score
      }
    else
      render json: { errors: prediction.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    prediction = current_user.predictions.find(params[:id])

    if prediction.update(prediction_params)
      render json: {
        id: prediction.id,

        match_id: prediction.match_id,

        home_score: prediction.home_score,

        away_score: prediction.away_score
      }
    else
      render json: { errors: prediction.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def prediction_params
    params.require(:prediction).permit(
      :match_id,
      :home_score,
      :away_score
    )
  end
end
