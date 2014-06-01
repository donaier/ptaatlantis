$(document).ready ->

  $(".sortable-table tbody").sortable(
    handle: '.handle'
    update: (event, ui) ->
      $(this).find("tr.sortable-row").each (idx, elem) ->
        $(this).find("input.position-field").val(idx+1)
      ui.item.find("form").trigger('submit')
  )
