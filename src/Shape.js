/**
 * @robertDurst 2020
 * 
 * Shape constructor in Hydra:
 *  shape( sides, radius, smoothing)
 * 
 * sides default:        3
 * radius default:     0.3
 * smoothing default: 0.01
 */
class Shape {
    constructor(sides = 3, radius = 0.3, smoothing = 0.01) {
        this._sides = sides;
        this._radius = radius;
        this._smoothing = smoothing;

        // defaults to white
        this._rgb = { "r": 1, "g": 1, "b": 1 };

        // -1 means "off"
        this._invert = -1;

        // 0 means "straight up" via 0 degree rotation
        this._rotate = 0;

        this._exec();
    }

    sides(sides) {
        this._sides = sides;

        // update everytime (may be only in the chain)
        this._exec();

        // allows for chaining
        return this;
    }

    radius(radius) {
        this._radius = radius;

        // update everytime (may be only in the chain)
        this._exec();

        // allows for chaining
        return this;
    }

    smoothing(smoothing) {
        this._smoothing = smoothing;

        // update everytime (may be only in the chain)
        this._exec();

        // allows for chaining
        return this;
    }

    _exec() {
        shape(this._sides, this._radius, this._smoothing)
            .rotate(() => this._rotate)
            .invert(() => this._invert)
            .color(() => this._rgb["r"], () => this._rgb["g"], () => this._rgb["b"])
            .out();
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

    invert() {
        this._invert *= -1;

        // for chaining
        return this
    }

    rotate(rotate) {
        // hiding this mod 360 is not great, but limits weird iver rotations
        const modded_rotate = rotate % 360;

        this._rotate = modded_rotate;

        // for chaining
        return this;
    }
}

module.exports = {
    Shape,
};