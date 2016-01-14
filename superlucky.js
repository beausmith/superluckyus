var weddingDate = new Date(2016, 5, 18);
var valentinesDay = new Date(2016, 1, 14);
var today = new Date();
var daysLeft = parseInt((weddingDate - today)/(1000*60*60*24))
var daysLeftToRSVP = parseInt((valentinesDay - today)/(1000*60*60*24))

function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}
function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
function eraseCookie(name) {
  createCookie(name,"",-1);
}

jQuery.extend({
  getQueryParameters : function(str) {
    return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
  }
});

$(document).ready(function() {

  $("#days-left").text(daysLeft + " days until we celebrate!");
  $("#days-left-to-rsvp").text("Please RSVP by Valentines Day… " + daysLeftToRSVP + " days left!");

  $data = $.getQueryParameters();
  if ($data['email']) {
    for (var field in $data) {
      if ($data.hasOwnProperty(field)) {
        // Yes, I know that this is a slight XSS vulnerability =)
        $('[name="' + field +'"]').val(decodeURI($data[field]));
        createCookie(field,$data[field],daysLeft);
      }
    }
    // remove query from url
    window.history.replaceState(null,null,window.location.pathname);
  };

  if (readCookie("email")) {
    $.each(document.cookie.split(/; */), function()  {
      var cookiePart = this.split('=');
      $('[name="' + cookiePart[0] +'"]').val(decodeURI(cookiePart[1]));
    });
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
