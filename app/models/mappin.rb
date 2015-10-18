require 'shoestrap/cms_model'

class Mappin < ActiveRecord::Base
  include Shoestrap::CMSModel

  after_save :touch_map_bricks

  validates_presence_of :lat, :lng, :marker_text

  editable_attributes :lat, :lng, :marker_text

  index_attributes :lat, :lng, :marker_text

  def self.pin_array
    pin_array = []
    self.all.each do |p|
      pin_array << p.marker_text
    end
    pin_array
  end

  def touch_map_bricks
    Kuhsaft::Brick.where(type: 'Kuhsaft::MapBrick').each do |map_brick|
      map_brick.touch
    end
  end
end
