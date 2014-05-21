require 'shoestrap/cms_model'

class Gallery < ActiveRecord::Base
  include Shoestrap::CMSModel

  scope :ordered, -> { order(:position) }

  has_many :gallery_images

  validates_presence_of :title

  editable_attributes :title, :text, :published
end
