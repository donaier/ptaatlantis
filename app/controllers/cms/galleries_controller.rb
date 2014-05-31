class Cms::GalleriesController < Shoestrap::BaseController

  private

  def collection
    Gallery.ordered
  end
end
