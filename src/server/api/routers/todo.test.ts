import { describe,expect,it } from "vitest";

function add(lhs: number, rhs: number){
    return lhs + rhs;
}

describe("add", () => {
    it("should add two numbers", () => {
        expect(add(2, 3)).toBe(5);
    });
});