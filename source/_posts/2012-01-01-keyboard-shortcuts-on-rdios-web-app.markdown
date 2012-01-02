---
layout: post
title: "Keyboard shortcuts on Rdio"
date: 2012-01-01 14:16
comments: false
external-url: 
published: true
---

Call me crazy, but most of the time when I can use a web app over a
native app, I prefer the web app. Maybe some of you do, too.

Anyways, one of my favorite web apps is [Rdio](http://rdio.com). I
recently found myself wishing I could control the web app with my [Apple
Wireless Keyboard's](http://www.apple.com/keyboard/) media controls.
Well, with a little hacking on a great
[project](https://github.com/borismus/keysocket/) put together by [Boris
Smus](http://smus.com/), it's now possible (Mac Only for now).

### How to add keyboard shortcuts to Rdio's web app

#### Pre-requisites

1. First, you'll want to clone [his repo](https://github.com/borismus/keysocket/).
To do so, simply run the following command from the terminal:

    ```
    git clone https://github.com/borismus/keysocket.git
    ```

2. Once you've cloned it, download and install the [Key Socket.app](https://github.com/downloads/borismus/keysocket/KeySocket.zip).
This app will be installed on your Mac, and essentially messages the
extension that a button has been pressed (I will explain this more later
in the post).

3. If you haven't already, make sure you start the Key Socket.app. I
   would also recommend adjusting your system to start it up when the
system boots.

#### Alright, let's get started

1. Now it's time to hack. Open up a terminal and `cd` into `/extension`
within the project directory.

2. Next, create a file for the rdio adapter. To do so, run:

    ```
    touch keysocket-rdio.js
    ```

3. Now, open up the `keysocket-rdio.js` file you just created, and put the following code
   in there (I will explain it later on in the post):

<script src="https://gist.github.com/1548707.js"> </script>

Finally, open up the `manifest.json` file, and adjust it to be like
so (I will also explain this later on in the post):

<script src="https://gist.github.com/1548717.js"> </script>

#### Adding the extension to Chrome

Believe it or not, the extension is done! Now, we've just got to add it
to Chrome. To do so, follow these steps:

1. Navigate your browser to: `chrome://extensions`.

2. Click the button that says **"Load unpacked extension..."**.

3. Navigate to the `/extension` directory, and click **"Select"**.

4. If you have Rdio's web app open, give it a refresh, and your media keys should
   now be controlling the application! Make sure you don't have iTunes
and Rdio open (or the [Rdio Mac App](http://www.rdio.com/#/apps/mac/) and the web app open), as it will affect both applications.

### Further explanation

Awesome - you should now be able to control Rdio's web app from your keyboard!
I mentioned above that I'll be explaining a few things later on in the
post, so if you'd like to know more about how those things work, just
keep on reading.

#### How the heck does this work?

It's actually not that complicated at all. Boris does a great job of
explaining it on his [blog post](http://smus.com/chrome-media-keys-revisited) about creating the keysocket app and
extension. I'd recommend checking that out (and following him on [Twitter](https://twitter.com/#!/borismus)
- he's extremely bright and has lots of great stuff).

Essentially, the keysocket app installed locally messages the extension
when you press a button down. If that button's character code matches
what we define in our `keysocket-rdio.js` file (in this case, 20 for the
previous button, 16 for play/pause, and 19 for the next button), then it
executes the `simulateClick` function, passing in the element ID that we
defined.

It then, well, simulates a click on that element.

#### Explaning keysocket-rdio.js

If you look at this file and compare it to the other
`keysocket-x.js` files, you'll see that it's very similar. To be frank, I
just copied & pasted what Boris had done with other services, and modified it to work with
Rdio. However - it's good to know how I ended up changing it.

It was extremely simple - the block of code from `line 34 - line 42` is
all that needed modification. I just changed the ID's of Rdio's elements
in the DOM to match what action was supposed to happen.

<figure>
  <a href="http://f.cl.ly/items/3Q1k440z0I403M2Y1B1k/Screen%20Shot%202012-01-01%20at%206.21.14%20PM.png" target="_blank"><img src="http://f.cl.ly/items/3P0m350A2n1A213n0q08/rdio-small.png"></a>
  <figcaption><strong>Above:</strong> The DOM tree that makes up Rdio's player</figcaption>
</figure>


For example, on line 34. If the key pressed's keyCode is equal to the
`PREV`'s value (which happens if you press F7 on the Apple keyboard), it
runs the `simulateClick` function and passes in the `previousButton` ID.

That's really it, just copied 3 times. If you have any questions about
it, feel free to let me know on twitter.

#### Explaning manifest.json

Every chrome extension **requires** a `manifest.json` file. (**note:**
if you'd like to learn more about Chrome Extension development, check
out my [article on nettuts](http://net.tutsplus.com/tutorials/javascript-ajax/how-i-made-the-domai-nr-chrome-extension/).)

All we are doing here is saying if the current URL *matches*
`http://www.rdio.com/*`, load the `keysocket-rdio.js` file. That ending
`*` is required, becuase it's a wildcard character. Basically, that
means the `keysocket-rdio.js` file will load at any path within
`http://rdio.com`, not just the root path.
