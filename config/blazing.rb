require 'dotenv'
Dotenv.load

target :production, "www-data@.screenconcept.ch:/home/www-data/apps/#{ENV['APP_IDENTIFIER']}_production", rails_env: 'production'
target :staging, "www-data@.screenconcept.ch:/home/www-data/apps/#{ENV['APP_IDENTIFIER']}_staging", rails_env: 'staging'
rvm :rvmrc
rake 'post_deploy'
