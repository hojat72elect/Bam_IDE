import {expect, test} from "bun:test";
import {Queue} from "../../src/data_structures/Queue.ts";

test("General behavior of a Queue", () => {
    const sut = new Queue([0, 2, 6, 5]);

    expect(sut.isEmpty()).toBeFalse();
    expect(sut.getSize()).toBe(4);

    sut.enqueue(9);
    expect(sut.getSize()).toBe(5);

    expect(sut.dequeue()).toBe(0);
    expect(sut.getSize()).toBe(4);

    expect(sut.peekFront()).toBe(2);
    expect(sut.peekBack()).toBe(9);
    expect(sut.toString()).toBe("2 <-- 6 <-- 5 <-- 9");

    sut.clear();
    expect(sut.isEmpty()).toBeTrue();
    expect(sut.getSize()).toBe(0);
});