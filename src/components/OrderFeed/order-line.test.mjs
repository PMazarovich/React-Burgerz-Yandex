import {parseStatus} from "./order-line";
import checkEven from "../../reducer_tests/checkEven";
describe("проверка сравнения аргумента с done", () => {
    test("первый", () => {
        expect(parseStatus("done")).toBe(true)
        expect(checkEven("undone, hehehe")).toBe(false)
    })
})
