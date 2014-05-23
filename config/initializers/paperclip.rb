if Rails.env.production?
  Paperclip::Attachment.default_options[:url] = ':s3_domain_url'
end

Paperclip::Attachment.default_options[:path] = '/:class/:attachment/:id_partition/:style/:filename'
