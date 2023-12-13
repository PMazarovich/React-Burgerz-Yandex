import {authActions, authReducers} from "../reducers/AuthSlice";
import {constructorActions, constructorReducers} from "../reducers/BurgerConstructorSlice";
import { v4 as uuidv4 } from 'uuid';

// Mock the uuid module
jest.mock('uuid', () => ({
    v4: jest.fn(),
}));

const initialState = {
    bun: '643d69a5c3f7b9001cfa093c',
    ingredients: [],
}

describe("BurgerConstructor slice actions tests", () => {
    test("initial state value test", () => {
        expect(constructorReducers(undefined, {
            bun: '643d69a5c3f7b9001cfa093c',
            ingredients: [],
        })).toEqual(initialState)
    })
    test("action addIngredient test", () => {
        uuidv4.mockReturnValue('b869b92a-ce9a-4029-b6e7-58c73ba2db8f');
        const expectedAction = {
            type: constructorActions.addIngredient.type,
            payload: {
                ingredientId: "138641567986513489",
                uuid: "b869b92a-ce9a-4029-b6e7-58c73ba2db8f",
            }
        }
        expect(constructorActions.addIngredient("138641567986513489")).toEqual(expectedAction)
    })
    test("action addBun test", () => {
        // ожидаем выработки конкретно этого action
        const expectedAction = {
            type: constructorActions.addBun.type,
            payload: {
                bun: "14874865132"
            }
        }
        expect(constructorActions.addBun({
            bun: "14874865132"
        })).toEqual(expectedAction)
    })
    // todo add test remove ingredient
    test("action removeIngredient test", () => {
        const expectedAction = {
            type: constructorActions.removeIngredient.type,
            payload: "789456123"
        }
        expect(constructorActions.removeIngredient("789456123")).toEqual(expectedAction)
    })
})
