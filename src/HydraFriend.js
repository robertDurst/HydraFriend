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
};