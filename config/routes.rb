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

  # Devise's sign_up path_name only affects GET /api/register (new action).
  # The POST (create) defaults to /api, so we add the correct path explicitly.
  devise_scope :user do
    post 'api/register', to: 'users/registrations#create'
  end

  namespace :api do
    post 'password/forgot', to: 'passwords#forgot'
    post 'password/reset',  to: 'passwords#reset'

    get    "me",         to: "me#show"
    put    "me/avatar",  to: "avatar#update"
    delete "me/avatar",  to: "avatar#destroy"

    resources :matches, only: [:index] do
      get :group_predictions, on: :member, to: 'match_group_predictions#index'
    end

    resources :tournaments, only: [:show, :index] do
      resources :tournament_rankings, only: [:show, :index]
    end

    resources :predictions, only: [:index, :create, :update]

    get 'users/:user_id/matches', to: 'user_matches#index'

    resources :play_groups, only: [:index, :create, :show, :destroy] do
      resources :highlights, only: [:index]
      resources :invitations, only: [:create, :destroy],
                              controller: 'play_group_invitations'
      delete 'leave',            to: 'invitations#leave',              on: :member
      delete 'members/:user_id', to: 'play_group_memberships#destroy', on: :member
      put    'message',          to: 'play_group_memberships#update_message', on: :member
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
