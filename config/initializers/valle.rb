Valle.configure do |config|
  config.exclude_attributes = {
    # You have to disable the field length validation for carrierwave attributes
    # 'User' => %w(image)
  }
end
