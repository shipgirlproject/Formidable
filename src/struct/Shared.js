const Piscina = require('piscina');

class Shared {
    constructor({ ok, time, data } = {}) {
        this.ok = ok;
        this.time = time;
        this.data = data;
    }

    get [Piscina.transferableSymbol]() {
        return [this.data];
    }

    get [Piscina.valueSymbol]() {
        return { ok: this.ok, time: this.time, data: this.data };
    }

    movable() {
        return Piscina.move(this);
    }

    notMovable() {
        return { ok: this.ok, time: this.time, data: this.data };
    }
}

module.exports = Shared;