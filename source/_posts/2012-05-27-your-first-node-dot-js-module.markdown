---
layout: post
title: "Your first node.js module"
date: 2012-05-27 21:27
comments: false
external-url:
published: true
---

Making modular and reusable code is something we should all be doing to keep the
quality of it up to par. A very simple way to make reusable *modules* of code in
[node.js](http://nodejs.org/) is to create generalized modules (no pun
intended).

Recently, I created a [node module](http://search.npmjs.org/#/Domai.nr) for
[Domai.nr](http://domai.nr), and wanted to shed some light on how easy it
actually is to make these node modules. In this post, we're going to recreate
the domai.nr module from scratch, and hopefully you learn a few things along the
way!

### What is a Node Module?

A [node module](https://github.com/joyent/node/wiki/modules) is JavaScript code
that usually does a few specific things, and is usually agnostic to the rest of 
your application. It typically promotes better code quality, and is super
awesome because you can publish your modules to [npm](http://npmjs.org/) so
others can use them, too. If you're not familiar with npm, check out [this
article](http://howtonode.org/introduction-to-npm) for a simple introduction.

Some of the [most popular](http://search.npmjs.org/) node modules are:

- [underscore.js](http://search.npmjs.org/#/underscore)
- [coffee script](http://search.npmjs.org/#/coffee-script)
- [express](http://search.npmjs.org/#/express)
- [jade](http://search.npmjs.org/#/jade)
- [socket.io](http://search.npmjs.org/#/socket.io)


### Why a Domai.nr node module?

I've chosen the Domai.nr API over others for several reasons. Mostly, becuause
it has two methods that both return JSON: [search](http://domai.nr/api/docs/json#search-api) and [info](http://domai.nr/api/docs/json#info-api). It's very easy to write a wrapper for these two methods. Also, I &lt;3 Domai.nr a ton, and you should too. :D 

### Let's get started!

As Isaac mentions [here](http://howtonode.org/how-to-module), there are
different ways for you to write a module. Some people have specific preferences,
and if you have any insight or feedback as to my process, I'd love to [hear from
you](mailto:c@cnnr.me&subject=How+I+Write+Node+Modules).

### A package.json file

The package.json file is a description of the module, and also specifies where
your code is located. Some common attributes in the file include:

- Name of the module
- Version
- Description of the module
- Dependencies of the module
- Git repo
- Keywords (for searching npm)
- Main (where the code is located, relative to the package.json file)

As you can tell, there is actually quite a bit of important information in here.
This particular package.json file won't be too large.

<script src="https://gist.github.com/2817308.js"> </script>

That should be fairly self-explanatory, but one thing to note is the **main**
attribute of this JSON object. I touched on it briefly a bit earlier on in the
post, but essentially, it's a path to the code that makes up your module.

### Getting ready

Awesome - now we just have one more quick step before digging into the code.
Remember earlier when I mentioned we can publish our packages to npm and let
others use them? This is one of my favorite things about creating node modules -
we can use great code that has already been written for us. In our
`package.json` file, we actually specified a dependency: a great HTTP abstraction called [request](https://github.com/mikeal/request).

### Coding it up

As you saw in the package.json file above, we have a file at `/lib/domainr`
where our code is kept. It's actually at `/lib/domainr.js` (we omit the `.js` at
the end). Let's make the folder that goes with it, and the file:

    mkdir lib && touch lib/domainr.js

Alright - now pop open your favorite text editor, and let's get this coded.

If you're familiar with Node.js, this should be pretty trivial (it is very easy
to make these, after all). I'll try and walk us through it, so anyone reading
should hopefully understand. If you have any questions, feel free to reach out
on [twitter](http://twitter.com/connor) or [email](mailto:c@cnnr.me).

The first thing we need to do in our `domainr.js` file is to require [request](https://github.com/mikeal/request). To do so, add the following at the top of the file:

    var request = require('request')

<br>This allows us to utilize all of the goodness that comes with request. That's
perfect, since we're just making HTTP requests to the domai.nr API.

#### An aside: how we want people to use the module

At this point, I've usually plotted out how I want my public API to be (i.e.
what methods the users would be able to call using my module). I figured it
would be best to just mirror domai.nr's methods, so we'll have two: `search` and
`info`.

So, it's basically like this (**NOTE** do not add this as code, this is just an
example for *how* it will be used):

<script src="https://gist.github.com/2817441.js"> </script>

You can find examples of what the responses will be like on [Domai.nr's
documentation](http://domai.nr/api/docs/json).


#### Back to coding...

That was a good exercise because now, we know exactly what we want to expose:
`.search` and `.info`. Let's to search first.

To expose a method on the module object that is returned when `require`'ing it,
you use `exports`. For example - we want people to call `.search` on the variable they aliased to the `require` (in the example above). In order to expose the method, we prefix it with `exports`. Here's [more about that](http://stackoverflow.com/questions/5311334/what-is-the-purpose-of-nodejs-module-exports-and-how-do-you-use-it#answer-5311377), if you're still a bit stuck.

Let's implement the search method now. Since we know about the `exports`, the
signature of the function will look like this (with the `require` above it, just
to make sure you're following along:

<script src="https://gist.github.com/2817458.js"> </script>

As you see, we're passing two arguments: a query to use for the search, and a
callback function to use when the Domai.nr API has responded.

This next part will utilize request. I recommend taking a look at [this
example](https://github.com/mikeal/request#super-simple-to-use) to be a little
bit more familiar with how it works.

Essentially, we make an HTTP request to a URL, and request gives us an `error`
object, a `response` object, and a `body` object in response. We can then
utilize those in our callback function.

Let's go ahead and implement that in our search function (add lines 5 - 7):

<script src="https://gist.github.com/2817490.js"> </script>

This is pretty simple - we make a request to the search endpoint of Domai.nr's
API, with the query parameter of what we're searching. We then execute the
callback function with the JSON that Domai.nr returns.

This is looking pretty good, but let's fix one thing up. You see where we're
appending `query` to the URL? Go ahead and wrap `query` in `encodeURI`, so we
get something like:

<script src="https://gist.github.com/2817498.js"> </script>

This allows users to pass in phrases separated by spaces (i.e. "Connor Montgomery"), and have it query the API with both of them in mind (like the actual Domai.nr site does).

So, right now you get a [high five](http://www.ihighfive.com/), becuase our
`search` method is complete! In fact, you can even open up a terminal and check
it out (in node's [REPL](http://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop)):

```
$ cd TO/YOUR/DOMAINR/PROJECT/DIRECTORY
$ node
> var domainr = require("./lib/domainr");
> domainr.search("san francisco", function(resp) { console.log(resp) })
```

And after a few moments, you should see a JSON object from Domai.nr returned in
your terminal. Awesomesauce!

#### The .info method

The info method is essentially the same thing, we just make it an `exports.info`
(instead of `exports.search`, and change the URL in the `request` argument to
`http://domai.nr/api/json/info?q=`. We don't need to wrap the `query` in
*encodeURI*, since developers will be passing in a domain name, and not a
possibly-space-separated string.

However, we ought to throw an error if they do happen to not pass in a domain.
It's actually very trivial to do so, since we can just see what the
`statusCode` in the `response` object from request is. If it's a 200 (i.e. an
"OK"), all's well. If it's not, then we'll throw an error. See the code below:

<script src="https://gist.github.com/2817530.js"> </script>

And that's it, actually. Congrats!

If you were to push this to npm now, you'd simply need to create a user (`npm
adduser`). Next, you'd `cd` to the root of your project (where your
`package.json` file is), and simply type `npm publish`. And then it's live!
