Rails.application.routes.draw do
  devise_for :users,
    path: 'api',
    path_names: {
      sign_in:  'login',
      sign_out: 'logout',
      sign_up:  'register'
    },
    controllers: {
      registrations: 'users/registrations'
    }

  namespace :api do
    get    "me",         to: "me#show"
    put    "me/avatar",  to: "avatar#update"
    delete "me/avatar",  to: "avatar#destroy"

    resources :matches, only: [:index]

    resources :tournaments, only: [:show, :index] do
      resources :tournament_rankings, only: [:show, :index]
    end

    resources :predictions, only: [:index, :create, :update]

    get 'users/:user_id/matches', to: 'user_matches#index'

    resources :play_groups, only: [:index, :create, :show, :destroy] do
      resources :invitations, only: [:create, :destroy],
                              controller: 'play_group_invitations'
      delete 'leave',            to: 'invitations#leave',              on: :member
      delete 'members/:user_id', to: 'play_group_memberships#destroy', on: :member
    end

    get  'invitations/:token',        to: 'invitations#show'
    post 'invitations/:token/accept', to: 'invitations#accept'

    namespace :admin do
      resources :matches, only: [:index, :create, :update]
      resources :teams,   only: [:index]
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
