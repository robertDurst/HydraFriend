/**
 * @robertDurst 2020
 * 
 */

class Oscillator {
    constructor(frequency = 60.0, sync = 0.1, offset = 0.0) {
        this._frequency = frequency;
        this._sync = sync;
        this._offset = offset;

        // defaults to white
        this._rgb = { "r": 1, "g": 1, "b": 1 };

        // 0 means "straight up" via 0 degree rotation
        this._rotate = 0;

        // 1 means "normal"
        this._scale = 1;

        // since we may want to put sources in sources, we need a way to access
        // the underlying generator
        this._raw;

        this._exec();

        // for chaining
        return this;
    }

    frequency(frequency) {
        this._frequency = frequency;

        // for chaining
        return this;
    }

    sync(sync) {
        this._sync = sync;

        // for chaining
        return this;
    }

    offset(offset) {
        this._offset = offset;

        // for chaining
        return this;
    }

    buffer(buffer) {
        this._buffer = buffer;

        // allows for chaining
        return this;
    }

    red(n) {
        // allow user to input "normal" 0 - 255 range
        this._rgb["r"] = (n % 256) / 255.0

        // for chaining
        return this;
    }

    green(n) {
        // allow user to input "normal" 0 - 255 range
        this._rgb["g"] = (n % 256) / 255.0

        // for chaining
        return this;
    }

    blue(n) {
        // allow user to input "normal" 0 - 255 range
        this._rgb["b"] = (n % 256) / 255.0

        // for chaining
        return this;
    }

    scale(scale) {
        this._scale = scale;

        // for chaining
        return this;
    }

    blend_generator(generator) {
        this._blend = { texture: generator._get_raw() };

        this._exec();

        // for chaining
        return this;
    }

    mult_generator(generator) {
        this._mult = { texture: generator._get_raw() };
        this._exec();

        // for chaining
        return this;
    }

    rotate(rotate) {
        // hiding this mod 360 is not great, but limits weird over rotations
        const modded_rotate = rotate % 360;

        this._rotate = modded_rotate;

        // for chaining
        return this;
    }

    _exec() {
        const o = osc(
            () => this._frequency,
            () => this._sync,
            () => this._offset)
            .color(
                () => this._rgb["r"],
                () => this._rgb["g"],
                () => this._rgb["b"])
            .rotate(() => this._rotate)
            .scale(() => this._scale)

        if (this._mult) {
            o.mult(this._mult.texture);
        }

        if (this._blend) {
            o.blend(this._blend.texture);
        }

        o.out();

        this._raw = o;
    }

    _get_raw() {
        return this._raw;
    }
}

module.exports = {
    Oscillator,
}