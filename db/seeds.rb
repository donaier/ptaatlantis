# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
# While we want to have clean seeds, please use the sprig structure for it.
# If you want to get more information about sprig, read about here: https://github.com/vigetlabs/sprig

path = Rails.root.join('db/seeds', "#{Rails.env}.rb")
load path if File.exist? path
