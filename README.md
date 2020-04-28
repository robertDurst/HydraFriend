# HydraFriend

Your friendly [hydra](https://github.com/ojack/hydra) library. A wrapper around hydra to allow for quicker, enhanded visual coding by way of stateful handlers and generators.

[See it in action!](https://www.twitch.tv/videos/599123738)

## Are There Docs?

Yes, but they are embarrasingly shallow and tbh not helpful - I will work on these once the library itself is more complete (*I promise 🙏*).

## How Can I Use This?

Ok, so you've cloned this repo, or found [it on npm](https://www.npmjs.com/package/hydrafriend). Congrats!! Then you had some serious issues trying to get it to work... my bad! These are the early days, things will only get better.

That being said, it is possible to use this right now. To do so, follow these steps:
1. install [atom](https://atom.io/)
2. install tidalcycles and hydra on atom
3. navigate to the hydra-atom package on your machine (Linux: `~/.atom/packages/atom-hydra`)
4. remove this package and [clone my fork](https://github.com/robertDurst/atom-hydra/tree/hydrafriend)
   * my fork adds 2 things:
      1. ability to eval whole file `ctrl-alt-enter`, necessary for importing packages
      2. installs the latest version of HydraFriend
5. `npm install` in the forked repo
6. open atom and go at it!

## Example

Let's create a super trivial setup that will do invert the colors of an octagon every 5 times `bd` is *heard*. This example assumes you have a [SuperCollider](https://supercollider.github.io/) session that relays messages to some given port (we are using port 3333). For an example file to use at startup, [see here](https://github.com/robertDurst/algorave_dump/blob/master/tidal-forward.scd).

**visual.js**
```js
// import library (now on npm yeah!)
const { Handler, HydraFriend, initialize, Shape } = require("hydrafriend");

// Only call initialize once
// see https://github.com/tado/ofxTidalCycles/blob/master/startup.scd
initialize(3333);

// define a new octagon shape
const octagon = new Shape()sides(8);

// handle bd by inverting every 5
const handle_bd = new Handler("bd", () => octagon.invert());
handle_bd.every(5);

// register all our handlers
const hf = new HydraFriend();
hf.register(handle_bd);
```

**music.tidal**
```
d1 $ s "bd sn"
```
