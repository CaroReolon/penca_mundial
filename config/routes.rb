Rails.application.routes.draw do
  devise_for :users,
    path: '',
    path_names: {
      sign_in: 'login',
      sign_out: 'logout'
    }
  
  namespace :api do
    get  "me",         to: "me#show"
    put  "me/avatar",  to: "avatar#update"
    delete "me/avatar", to: "avatar#destroy"
    resources :matches, only: [:index]

    resources :tournaments, only: [:show, :index] do
      resources :tournament_rankings, only: [:show, :index]
    end

    resources :predictions, only: [:index, :create, :update]

    get 'users/:user_id/matches', to: 'user_matches#index'
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
