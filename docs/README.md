# HydraFriend Documentation

HydraFriend is an wrapper around [hydra](https://github.com/ojack/hydra) allowing for stateful, sample-driven, handlers.

- [Generators](#Generators)
  * [Shape](#Shape)
    + [Methods](#Methods)
  * [Oscillator](#Oscillator)
    + [Methods](#Methods)
- [Handlers](#Handlers)
    * [Methods](#Methods)
- [HydraFriend](#HydraFriend)


<!-- toc -->

## Generators

A generator is a stateful object wrapped around a [source](https://github.com/ojack/hydra/blob/master/docs/funcs.md#sources), responsible for creating *visual content*.

### Shape

A shape is a multi-sided figure.

#### Shape Methods

| Name | Parameters | Description |
|-------|-----------|---------------|
| sides | int | set number of sides |
| radius | float | set radius size | 
| smoothing | float | set smoothing effect |
| buffer | [0 - 3] | set buffer where this will be displayed |
| red | [0-255] | set r value in rgb |
| green | [0-255] | set g value in rgb |
| blue | [0-255] | set b value in rgb |
| invert | None | inverts the coloring |
| rotate | [0-365] | sets rotation in degrees |
| multiply_shape | Shape/Oscillator | puts a Shape/Oscillator inside this shape | 
| multiply_color | [0-255], [0-255], [0-255] | puts coloring inside this shape | 
| repeat | int, int, int, int | creates a repitition grid for of this shape | 
| scale | int | scales this shape |


### Oscillator

An oscillator is a continuous oscillation.

#### Oscillator Methods

| Name | Parameters | Description |
|-------|------------|--------------|
| frequency | float | frequency of oscillation |
| sync | float | honestly, idk |
| offset | float | the offset of the oscillations |
| buffer | [0 - 3] | set buffer where this will be displayed |
| red | [0-255] | set r value in rgb |
| green | [0-255] | set g value in rgb |
| blue | [0-255] | set b value in rgb |
| kaleid | int | creates a kaleidiscope pattern | 

## Handlers

A handler binds a method to a sample.

### Methods

| Name | Parameters | Description |
|-------|-----------|---------------|
| sample | string | binds handler to the given sample name |
| method | functtion | sets function |
| every | int | adds a condition on the function such that it only executes every `x` times |
| cycle | [int, int], int | creates a cycle that increments by the given step every method call | 
| current_cycle | None | getter for cycle | 
| randomizer | int, int | generates a new pseudo-random value every time the method is called | 
| current_random_value | None | getter for random value | 

## HydraFriend

HydraFriend interacts with SuperCollider, listening for messages, parsing Tidal messages, and then calling all registered handlers with the parsed message as input. It may seem obvious, but in case it isn't, `unregistered handlers won't do anything`.
