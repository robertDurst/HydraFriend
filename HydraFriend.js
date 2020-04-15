/**
 * @robertDurst 2020
 * 
 * a series of helper functions for quicker, cooler, more rad hydra visuals for
 * tidal cycles jam sessions
 */

// initialize a connection to SuperCollider
// NOTE: should only be called once per session
const initialize = port => {
    msg.setPort(port);
};

// parses tidal messages so we can use them below
// https://github.com/ojack/atom-hydra
const parseTidal = (args) => {
    obj = {}
    for (var i = 0; i < args.length; i += 2) {
        obj[args[i]] = args[i + 1]
    }
    return obj
};

/**
 * All possible events in this JavaScript-y enum, which is one of the best ways
 * to do enums according to:
 * https://www.sohamkamani.com/blog/2017/08/21/enums-in-javascript/
 * 
 * Currently supported conditions:
 *      * every: execute every x times
 */
const CONDITION_TYPES = {
    EVERY: "every",
}

/**
 * In Hydra, there are different generators, called sources in the docs:
 * https://github.com/ojack/hydra/blob/master/docs/funcs.md#sources
 */
const GENERATOR_TYPES = {
    SHAPE: "shape",
}

class Handler {
    constructor(bind_sample, do_somthing) {
        this.bind_sample = bind_sample;
        // conditions that can be placed on when method should be executed
        this.conditions = {}
        // method invoked whenever sample played and all conditions met
        this.do_somthing = do_somthing;
        this._update_handler();
    }

    // internal method for checking against various conditions for the handler
    // to execute (i.e. run every two times)
    _check_conditions() {
        const condition_keys = Object.keys(this.conditions);
        for (let i = 0; i < condition_keys.length; i++) {
            const condition = this.conditions[condition_keys[i]];
            if (!condition()) {
                return false;
            }
        }

        return true;
    }

    // internal method for updating handler when properties change
    _update_handler() {
        this.handler = (tidal_sound) => {
            if (tidal_sound === this.bind_sample && this._check_conditions()) {
                this.do_somthing();
            }
        }
    }

    // public interface for updating sample to match against
    sample(bind_sample) {
        this.bind_sample = bind_sample;
        this._update_handler();
    }

    // update method called whenever sample property met
    method(do_somthing) {
        this.do_somthing = do_somthing;
        this._update_handler();
    }

    // only play every x times
    every(x) {
        const iterations = x;
        let iterations_left = x;
        const condition = () => {
            iterations_left--;
            if (iterations_left == 0) {
                iterations_left = iterations;
                return true;
            }
            return false;
        }

        this.conditions[CONDITION_TYPES.EVERY] = condition;
    }

    // method called externally to execute underlying method
    _exec(tidal_sound) {
        this.handler(tidal_sound)
    }
}


/**
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

        // -1 means "off"
        this._invert = -1;

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
            .invert(() => this._invert)
            .out();
    }

    invert() {
        this._invert *= -1;
        return this
    }
}


// HydraFriend is a registry for handlers, keeping track of relevant state,
// visualizers (like osc) and listening for emitted events from SuperCollider
class HydraFriend {
    constructor() {
        // no handlers to start
        this.handlers = [];

        // listen for updates from SuperCollider
        msg.on("/play2", (args) => {
            const tidal = parseTidal(args);
            setTimeout(() => {
                this.handlers.forEach(handle => {
                    handle._exec(tidal.s);
                });
            }, (tidal.delay * 1000))
        });
    }

    // TODO: deal with unique handles
    register(handler) {
        this.handlers.push(handler);
    }
}

module.exports = {
    initialize,
    HydraFriend,
    Handler,
    Shape,
}