# This will be run during `rake db:seed` in the :development environment.

include Sprig::Helpers

Kuhsaft::BrickType.delete_all

sprig [Kuhsaft::BrickType]
