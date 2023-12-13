const checkEven = require("./checkEven")
describe("all even tests", () => {
        test("evenTest", () => {
            expect(checkEven(8)).toBe(true)
            expect(checkEven(9)).toBe(false)
        })
        test("anotherEvenTest", () => {
            expect(checkEven(10)).toBe(true)
            expect(checkEven(11)).toBe(false)
        })
        test("oneMoreEvenTest", () => {
            expect(checkEven(12)).toBe(true)
            expect(checkEven(13)).toBe(false)
        })
    }
)
