class Cms::GalleryImagesController < Shoestrap::BaseController

  def new
    @gallery_image = GalleryImage.new(gallery_id: params[:gallery_id])
  end

  def create
    create!{ cms_gallery_gallery_images_path(resource.gallery) }
  end

  def update
    update!{ cms_gallery_gallery_images_path(resource.gallery) }
  end

  def destroy
    destroy!{ cms_gallery_gallery_images_path(resource.gallery) }
  end

  def reorder
    GalleryImage.find(params[:gallery_image][:id]).insert_at(params[:gallery_image][:position].to_i)
    redirect_to cms_gallery_gallery_images_path(resource.gallery)
  end
end
