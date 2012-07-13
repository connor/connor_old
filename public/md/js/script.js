var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    mode: "gfm"
  , matchBrackets: false
  , lineWrapping: true
  , keyMap: "vim"
  , theme: "marky-light"
  , autofocus: true
  , saveFunction: function() {
      localStorage['content'] = editor.getValue()
    }
});

function toggleFullScreen() {
  if ((document.fullScreenElement && document.fullScreenElement !== null) ||
  (!document.mozFullScreen && !document.webkitIsFullScreen)) {

    if (document.documentElement.requestFullScreen) {
      document.documentElement.requestFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }

  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}


$(document).ready( function() {
  var prevContent = localStorage['content']

  $(".hidden").removeClass('hidden')

  if (prevContent) {
    editor.setValue( prevContent )
  }

  setInterval( function() {
    localStorage['content'] = editor.getValue()
  }, 1000)


  $("#full-screen").bind('click', function() {
    toggleFullScreen()
  })

  $("#clear").bind('click', function() {
    editor.setValue('')
    localStorage.clear()
  })

})
