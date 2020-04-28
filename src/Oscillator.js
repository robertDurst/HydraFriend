/**
 * @robertDurst 2020
 * 
 */

class Oscillator {
    constructor(frequency=60.0, sync=0.1, offset=0.0) {
        this._frequency = frequency;
        this._sync = sync;
        this._offset = offset;

        // defaults to 0
        this._kaleid = 0;

        // defaults to white
        this._rgb = { "r": 1, "g": 1, "b": 1 };

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

    kaleid(kaleid) {
        this._kaleid = kaleid;
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
            .kaleid(() => this._kaleid);
            

        if (this._mult) {
            o.mult(this._mult.texture);
        }

        o.out(this._buf());

        this._raw = o;
    }

    _buf() {
        switch (this._buffer) {
            case 0:
                return o0;
            case 1:
                return o1;
            case 2:
                return o2;
            default:
                return o3;
        }
    }

    _get_raw() {
        return this._raw;
    }
}

module.exports = {
    Oscillator,
}