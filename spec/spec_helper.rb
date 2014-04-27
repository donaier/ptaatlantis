ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rspec/rails'
require 'rspec/autorun'
require 'fast_spec_helper'
require 'active_record_spec_helper'

ActiveRecord::Migration.check_pending! if defined?(ActiveRecord::Migration)

RSpec.configure do |config|
  config.infer_base_class_for_anonymous_controllers = false
  config.order = 'random'
  config.include Devise::TestHelpers, type: :controller
  config.include Warden::Test::Helpers
  Warden.test_mode!
end
