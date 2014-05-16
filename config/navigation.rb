SimpleNavigation::Configuration.run do |navigation|
  navigation.items do |primary|
    navigation.selected_class = 'active'
    primary.dom_class = 'side-nav'
    Kuhsaft::Page.find_by_slug_de('home').children.published.each do |page|
      unless page.url.blank?
        primary.item page.id, page.title, "/#{page.url_without_locale}" do |sub_nav|
          page.children.each do |child_page|
            sub_nav.item child_page.id, child_page.title, "/#{child_page.url_without_locale}"
          end
        end
      end
    end
  end
end
