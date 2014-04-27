class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  helper Kuhsaft::Engine.helpers
  after_action :flash_to_headers

  protected

  def flash_to_headers
    return unless request.xhr?
    [:error, :warning, :notice, :success].each do |type|
      next if flash[type].blank?
      response.headers['X-Message'] = flash[type]
      response.headers['X-Message-Type'] = type.to_s
    end
    flash.discard # don't want the flash to appear when you reload page
  end
end
