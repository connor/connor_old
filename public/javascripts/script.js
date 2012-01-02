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
  function hideGistOnLoad() {
    return "<p class='toggleGist'><a href='#'>Please tap to toggle the gist</a></p>"
  }

  function toggleShowGistButton() {
    $(this).addClass('hidden')
           .previous()
           .removeClass('hidden')
  }

  function toggleGist() {
    if (!$(this).hasClass('hidden')) {
      $(this).addClass('hidden')
             .next()
             .removeClass('hidden')
    }
  }

  $('body').addClass('mobile')
  $('.container').removeClass('hidden')
  $('.mobile .gist').addClass('hidden')
                    .before( hideGistOnLoad() )
  $('.mobile .toggleGist').addListener('touchstart', toggleGist, false)
  $('.mobile .gist').addListener('touchend', toggleShowGistButton, false)
}
