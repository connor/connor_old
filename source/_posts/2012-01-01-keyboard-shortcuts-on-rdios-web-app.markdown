---
layout: post
title: "Keyboard shortcuts on Rdio"
date: 2012-01-01 14:16
comments: false
external-url: 
published: true
---

<p class="update">
<strong>Update 2:</strong> with the recent <a href="http://blog.rdio.com/us/2012/06/introducing-a-brighter-lighter-rdio.html">reskinning</a> (which is beautiful, by the way), Rdio has removed the back button. At first you'd wonder why, but apparently very <a href="https://twitter.com/RdioHelp/status/220263759271301122">few people used it</a>. I have updated the code below to still make it work.
</p>

<p class="update">
<del><strong>Update:</strong> with the launch of <a href="http://blog.rdio.com/us/2012/03/introducing-new-rdio.html">Rdio 2.0</a>, some of the markup has changed. I have updated the <a href="https://gist.github.com/2067842">link to the gist</a> in the post.</del>
</p>


If you'd like to just download the source for this, and not work through
it, [here you go](http://cl.ly/3e022N1d1T0N0n2p1w2k).

---

Call me crazy, but most of the time when I can use a web app over a
native app, I prefer the web app. Maybe some of you do, too.

Anyways, one of my favorite web apps is [Rdio](http://rdio.com). I
recently found myself wishing I could control the web app with my [Apple
Wireless Keyboard's](http://www.apple.com/keyboard/) media controls. Not
only do I wish I could control the web app, but I want to be able to
control it when any window is focused and any tab is my foremost tab.
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

2. <del>Next, create a file for the rdio adapter. To do so, run</del> We
   need to create two files: one for the Rdio adapter (keysocket-rdio.js), and one javascript file that our Rdio adapter injects for us (rdio-prev.js):

    ```
    touch keysocket-rdio.js rdio-prev.js
    ```

We need two files here because Chrome extensions have a sandboxed
environment. We can't access global variables on the page (which, in our
case, we're using. More on that below).

3. Now, open up the `keysocket-rdio.js` file you just created, and put the following code
   in there (I will explain it later on in the post):

<script src="https://gist.github.com/2067842.js"> </script>

4. Open up `rdio-prev.js`, and put the following code in it:

<script src="https://gist.github.com/3049039.js"> </script>

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

<del>It's actually not that complicated at all.</del> It wasn't that complicated, until Rdio came out with newnew Rdio - then there was a bit of a curveball. Before getting into that, it's worth nothing that Boris does a great job of
explaining it on his [blog post](http://smus.com/chrome-media-keys-revisited) about creating the keysocket app and
extension. I'd recommend checking that out (and following him on [Twitter](https://twitter.com/#!/borismus)
- he's extremely bright and has lots of great stuff).

Essentially, the keysocket app installed locally messages the extension
when you press a button down. If that button's character code matches
what we define in our `keysocket-rdio.js` file (in this case, 20 for the
previous button, 16 for play/pause, and 19 for the next button), then it
executes the `simulateClick` function, passing in the <del>element ID</del> class that we defined.

**The catch** is that now, there's no `previous` button. So, we had to
adjust our logic here. Now, what we're doing is creating a fake button
element (with an id of `fake_prev_el`). We make it invisible (height of
0px and width of 0px) and append it to the DOM.

In most cases, we could just add and event listener in the
keysocket-rdio script, but we can't do that here. We have to actually
append another script file, the `rdio-prev.js` file to the document.
That's because Chrome sandboxes extensions. By injecting this script
element, we can then manipulate the page like we'd be able to with plain
old javascript.

It then, well, simulates a click on the correct element.

In the case of executing a click on the `fake_prev_el` element, it will
call the `previous` method on the Rdio's `player` object they have in
their backbone code.

One may ask: why didn't I just simulate a `keyPress` and pass in
`←` or `[`, seeing those keyboard shortcuts still work when you've got
the Rdio tab focused in chrome. Turns out there's an issue in any
webkit-based browser when trying to create a keyboard event, and you
cannot modify the keyCode of a simulated keyPress - it is just set at 0
without the ability to change it.

#### Explaning keysocket-rdio.js

<del>If you look at this file and compare it to the other
`keysocket-x.js` files, you'll see that it's very similar. To be frank, I
just copied & pasted what Boris had done with other services, and modified it to work with
Rdio. However - it's good to know how I ended up changing it.

It was extremely simple - the block of code from `line 34 - line 42` is
all that needed modification. I just changed the <del>ID's</del> classes of Rdio's elements
in the DOM to match what action was supposed to happen.</del>

For the most part, this is very similar to the other `keysocket-x.js`
files. I ended up injecting the `rdio-prev.js` file so we can access the
global variable Rdio exposes, which powers the application.

<figure>
  <a href="http://f.cl.ly/items/0r2g3S38391b2r0c1T0z/Screen%20Shot%202012-07-04%20at%2012.25.30%20PM.png" target="_blank"><img src="http://f.cl.ly/items/1j3O3Y41391g2U3V2e2L/small.png"></a>
  <figcaption><strong>Above:</strong> The DOM tree that makes up newnew Rdio's player</figcaption>
</figure>


For example, on line 34. If the key pressed's keyCode is equal to the
`NEXT`'s value (which happens if you press F9 on the Apple keyboard), it
runs the `simulateClick` function and passes in the `next` class.

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
