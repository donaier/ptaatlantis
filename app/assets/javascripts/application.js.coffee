#= require jquery
#= require jquery_ujs
#= require turbolinks

#= require foundation/foundation
#= require foundation/foundation.dropdown
#= require foundation/foundation.topbar
#= require foundation/foundation.orbit

###
# ---ATTENTION: MOVE THEM UP FOR USE---
#
# require foundation/foundation.abide
# require foundation/foundation.accordion
# require foundation/foundation.alert
# require foundation/foundation.clearing
# require foundation/foundation.equalizer
# require foundation/foundation.interchange
# require foundation/foundation.joyride
# require foundation/foundation.magellan
# require foundation/foundation.offcanvas
# require foundation/foundation.reveal
# require foundation/foundation.slider
# require foundation/foundation.tab
# require foundation/foundation.tooltip
###


$(document).foundation('dropdown')
$(document).foundation('topbar')
$(document).foundation 'orbit':
  resume_on_mouseout: true,
  next_on_click: true,
  slide_number: false,
  timer_show_progress_bar: false,
  bullets: false,
  timer: false
  variable_height: true

# $(document).foundation('abide')
# $(document).foundation('accordion')
# $(document).foundation('alerts')
# $(document).foundation('clearing')
# $(document).foundation('equalizer')
# $(document).foundation('interchange')
# $(document).foundation('joyride')
# $(document).foundation('magellan')
# $(document).foundation('offcanvas')
# $(document).foundation('reveal')
# $(document).foundation('slider')
# $(document).foundation('tab')
# $(document).foundation('tooltip')

