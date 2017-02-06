$(document).ready(function () {
    "use strict";
    $('td').click(function () {
        $('#searchByUrl').val($(this).html());
    });
    $('#searchByUrl').change(function () {
        var input_content = $.trim($(this).val());
        if (!input_content) {
            $('tr>td').show();
        } else {
            $('tr>td').show().not(':contains(' + input_content  + ')').hide();
        }
    });
});
