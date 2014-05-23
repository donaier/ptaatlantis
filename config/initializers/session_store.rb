# Be sure to restart your server when you modify this file.

Ptaatlantis::Application.config.session_store :cookie_store, key: "_#{ENV['APP_IDENTIFIER']}_session"
