/* layout the page dynamically, based on the user's *
 * monitor size IF it's a desktop or iPad           */

if (!('createTouch' in document) || ($(window).width() >= 768)) {

  var browserHeight       = $(window).height()
    , distanceFromTop     = Math.ceil(browserHeight * .1569)
    , fractionOfDistance  = Math.ceil(distanceFromTop * .9)

  $("#logo").css('padding-top', distanceFromTop)
  $("#subhead").css('padding-bottom', fractionOfDistance)
  $('.container').removeClass('hidden')
}

else {

  $('body').addClass('mobile')
  $('.container').removeClass('hidden')

}
