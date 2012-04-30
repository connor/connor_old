---
layout: post
title: "Move More Than 1 Unit with Square's Cubism.js"
date: 2012-04-26 21:42
comments: false
external-url:
published: true
---


A few days ago, [Square](http://squareup.com) released another open-source project: [cubism.js](http://square.github.com/cubism/). Cubism is a plugin for the fantastic [D3](http://mbostock.github.com/d3/) library, allowing you to visualize data over a series of time.

When cubism was released, I began using it and hacking on some examples. I found one feature I really wanted was missing: the ability to move multiple units at once across the graph via the keyboard. You can move 1 unit at a time by pressing &larr; or &rarr;, but I wanted to be able to quickly move from one side of the graph to another, without having to use the mouse.

Before digging into this, it's worth noting that the guy behind D3 and Cubism, [Mike Bostock](http://bost.ocks.org/mike/), and I have already [discussed getting this into cubism's core](https://github.com/square/cubism/pull/2), but decided against it to keep the code base small and not force developers into doing something a specific way.

## Adding this functionality

The first thing you'll need to do is to clone the repo. To do so, simply run the following in the terminal:

```
git clone https://github.com/square/cubism.git
```

Now that we have the code, let's move into that folder we just made by doing a `cd cubism` in the terminal.

Before diving into this, though, we'll need something to test our changes against. The easiest way to do this is to use the `gh-pages` branch of the cubism repo. This way, we can test our code with the example demo app Mike and Square have put together for us. To check this branch out, simply do the following in the terminal:

```
git checkout gh-pages
```

Great - now we have a demo app to see our progress with (to see the demo app, open `demo/index.html` in your favorite web browser). If you look at the source of `demo/index.html`, you'll see it's referencing `cubism.v1.js` in the parent directory. So, that's what we'll be modifying.

#### Modifying cubism.v1.js

Now, open up `cubism.v1.js` in your text editor. Since we're looking to add this functionality when a user presses a key, I just searched for a `keydown` event. It turns it you can find it on approximately **line 130**, with this code: `d3.select(window).on("keydown.context-" + ++cubism_id, function() {...`.

I won't get too much into the code that surrounds the `switch` statement, but `.select()` and is part of [D3](http://mbostock.github.com/d3/), and we're just waiting for a `keydown` event.

Let's get this working for the `left` key first, so we'll adjust what is within the `case 37`. Right now, it is like this:

<script src="https://gist.github.com/2553756.js"> </script>

Basically, that's saying if the user isn't focusing on anything yet, bring the focus to the right-most unit on the graph (which is `size - 1`). If the focus is something that is greater than zero, then set the `context.focus` to be 1 less than the current focus - pretty simple stuff.

The way I wanted cubism to work was, if I was holding down `shift` while using the arrow keys, the focus would move more than 1 unit (perhaps 20 units). To do that programmatically, we get something like this:

<script src="https://gist.github.com/2553760.js"> </script>

So this code tells cubism to move the focus by 20 if the following 2 are true statements:

1. the `shift` key is pressed while the user is pressing &larr;
2. the focus is greater than `20`

The second condition above is needed, because otherwise, the focus could move off the graph, and we definitely don't want that! However, if the focus is less than 20, the execution flow will then cascade into the `else` clause, and the focus will subtract itself by 1, like it would if `shift` wasn't pressed by the user.

Now, let's do something similar if they were to press the right arrow:

<script src="https://gist.github.com/2553762.js"> </script>

The code above is essentially the inverse of what we do for &larr;.

Now that we've made the adjustment to our cubism code, we can open up `demo/index.html` in our browser and test it out! It should work great - we can jump 20 units left or right when we're not close to an edge, and when we are close to an edge, it will fall back and just jump by 1 unit.

#### Adding this to the API

If you want to take this a step further, though, we can add this to the API of cubism, so you can dynamically change the shift difference value.

The first thing we'll need to do is set a default value as a variable. I'm calling mine `shiftDiff`, and putting it on line 25 of `cubism.v1.js`, directly underneat the `clientDelay` variable.

<script src="https://gist.github.com/2553771.js"> </script>

Now, we need to add a method to the `context` object. You can see directly under the **update** function declaration in `cubism.v1.js`, Mike starts to declare methods on the `context` object (like *start*, *stop*, *step*, etc...). We're going to put ours directly underneath `stop`. So, on approximately line 68, let's add the following:

<script src="https://gist.github.com/2553772.js"> </script>

This `shiftDiff` function allows us to pass in a `diff` argument, and will set the units to move when the user is holding `shift` and pressing the arrow keys. We can use it like so:

<script src="https://gist.github.com/2553774.js"> </script>

This won't quite work yet, though - we need to update our previous adjustments to the switch statement on `keydown` to use the `shiftDiff` variable, not just `20`.

So, they become:

<script src="https://gist.github.com/2553777.js"> </script>

Awesome. Now, let's open up `demo/index.html` in our text editor and change the `shiftDiff` to a larger number. You'll see on approximately line 14 of `demo/index.html`, there is a new cubism context created:

<script src="https://gist.github.com/2553781.js"> </script>

Let's adjust that to take into account our new API adjustment:

<script src="https://gist.github.com/2553782.js"> </script>

Now, when we load up the `demo/index.html` page in our browser, the `shiftDiff` is going to be move a heck of a lot more than 20 units!