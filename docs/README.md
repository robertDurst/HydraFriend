# HydraFriend Documentation

HydraFriend is an wrapper around [hydra](https://github.com/ojack/hydra) allowing for stateful, sample-bound, handlers.

- [Generators](#Generators)
  * [Shape](#Shape)
    + [Methods](#Shape-Methods)
    + [Examples](#Shape-Examples)
  * [Oscillator](#Oscillator)
    + [Methods](#Oscillator-Methods)
    + [Examples](#Oscillator-Examples)
- [Handlers](#Handlers)
    * [Methods](#Handler-Methods)
    * [Examples](#Handler-Examples)
- [HydraFriend](#HydraFriend)


<!-- toc -->

## Generators

A generator is a stateful object wrapped around a [source](https://github.com/ojack/hydra/blob/master/docs/funcs.md#sources), responsible for creating *visual content*.

### Shape

A shape is a multi-sided figure.

#### Shape-Methods

| Name | Parameters | Description |
|-------|-----------|---------------|
| background | [0-255], [0-255], [0-255] | change the color of the background |
| sides | int | set number of sides |
| radius | float | set radius size | 
| smoothing | float | set smoothing effect |
| red | [0-255] | set r value in rgb |
| green | [0-255] | set g value in rgb |
| blue | [0-255] | set b value in rgb |
| invert | None | inverts the coloring |
| rotate | [0-365] | sets rotation in degrees |
| repeat | int, int, int, int | creates a repitition grid for of this shape | 
| scale | int | scales this shape |
| kaleid | int | generates the kaleidiscope effect with x sides | 
| colorama | array of int's | cycles through color distortion effects, by *"shifting HSV values."*- [the docs](https://github.com/ojack/hydra/blob/master/docs/funcs.md#colorama)|   
| mult_generator | Shape/Oscillator | puts a Shape/Oscillator inside this shape | 
| add_generator | Shape/Oscillator | adds a Shape/Oscillator inside this shape | 
| blend_generator | Shape/Oscillator | blends a Shape/Oscillator inside this shape | 
| modulate_noise | int, int | modulates based on [Hydra's noise](https://github.com/ojack/hydra/blob/master/docs/funcs.md#noise) source | 
| modulate_generator | generator | same as above, but uses a generator as the source| 

### Shape-Examples

**Create a new triangle and change background to red:**
```js
const triangle = new Shape(3);
triangle.background(255, 0, 0);
```

**Change sides, invert, rotate, then change color:**
```js
const triangle = new Shape(3);
triangle.sides(4)
        .invert()
        .rotate(180)
        .red(255)
        .green(255)
        .blue(0);
```

**Create a 3 x 3 grid of squares:**
```js
const square = new Shape(4);
square.repeat(
    x_num = 3,
    y_num = 3,
);
```

### Oscillator

An oscillator is a continuous oscillation.

#### Oscillator-Methods

| Name | Parameters | Description |
|-------|------------|--------------|
| frequency | float | frequency of oscillation |
| sync | float | honestly, idk |
| offset | float | the offset of the oscillations |
| red | [0-255] | set r value in rgb |
| green | [0-255] | set g value in rgb |
| blue | [0-255] | set b value in rgb |
| rotate | [0-365] | set angle |
| invert | None | inverts the coloring |
| kaleid | int | generates the kaleidiscope effect with x sides | 
| scale | int | set size |
| colorama | array of int's | cycles through color distortion effects, by *"shifting HSV values."*- [the docs](https://github.com/ojack/hydra/blob/master/docs/funcs.md#colorama)|   
| blend_generator | generator | blends with a generator |
| mult_generator | generator | puts a generator inside it |
| modulate_noise | int, int | modulates based on [Hydra's noise](https://github.com/ojack/hydra/blob/master/docs/funcs.md#noise) source | 
| modulate_generator | generator | same as above, but uses a generator as the source| 


### Oscillator-Examples

**Create a new oscillator with defaults:**
```js
const osc1 = new Oscillator();
```

**Set frequency and sync of oscillator:**
```js
const osc1 = new Oscillator();
osc1.frequency(100).sync(0.3);
```

**Change color of oscillator:**
```js
const osc1 = new Oscillator();
osc1.red(255).green(0).blue(0);
```

**Rotate and scale:**
```js
const osc1 = new Oscillator();
osc1.rotate(180).scale(3);
```

**Colorama**
```js
const osc1 = new Oscillator();
osc1.colorama([0.3, 0.7, 0.9]);
```

**Blend with a second oscillator:**
```js
const osc1 = new Oscillator();
const osc2 = new Oscillator();
osc1.blend_generator(osc2);
```

**Modulate with noise**
```js
const osc1 = new Oscillator();
osc1.modulate_noise(10, 0.7)
```

## Handlers

A handler binds a method to a sample.

### Handler-Methods

| Name | Parameters | Description |
|-------|-----------|---------------|
| sample | string | binds handler to the given sample name |
| method | functtion | sets function |
| every | int | adds a condition on the function such that it only executes every `x` times |
| cycle | [int, int], int, int | creates a cycle that increments by the given step every method call | 
| current_cycle | None | getter for cycle | 
| randomizer | int, int | generates a new pseudo-random value every time the method is called | 
| current_random_value | None | getter for random value | 
| current_random_value | None | getter for random value | 
| time_sine | None | `static` returns a method that oscilates over the sine curve with time | 


### Handler-Examples

**Create a new handler bound to bd:**
```js
const handle_bd = new Handler("bd");
```

**Activate handle every 5 times it is heard:**
```js
const handle_bd = new Handler("bd");
handle_bd.every(5);
```

**Initialize randomizer:**
```js
const handle_bd = new Handler("bd");
handle_bd.randomizer();
```

**Initialize a continuous cycle from 2 --> 5 --> 2, stepped by 1 and starting at 2**
```js
const handle_bd = new Handler("bd");
handle_bd.cycle([5,2], 1, 2);
```

**Utilize cycle to scale a triangle shape generator:**
```js
const handle_bd = new Handler("bd");
handle_bd.cycle([5,0], 1);
handle_bd.method(() => triangle.scale(handle_bd.current_cycle()));
```

## HydraFriend

HydraFriend interacts with SuperCollider, listening for messages, parsing Tidal messages, and then calling all registered handlers with the parsed message as input. It may seem obvious, but in case it isn't, `unregistered handlers won't do anything`.

**Create a HydraFriend instance and register two handlers:**
```js
const hf = new HydraFriend();
hf.register(handle_bd);
hf.register(handl_sn);
```
