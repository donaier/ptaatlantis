require 'shoestrap/cms_model'

class GalleryImage < ActiveRecord::Base
  include Shoestrap::CMSModel
  belongs_to :gallery
  acts_as_list scope: :gallery

  default_scope -> { order('position ASC') }

  after_initialize :set_position

  has_attached_file :image,
    styles: { big: '980x735>', thumb: '160x120>' },
    :path => ":rails_root/public/system/:class/:attachment/:id/:style/:filename",
    :url => "/system/:class/:attachment/:id/:style/:filename"

  validates_attachment_content_type :image, :content_type => /\Aimage\/.*\Z/

  validates_presence_of :image, :gallery_id

  editable_attributes :image, :description, :gallery_id, :position

  private

  def set_position
    self.position ||= self.gallery.gallery_images.any? ? self.gallery.gallery_images.maximum(:position) + 1 : 1
  end
end
