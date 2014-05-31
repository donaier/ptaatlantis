class CreateGalleryImages < ActiveRecord::Migration
  def change
    create_table :gallery_images do |t|
      t.text :description
      t.integer :gallery_id
      t.integer :position

      t.timestamps
    end

    add_attachment :gallery_images, :image
  end
end
