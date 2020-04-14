/*
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

// generic function handler factory
const handler = (bind_sound, do_somthing) => {
    return (tidal_sound) => {
        if (tidal_sound === bind_sound) {
            do_somthing();
        }
    }
};

// HydraFriend is a registry for handlers, keeping track of relevant state,
// visualizers (like osc) and listening for emitted events from SuperCollider
class HydraFriend {
    constructor() {
        this.handlers = [];
        msg.on("/play2", (args) => {
            const tidal = parseTidal(args);
            setTimeout(() => {
                this.handlers.forEach(handle => {
                    handle(tidal.s);
                });
            }, (tidal.delay * 1000))
        });
    }

    // TODO: deal with unique handles
    register(bind_sound, do_somthing) {
        this.handlers.push(handler(bind_sound, do_somthing));
    }
}

module.exports = {
    initialize,
    HydraFriend,
}