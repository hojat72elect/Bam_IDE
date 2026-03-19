/**
 * A LIFO data structure. It's easy to implement and reason about.
 */
export class Stack {
    private _dataHolder: any[];

    constructor(data: any[] = []) {
        this._dataHolder = data;
    }

    push(newValue: any) {
        this._dataHolder.push(newValue);
    }

    peek() {
        if (this.isEmpty()) return undefined;
        return this._dataHolder[this._dataHolder.length - 1];
    }

    pop() {
        if (this.isEmpty()) return undefined;
        return this._dataHolder.pop();
    }

    clear() {
        this._dataHolder = [];
    }

    getSize() {
        return this._dataHolder.length;
    }

    isEmpty() {
        return this._dataHolder.length === 0;
    }

    toString() {
        return this._dataHolder.join(" -> ");
    }
}