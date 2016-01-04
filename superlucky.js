jQuery.extend({
  getQueryParameters : function(str) {
    return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
  }
});

$(document).ready(function() {

  $data = $.getQueryParameters();
  if ($data['email']) {
    for (var field in $data) {
      if ($data.hasOwnProperty(field)) {
        // Yes, I know that this is a slight XSS vulnerability =)
        $('[name="' + field +'"]').val(decodeURI($data[field]));
      }
    }
  };

  $('input[name="attending"]').bind('change',function(){
    $('.basic-fields').show();
    $('.attending-fields').toggle($(this).val() === 'yes');
  });

  $('[name="speechOtherName"]').bind('keyup', function(){
    $('[name="speechOther"]').prop('checked', !!$(this).val().trim());
  });

  $('#rsvp-form').bootstrapValidator({}).on('success.form.bv', function(e) {
    e.preventDefault();

    // Get the form instance
    var $form = $(e.target);

    // Use Ajax to submit form data
    var url = 'https://script.google.com/macros/s/AKfycbxjhVrWmr2ho6GJSe-gxNtfN7e_GBY-0TbUBwxp_EUXFUXLZg/exec';
    var redirectUrl = 'rsvp-success.html';
    // show the loading
    $('#postForm').prepend($('<span></span>').addClass('glyphicon glyphicon-refresh glyphicon-spin button-validating'));
    var jqxhr = $.post(url, $form.serialize(), function(data) {
      // console.log("Success! Data: " + data.statusText);
      $(location).attr('href',redirectUrl);
    })
    .fail(function(data) {
      console.warn("Error! Data: " + data.statusText);
      // HACK - check if browser is Safari - and redirect even if fail b/c we know the form submits.
      if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
        //alert("Browser is Safari -- we get an error, but the form still submits -- continue.");
        $(location).attr('href',redirectUrl);
      }
    });
  });
});
