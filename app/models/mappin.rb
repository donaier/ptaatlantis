require 'shoestrap/cms_model'

class Mappin < ActiveRecord::Base
  include Shoestrap::CMSModel

  after_save :touch_map_bricks

  validates_presence_of :lat, :lng, :marker_text

  editable_attributes :lat, :lng, :marker_text

  index_attributes :lat, :lng, :marker_text

  def touch_map_bricks
    Kuhsaft::Brick.where(type: 'Kuhsaft::MapBrick').each do |map_brick|
      map_brick.touch
    end
  end
end
