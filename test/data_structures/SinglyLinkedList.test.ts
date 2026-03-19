import {expect, test} from "bun:test";
import {SinglyLinkedList} from "../../src/data_structures/SinglyLinkedList.ts";


test("General behavior of a SinglyLinkedList", () => {
    const sut1 = new SinglyLinkedList([6, 5, 7, -2]);
    expect(sut1.getSize()).toBe(4);
    expect(sut1.toString()).toBe("6 --> 5 --> 7 --> -2");
    expect(sut1.isEmpty()).toBeFalse();

    expect(sut1.removeFromFront()).toBe(6);
    expect(sut1.removeFromEnd()).toBe(-2);
    expect(sut1.getSize()).toBe(2);

    expect(sut1.removeAt(1)).toBe(7);
    expect(sut1.contains(5)).toBeTrue();
    expect(sut1.contains(10)).toBeFalse();

    sut1.clear();
    expect(sut1.isEmpty()).toBeTrue();

    const sut2 = new SinglyLinkedList([3, 7, 8, 4, 6, 2]);
    expect(sut2.toString()).toBe("3 --> 7 --> 8 --> 4 --> 6 --> 2");
    sut2.insertAt(9, 3);
    expect(sut2.indexOf(8)).toBe(2);
    expect(sut2.indexOf(9)).toBe(3);
    expect(sut2.indexOf(6)).toBe(5);
    expect(sut2.indexOf(2)).toBe(6);

    sut2.reverse();
    expect(sut2.toString()).toBe("2 --> 6 --> 4 --> 9 --> 8 --> 7 --> 3");

    expect(sut2.getAtIndex(3)).toBe(9);
    sut2.setAtIndex(5, 67)
    expect(sut2.toString()).toBe("2 --> 6 --> 4 --> 9 --> 8 --> 67 --> 3");

    expect(sut2.toArray()).toEqual([2, 6, 4, 9, 8, 67, 3]);
});