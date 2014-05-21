RailsTemplate::Application.routes.draw do
  namespace :cms do
  end

  devise_for :admins

  namespace :cms do
    resources :admins
    resources :galleries do
      resources :gallery_images
    end
  end

  root 'kuhsaft/pages#show'

  mount Kuhsaft::Engine => '/'

  get '(*url)' => 'kuhsaft/pages#show', :as => :page
end
