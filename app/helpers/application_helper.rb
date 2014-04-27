module ApplicationHelper
  def body_class
    "controller-#{controller_name} action-#{action_name}"
  end

  def google_analytics_code
    return if ENV['GOOGLE_ANALYTICS_CODE'].blank? || !Rails.env.production?
    render 'partials/google_analytics', google_analytics_code: ENV['GOOGLE_ANALYTICS_CODE']
  end
end
