module Kuhsaft
  class ImageBrick < Brick

    has_attached_file :image,
      styles: { big: '1000x800>', thumb: '120x100>' },
      :path => ":rails_root/public/system/:class/:attachment/:id/:style/:filename",
      :url => "/system/:class/:attachment/:id/:style/:filename"

    validates :image, :presence => true
    validates_attachment :image, content_type: { content_type: ["image/jpg", "image/jpeg", "image/png"] }

    def collect_fulltext
      [super, caption].join(' ')
    end

    def user_can_add_childs?
      false
    end
  end
end
