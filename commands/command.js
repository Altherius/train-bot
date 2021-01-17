module.exports = class Command {

    static parse(message) {
        if (this.match(message)) {
            this.action(message);
            return true;
        }
        return false;
    }

    static match(message) {
        console.warn('Abstract class Command called - This should never happen. (' + message + ')');
        return false;
    }

    static action(message) {}
};