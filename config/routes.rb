Ptaatlantis::Application.routes.draw do
  devise_for :admins

  concern :sortable do
    post :reorder, on: :collection
  end

  namespace :cms do
    resources :admins
    resources :mappins
    resources :activities
    resources :galleries do
      resources :gallery_images, concerns: :sortable
    end
  end

  root 'kuhsaft/pages#show'

  mount Kuhsaft::Engine => '/'

  get '(*url)' => 'kuhsaft/pages#show', :as => :page
end
