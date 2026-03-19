import {expect, test} from "bun:test";
import {Vector2} from "../../src/data_structures/Vector2.ts";

test("Normal features of a 2D vector", () => {

    let sut = new Vector2(3, 4);
    expect(sut.x).toBe(3);
    expect(sut.y).toBe(4);

    sut.reset();
    expect(sut.x).toBe(0);
    expect(sut.y).toBe(0);

    sut = new Vector2(5, 7);
    const copy = sut.copy();
    expect(copy.x).toBe(sut.x);
    expect(copy.y).toBe(sut.y);

    sut.negate();
    expect(sut.x).toBe(-5);
    expect(sut.y).toBe(-7);

});

test("Binary vector operations", () => {

    const vector1 = new Vector2(3, 4);
    const vector2 = new Vector2(6, 8);

    expect(vector1.equals(vector2)).toBeFalse();
    expect(vector1.add(vector2)).toEqual(new Vector2(9, 12));
    expect(vector1.subtract(vector2)).toEqual(new Vector2(-3, -4));
    expect(vector1.multiply(vector2)).toEqual(new Vector2(18, 32));
    expect(vector1.divide(vector2)).toEqual(new Vector2(0.5, 0.5));

    vector1.scale(3);
    expect(vector1.x).toBe(9);
    expect(vector1.y).toBe(12);

    expect(vector1.getLength()).toBe(15);
    expect(vector2.getLength()).toBe(10);

    vector1.normalize();
    vector2.normalize();
    expect(vector1.getLength()).toBe(1);
    expect(vector2.getLength()).toBe(1);
    expect(vector1.x).toBe(0.6)
    expect(vector1.y).toBe(0.8)
    expect(vector2.x).toBe(0.6)
    expect(vector2.y).toBe(0.8)
});