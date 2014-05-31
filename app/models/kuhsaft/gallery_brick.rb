module Kuhsaft
  class GalleryBrick < Brick

    validates_presence_of :gallery_id

    def collect_fulltext
      [super, caption].join(' ')
    end

    def user_can_add_childs?
      false
    end
  end
end
