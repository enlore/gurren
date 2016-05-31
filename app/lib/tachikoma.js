;(function (context) {
    function tachikoma (api, commitSepuku) {
        this.api = api;

        this.commitSepuku = commitSepuku;

        this.TachikomaError = function TachikomaError () {
            var temp = Error.apply(this, arguments);

            var key;

            for (key of Object.getOwnPropertyNames(temp)) {
                this[key] = temp[key];
            }

            this.name = "TachikomaError";
        }

        this.create = function create (attempts) {
            var max = 10;
            this.attempts = this.attempts || 0;

            if (attempts === max) throw new this.TachikomaError("Can't establish socket connection");

            var self = this;

            try {
                this.ws = new WebSocket("ws://localhost:3000/"); // TODO 2 this actually gets created
                this.attempts++;

                // TODO 3 and these get bound
                this.ws.onopen = function (ev) {
                    console.info(ev);
                    api.write(null, "open");
                }

                // TODO 5 which is why we can use the error and close events to
                // manage retry cycles and other aspects of errors
                this.ws.onclose = function (ev, arg) {
                    console.info(ev);
                    api.write(ev, "close");
                }

                // TODO 4 which means that this gets called when something like
                // a connection_failure happens
                this.ws.onerror = function (ev) {
                    console.error(ev);
                    api.write(ev, "error");
                }

                this.ws.onmessage = function (msg) {
                    api.write(msg, "message");
                }

            } catch (e) { // TODO 1 this isn't actually being hit when the ws fails to connect
                // TODO 6 allegedly this will still go off when a port is being
                // blocked, though, which is kind of bonkers
                this.create.call(this, this.attempts);
            }
        }

        this.create.call(this);

        this.api.on("send").run(this.handleSend.bind(this));
        this.api.on("reopen").run(this.handleReopen.bind(this));
    }


    tachikoma.prototype.handleDestroy = function handleDestroy () {
        //this.api.write(null, "destroying");
        this.ws.close();
        this.commitSepuku();
        this.api.write(null, "destroyed");
    }

    tachikoma.prototype.handleSend = function handleSend (msg) {
        if (this.ws.readyState === 2 || this.ws.readyState === 3)
            this.api.write(null, "reopen");
        this.ws.send(msg);
    }

    tachikoma.prototype.send = function send (msg) {

    }

    tachikoma.prototype.handleReopen = function handleReopen () {
        this.create.call(this, this.attempts);
    }

    if (context.seele) {
      context.seele.register("tachikoma", tachikoma);
    } else if (context.require) {
        // stuff
    } else if (context.module && context.module.exports) {
        // other stuff
    }
})(window);

// connecting 0
// open 1
// closing 2
// closed 3
//
// .close(code, reason)
// .send(stuff)
