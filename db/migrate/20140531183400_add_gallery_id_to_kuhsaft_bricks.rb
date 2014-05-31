class AddGalleryIdToKuhsaftBricks < ActiveRecord::Migration
  def change
    add_column :kuhsaft_bricks, :gallery_id, :string
  end
end
