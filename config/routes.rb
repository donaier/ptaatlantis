RailsTemplate::Application.routes.draw do
  devise_for :admins

  namespace :cms do
    resources :admins
    resources :galleries
  end

  root 'kuhsaft/pages#show'

  mount Kuhsaft::Engine => '/'

  get '(*url)' => 'kuhsaft/pages#show', :as => :page
end
