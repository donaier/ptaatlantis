require 'shoestrap/cms_model'

class Activity < ActiveRecord::Base
  include Shoestrap::CMSModel

  MEETING_POINTS = [
    '1 - Rosenau',
    '2 - Zinzikon',
    '3 - Bäumli',
    '4 - Waldheim',
    '5 - Lindspitz',
    '6 - Breiti',
    '7 - Oberseen',
    '8 - Bahnhof Seen',
    '9 - Schulhaus Dorf',
    '10 - Bettenplatz',
    '11 - Technikum'
  ]

  validates_presence_of :title, :starts_at

  scope :ordered, -> { order('starts_at ASC') }
  scope :from_now, -> { Activity.ordered.where("starts_at > ?", Date.today - 1.day) }

  editable_attributes :starts_at, :title, :description, :atlas, :titan, :artemis, :meeting_point
end
