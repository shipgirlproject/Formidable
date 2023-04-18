class Required {
    constructor(type, count = 1) {
        this.type = type || 'string';
        this.count = type === 'array' ? count : null;
    }

    toString() {
        return this.type === 'array' ? `Array(${this.count})`: this.type[0].toUpperCase() + this.type.substring(1);
    }
}

module.exports = Required;