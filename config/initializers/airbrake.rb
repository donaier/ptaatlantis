Airbrake.configure do |config|
  config.api_key   = ENV['AIRBRAKE_API_KEY']
  config.host      = 'apps.screenconcept.ch'
  config.port      = 80
end if ENV['AIRBRAKE_API_KEY'].present?
