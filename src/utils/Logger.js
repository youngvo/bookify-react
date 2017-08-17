class Logger {
    static instance = new Logger();

    constructor() {
        if (Logger.instance) return Logger.instance;

        this.enable = true;
        this.level = 3;

        return this;
    }

    _doLog(level, msg, object, instanceOf) {
        if (this.level < level) return;

        const instance = instanceOf ? instanceOf.constructor.name : '';
        const message = `${instance}.${level}: ${msg}`;

        if (object) {
            console[level](message, object);
        } else {
            console[level](message);
        }
    }

    info(msg, object=null, instanceOf=null) {
        if (!this.enable) return;
        this._doLog('info', msg, object, instanceOf);
    }

    warn(msg, object=null, instanceOf=null) {
        if (!this.enable) return;
        this._doLog('warn', msg, object, instanceOf);
    }

    error(msg, object=null, instanceOf=null) {
        if (!this.enable) return;
        this._doLog('error', msg, object, instanceOf);
    }

}

export default Logger;