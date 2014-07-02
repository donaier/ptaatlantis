class Cms::ActivitiesController < Shoestrap::BaseController

  private

  def collection
    Activity.ordered
  end
end
