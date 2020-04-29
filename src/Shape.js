/**
 * @robertDurst 2020
 * 
 */

/**
 * Note to future self:
 * It may not be clear in the code below why some recall exec and others do
 * not. The reasoning is, is that it creates a whole new shape object. Thus,
 * since this is costly, and since we can pass lambdas that get, the current
 * values anyway, we should call this as little as possible, in methods that
 * likely will not be updated very often at all, or just never if we can get
 * away with it. The only place we call it so far is in the mult, the reason
 * being I could not figure out what a zero value would be there (and of
 * course in the constructor so that it is called at least once.)
 */

/** Shape constructor in Hydra:
 *  shape( sides, radius, smoothing)
 * 
 * sides default:        3
 * radius default:     0.3
 * smoothing default: 0.01
 * buffer default 0
 */
class Shape {
    constructor(sides = 3, radius = 0.3, smoothing = 0.01) {
        this._sides = sides;
        this._radius = radius;
        this._smoothing = smoothing;

        // defaults to white
        this._rgb = { "r": 1, "g": 1, "b": 1 };

        // defaults to no repeat
        this._repeat = {
            "x_num": 1,
            "x_offset": 0,
            "y_num": 1,
            "y_offset": 0,
        }

        // -1 means "off"
        this._invert = 0;

        // 1 means "normal"
        this._scale = 1;

        // 0 means "straight up" via 0 degree rotation
        this._rotate = 0;

        // since we may want to put sources in sources, we need a way to access
        // the underlying generator
        this._raw;

        // defaults to black
        this._background = { "r": 0, "g": 0, "b": 0 };

        this._exec();

        // for chaining
        return this;
    }

    sides(sides) {
        this._sides = sides;

        // allows for chaining
        return this;
    }

    radius(radius) {
        this._radius = radius;

        // allows for chaining
        return this;
    }

    smoothing(smoothing) {
        this._smoothing = smoothing;

        // allows for chaining
        return this;
    }

    buffer(buffer) {
        this._buffer = buffer;

        // allows for chaining
        return this;
    }

    background(r, g, b) {
        this._background["r"] = (r % 256) / 255.0;
        this._background["g"] = (g % 256) / 255.0;
        this._background["b"] = (b % 256) / 255.0;

        // allows for chaining
        return this;
    }

    _exec() {
        console.log(this)
        const s = shape(
            () => this._sides,
            () => this._radius,
            () => this._smoothing)
            .rotate(() => this._rotate)
            .invert(() => this._invert)
            .color(
                () => this._rgb["r"],
                () => this._rgb["g"],
                () => this._rgb["b"])
            .scale(() => this._scale)
            .repeat(
                () => this._repeat.x_num,
                () => this._repeat.y_num,
                () => this._repeat.x_offset,
                () => this._repeat.y_offset);

        if (this._mult) {
            s.mult(this._mult.texture);
        }

        if (this._add) {
            s.add(this._add.texture);
        }

        if (this._blend) {
            s.blend(this._blend.texture);
        }

        s.out();

        const background = solid(
            () => this._background["r"],
            () => this._background["g"],
            () => this._background["b"]
        ).add(s).out();

        this._raw = background;
    }

    red(n) {
        // allow user to input "normal" 0 - 255 range
        this._rgb["r"] = (n % 256) / 255.0;

        // for chaining
        return this;
    }

    green(n) {
        // allow user to input "normal" 0 - 255 range
        this._rgb["g"] = (n % 256) / 255.0;

        // for chaining
        return this;
    }

    blue(n) {
        // allow user to input "normal" 0 - 255 range
        this._rgb["b"] = (n % 256) / 255.0;

        // for chaining
        return this;
    }

    invert() {
        switch (this._invert) {
            case -1:
                this._invert = 1;
                break;
            default:
                this._invert = -1;
                break;
        }

        // for chaining
        return this
    }

    rotate(rotate) {
        // hiding this mod 360 is not great, but limits weird over rotations
        const modded_rotate = rotate % 360;

        this._rotate = modded_rotate;

        // for chaining
        return this;
    }

    mult_generator(generator) {
        this._mult = { texture: generator._get_raw() };
        this._exec();

        // for chaining
        return this;
    }

    add_generator(generator) {
        this._add = { texture: generator._get_raw() };
        this._exec();

        // for chaining
        return this;
    }

    blend_generator(generator) {
        this._blend = { texture: generator._get_raw() };
        this._exec();

        // for chaining
        return this;
    }

    repeat(x_num = 3.0, y_num = 3.0, x_offset = 0.0, y_offset = 0.0) {
        this._repeat = {
            x_num,
            x_offset,
            y_num,
            y_offset,
        };

        // for chaining
        return this;
    }

    scale(scale) {
        this._scale = scale;

        // for chaining
        return this;
    }

    _get_raw() {
        return this._raw;
    }
}

module.exports = {
    Shape,
};