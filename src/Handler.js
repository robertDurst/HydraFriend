/**
 * @robertDurst 2020
 * 
 * Handler is a single instance of some rule that handles some sample. It binds
 * a given method to be executed every time a sample is "heard" based on some
 * conditions and state.
 */

/**
 * All possible events in this JavaScript-y enum, which is one of the best ways
 * to do enums according to:
 * https://www.sohamkamani.com/blog/2017/08/21/enums-in-javascript/
 * 
 * Currently supported conditions:
 *      * every: execute every x times
 *      * cycle: continously increment, decrement iterations through a cycle
 *      * randomizer: generate random numbers between a given max and min
 */
const CONDITION_TYPES = {
    EVERY: "every",
    CYCLE: "cycle",
}

class Handler {
    constructor(bind_sample, do_somthing) {
        this.bind_sample = bind_sample;

        // conditions that can be placed on when method should be executed
        this.conditions = {}
        // method invoked whenever sample played and all conditions met
        this.do_somthing = do_somthing;
        // cycle is a field allowing for somthing to go up to some value then
        // reset back to some other value. It is an array so that a value can
        // cycle between multiple values i.e. [100, 0] goes from 0 .. 100 .. 0.
        // if the second number is less than the first, it cycles negatively
        this._cycles = [];
        // cycle step is what you'd think, how much a cycle increments or
        // decrements by
        this._cycle_step = [];
        // current cycle is public via a getter so that it can be used as part
        // of the do_something
        this._current_cycle = 0;
        // allows for some random value to exist which can be used to create
        // some interesting effects
        this._random_value = 0;

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

        // allows for chaining
        return this;
    }

    // update method called whenever sample property met
    method(do_somthing) {
        this.do_somthing = do_somthing;
        this._update_handler();

        // allows for chaining
        return this;
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

    // cycle between different values
    cycle(cycle, step) {
        // check that cycle is an array, if not then return because this won't
        // work
        if (!Array.isArray(cycle) || cycle.length != 2) {
            // should probably error here instead
            console.log("Expected an array of length 2 for cycle.")
            return
        }

        this._cycles = cycle;

        // the step may be in the wrong direction, but that is a user error
        this._cycle_step = step;

        // while this is a conition, it is only a condition so that it will
        // step through on every execution, thus always returning true
        const condition = () => {
            this._current_cycle += this._cycle_step;

            // use the step to determine which direction we are going
            const isIncrementing = this._cycle_step > 0;
            if (isIncrementing) {
                if (this._current_cycle >= this._cycles[0]) {
                    // switch step direction
                    this._cycle_step *= -1;
                    // reverse the cycle
                    const temp = this._cycles[0];
                    this._cycles[0] = this._cycles[1];
                    this._cycles[1] = temp;
                }
            } else {
                if (this._current_cycle <= this._cycles[0]) {
                    // switch step direction
                    this._cycle_step *= -1;
                    // reverse the cycle
                    const temp = this._cycles[0];
                    this._cycles[0] = this._cycles[1];
                    this._cycles[1] = temp;
                }
            }

            return true;
        }

        this.conditions[CONDITION_TYPES.CYCLE] = condition;
    }

    current_cycle() {
        return this._current_cycle;
    }

    randomizer(min, max) {
        // simply updates a random value between some inclusive max and min
        const condition = () => {
            // https://www.w3schools.com/js/js_random.asp
            this._random_value = Math.floor(Math.random() * (max - min + 1)) + min;
            return true;
        }

        this.conditions[CONDITION_TYPES.EVERY] = condition;
    }

    current_random_value() {
        return this._random_value;
    }

    // method called externally to execute underlying method
    _exec(tidal_sound) {
        this.handler(tidal_sound)
    }
}

module.exports = {
    Handler,
};