import {expect, test} from "bun:test";
import {Stack} from "../../src/data_structures/Stack.ts";

test("general behavior of a stack", () => {
    const sut = new Stack([3, 8, 4, 7, 6, 5]);

    expect(sut.toString()).toBe("3 -> 8 -> 4 -> 7 -> 6 -> 5");


    expect(sut.getSize()).toBe(6);
    sut.clear()
    expect(sut.getSize()).toBe(0);

    sut.push(3);
    sut.push(5);
    sut.push(9);
    expect(sut.toString()).toBe("3 -> 5 -> 9");

    expect(sut.peek()).toBe(9);
    expect(sut.pop()).toBe(9);
    expect(sut.pop()).toBe(5);
    expect(sut.pop()).toBe(3);
    expect(sut.pop()).toBeUndefined();

    expect(sut.isEmpty()).toBeTrue();
});