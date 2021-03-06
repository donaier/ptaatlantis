# -*- coding: utf-8 -*-
# Configures your navigation
SimpleNavigation::Configuration.run do |navigation|
  navigation.items do |primary|
    primary.item :pages, Kuhsaft::Page.model_name.human(count: 2), kuhsaft.cms_pages_path, highlights_on: %r(/cms$|/cms/pages)
    primary.item :activity_nav, t('cms.activities.navigation_title'), cms_activities_path
    primary.item :gallery_nav, t('cms.galleries.navigation_title'), cms_galleries_path
    primary.item :mappin_nav, t('cms.mappins.navigation_title'), cms_mappins_path
    primary.item :admin_nav, t('cms.admins.navigation_title'), cms_admins_path
    primary.dom_class = 'nav'
  end
  navigation.selected_class = 'active'
end
