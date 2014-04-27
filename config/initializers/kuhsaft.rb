Rails.application.config.to_prepare do
  Kuhsaft::Cms::AdminController.class_eval do
    before_action :authenticate_admin!
  end
  Kuhsaft::Engine.configure do
    config.image_sizes.build_defaults! # creates 960x540 and 320x180 sizes
  end
end
