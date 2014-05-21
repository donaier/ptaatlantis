class CreateGalleries < ActiveRecord::Migration
  def change
    create_table :galleries do |t|
      t.string :title
      t.text :text
      t.boolean :published
      t.integer :position

      t.timestamps
    end
  end
end
