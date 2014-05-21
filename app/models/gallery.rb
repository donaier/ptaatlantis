require 'shoestrap/cms_model'

class Gallery < ActiveRecord::Base
  include Shoestrap::CMSModel

  scope :ordered, -> { order(:position) }

  editable_attributes :title, :text, :published
end
