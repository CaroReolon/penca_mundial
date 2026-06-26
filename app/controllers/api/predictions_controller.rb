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
      render json: serialize(prediction)
    else
      render json: { errors: prediction.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    prediction = current_user.predictions.find(params[:id])

    if prediction.update(prediction_params)
      render json: serialize(prediction)
    else
      render json: { errors: prediction.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def serialize(prediction)
    {
      id: prediction.id,
      match_id: prediction.match_id,
      home_score: prediction.home_score,
      away_score: prediction.away_score,
      points_awarded: prediction.points_awarded,
      penalty_winner_team_id: prediction.penalty_winner_team_id
    }
  end

  def prediction_params
    params.require(:prediction).permit(
      :match_id,
      :home_score,
      :away_score,
      :penalty_winner_team_id
    )
  end
end
