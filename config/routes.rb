Rails.application.routes.draw do
  devise_for :users,
    path: '',
    path_names: {
      sign_in: 'login',
      sign_out: 'logout'
    }
  
  namespace :api do
    get "me", to: "me#show"    
    resources :matches, only: [:index]

    resources :tournaments, only: [:show, :index] do
      resources :tournament_rankings, only: [:show, :index]
    end

    resources :predictions, only: [:index, :create, :update]
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
