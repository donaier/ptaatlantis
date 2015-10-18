module Kuhsaft
  class MapBrick < Brick

    def collect_fulltext
      [super, caption].join(' ')
    end

    def user_can_add_childs?
      false
    end
  end
end
