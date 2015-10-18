class CreateMappins < ActiveRecord::Migration
  def change
    create_table :mappins do |t|
      t.string :lat
      t.string :lng
      t.string :marker_text

      t.timestamps
    end
  end
end
