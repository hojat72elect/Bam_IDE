/**
 * This is a simple one-way queue and a FIFO structure.
 */
export class Queue {

    private _dataHolder: any[];

    constructor(data: any[] = []) {
        this._dataHolder = data;
    }

    isEmpty() {
        return this._dataHolder.length === 0;
    }

    getSize() {
        return this._dataHolder.length;
    }

    enqueue(newValue: any) {
        this._dataHolder.push(newValue);
    }

    dequeue() {
        if (this.isEmpty()) return undefined;
        return this._dataHolder.shift();
    }

    /**
     * @return The element in the row with the highest priority. Or undefined, if the queue is empty.
     */
    peekFront() {
        if (this.isEmpty()) return undefined;
        return this._dataHolder[0];
    }

    peekBack() {
        if (this.isEmpty()) return undefined;
        return this._dataHolder[this._dataHolder.length - 1];
    }

    /**
     * @returns A string representation of the Queue (for debugging purposes).
     */
    toString(): string {
        return this._dataHolder.join(" <-- ");
    }

    clear() {
        this._dataHolder = [];
    }
}