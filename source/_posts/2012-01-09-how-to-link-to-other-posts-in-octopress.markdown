---
layout: post
title: "How to link to external posts in octopress"
date: 2012-01-09 13:49
comments: false
external-url: 
published: true
---

Earlier this week, <a href="http://www.candlerblog.com/" target="_blank">Jonathan Protsky</a> tweeted at me, <a href="https://twitter.com/#!/poritsky/status/156436178650931200" target="_blank">asking how I link to external posts</a> in my custom Octopress theme. I figured Jonathan isn't the only one wondering how to do this, and since it isn't exactly obvious, I'm here to share how I went about implementing that functionality.

### It's all in the YAML

As you can see <a href="https://github.com/imathis/octopress/issues/119#issuecomment-1922504" target="_blank">here</a>, Octopress allows any variable(s) to be added to the YAML of your post. The way I went about doing it was by adding an `external-url` attribute.

#### For example, see the post below


<script src="https://gist.github.com/1584630.js"> </script>

As you can see, I'm simply adding an `external-url` attribute, and if I
want to link to a post that is at a different URL, I just put the URL in
there.

Now, you may have noticed that I also gave the post some content. That's
becuase with my custom theme, I have links to the previous/next posts
after the current post. If one of those links happens to be a post that
uses an `external-url`, I'd like to give them some context on my own
site before sending them off to another one.

### Okay, it's not all in the YAML

There's actually one more step. We just have to adjust the index page that loops through and lists
all of your posts (most likely `source/index.html`).

All you need to do is check to see if `post.external-url` exists. See
the example below (that's actually the `index.html` file I use):

<script src="https://gist.github.com/1584645.js"> </script>

And, as you can see, I'm prefixing all of my posts that link to an
external URL with `[link]`, so the user knows what to expect. I'd
recommend giving some kind of visual cue to the user.
