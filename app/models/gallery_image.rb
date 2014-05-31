require 'shoestrap/cms_model'

class GalleryImage < ActiveRecord::Base
  include Shoestrap::CMSModel

  belongs_to :gallery

  has_attached_file :image, :styles => { :big => "300x300>", :thumb => "100x100>" }
  validates_attachment_content_type :image, :content_type => /\Aimage\/.*\Z/

  validates_presence_of :image, :gallery_id

  editable_attributes :description, :gallery_id, :position
end
