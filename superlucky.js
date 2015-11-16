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

  $('#test-form').bootstrapValidator({
    //submitButtons: '#postForm',
    // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      firstName: {
      message: 'The first name is not valid',
        validators: {
          notEmpty: {
            message: 'We need to know who you are!'
          },
        }
      },
      lastName: {
        message: 'Last Name is not valid',
        validators: {
          notEmpty: {
            message: 'Last Name is required and cannot be empty'
          },
        }
      },
      email: {
        validators: {
          notEmpty: {
            message: 'The email address is required and cannot be empty'
          },
          emailAddress: {
            message: 'The email address is not a valid'
          }
        }
      },
      address: {
        message: 'Address is not valid',
        validators: {
          notEmpty: {
            message: 'Address is required and cannot be empty'
          }
        }
      },
    }
  })
  .on('success.form.bv', function(e) {
    // Prevent form submission
    e.preventDefault();

    // Get the form instance
    var $form = $(e.target);

    // Get the BootstrapValidator instance
    var bv = $form.data('bootstrapValidator');

    // Use Ajax to submit form data
    var url = 'https://script.google.com/macros/s/AKfycbxjhVrWmr2ho6GJSe-gxNtfN7e_GBY-0TbUBwxp_EUXFUXLZg/exec';
    var redirectUrl = 'success-page.html';
    // show the loading
    $('#postForm').prepend($('<span></span>').addClass('glyphicon glyphicon-refresh glyphicon-refresh-animate'));
    var jqxhr = $.post(url, $form.serialize(), function(data) {
        console.log("Success! Data: " + data.statusText);
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
