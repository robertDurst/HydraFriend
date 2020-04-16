# HydraFriend

Your friendly [hydra](https://github.com/ojack/hyra) library. A wrapper around hydra to allow for quicker, enhanded visual coding by way of stateful handlers and generators.

## Example

Let's create a simple setup that will invert a triangle everytime a `bd` sample is heard. This example assumes you have a [SuperCollider](https://supercollider.github.io/) session that relays messages to some given port (we are using port 3333). For an example file to use at startup, [see here](https://github.com/robertDurst/algorave_dump/blob/master/tidal-forward.scd).

```js
const { Handler, HydraFriend, initialize, Shape } = require("./index");

// only call once or things go whacky
const port = 3333;
initialize()

// create a triangle
const triangle = new Shape()
                     .sides(3);

// create a handler that inverts the triangle every other time bd is heard
const handle_bd = new Handler()
                      .sample("bd")
                      .method(() => triangle.invert());

// now create a HydraFriend instance and register handle_bd
const hf = new HydraFriend();
hf.register(handle_bd);
```