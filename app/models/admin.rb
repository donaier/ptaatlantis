require 'shoestrap/cms_model'

class Admin < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable,
         :recoverable, :rememberable, :trackable, :validatable
  include Shoestrap::CMSModel

  # TODO: Define what attributes are shown in the form and permitted by strong parameters
  editable_attributes :first_name, :last_name, :email, :password

  # TODO: Define what attributes are shown in the index view
  index_attributes :first_name, :last_name, :email
end
