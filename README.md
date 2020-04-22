# HydraFriend

Your friendly [hydra](https://github.com/ojack/hydra) library. A wrapper around hydra to allow for quicker, enhanded visual coding by way of stateful handlers and generators.

## Example

Let's create a simple setup that will invert a triangle everytime a `bd` sample is heard. This example assumes you have a [SuperCollider](https://supercollider.github.io/) session that relays messages to some given port (we are using port 3333). For an example file to use at startup, [see here](https://github.com/robertDurst/algorave_dump/blob/master/tidal-forward.scd).

```js
// import library (now on npm yeah!)
const { Handler, HydraFriend, initialize, Shape } = require("hydrafriend");

// Only call initialize once
// see https://github.com/tado/ofxTidalCycles/blob/master/startup.scd
initialize(3333);

// define a new triangle shape
const triangle = new Shape().radius(0.2).sides(3).smoothing(0.2);
// add some colors
triangle.red(200).green(200).blue(200);

// define a new octagon shape
const octagon = new Shape().radius(0.3).sides(8).smoothing(0.02);
// add some colors
octagon.red(100).green(100).blue(0);

// put the triangle inside the octagon
octagon.multiply_shape(triangle);

// handle bd by inverting every 5
const handle_bd = new Handler("bd", () => octagon.invert());
handle_bd.every(5);

// hande arpy by creating a cyclical rotation
const handle_arpy = new Handler("arpy");
handle_arpy.cycle([100, 0], 5);
handle_arpy.method(() =>  octagon.rotate(handle_arpy.current_cycle()));

// handle cp by creating a random color changing effect
const handle_cp = new Handler("cp");
handle_cp.randomizer(0, 255);
handle_cp.method(() => octagon.red(handle_cp.current_random_value())
                                                     .green(handle_cp.current_random_value() ** 2)
                                                     .blue(handle_cp.current_random_value() ** 3));
// handle crow by cyclically repeating the octagon
const handle_crow = new Handler("crow");
handle_crow.cycle([0, 4], -1);
handle_crow.method(() => octagon.repeat(handle_crow.current_cycle(), handle_crow.current_cycle()));

// handle reverbkick by cyclically scaling up and down
const handle_reverbkick = new Handler("reverbkick");
handle_reverbkick.cycle([5, 0], 1);
handle_reverbkick.method(() => octagon.scale(handle_reverbkick.current_cycle()));

// rotate the inner triangle
const handle_dsynth = new Handler("dsynth");
handle_dsynth.cycle([5, 0], 1);
handle_dsynth.method(() => triangle.rotate(handle_reverbkick.current_cycle()));

// register all our handlers
const hf = new HydraFriend();
hf.register(handle_bd);
hf.register(handle_arpy)
hf.register(handle_cp);
hf.register(handle_crow);
hf.register(handle_reverbkick);
hf.register(handle_dsynth);
```
