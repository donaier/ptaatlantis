require 'shoestrap/cms_model'

class GalleryImage < ActiveRecord::Base
  include Shoestrap::CMSModel

  belongs_to :gallery

  has_attached_file :image,
    styles: { big: '980x735>', thumb: '120x100>' },
    :path => ":rails_root/public/system/:class/:attachment/:id/:style/:filename",
    :url => "/system/:class/:attachment/:id/:style/:filename"

  validates_attachment_content_type :image, :content_type => /\Aimage\/.*\Z/

  validates_presence_of :image, :gallery_id

  editable_attributes :image, :description, :gallery_id, :position
end
