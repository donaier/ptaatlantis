class CreateActivities < ActiveRecord::Migration
  def change
    create_table :activities do |t|
      t.datetime :starts_at
      t.string :title
      t.text :description
      t.boolean :atlas
      t.boolean :titan
      t.boolean :artemis
      t.string :meeting_point

      t.timestamps
    end
  end
end
