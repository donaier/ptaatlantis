class SwitchToPaperclip < ActiveRecord::Migration
  def change
    remove_column :kuhsaft_bricks, :image
    add_attachment :kuhsaft_bricks, :image
  end
end
