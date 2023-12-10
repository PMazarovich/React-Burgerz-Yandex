import {authActions, authReducers} from "../reducers/AuthSlice";

const initialState = {
    name: '',
    email: '',
    permissions: null,
    userLoggedIn: false,
}

describe("auth slice actions tests", () => {
    test("initial state value test", () => {
        expect(authReducers(undefined, {})).toEqual(initialState)
    })
    test("action userLoggedOut test", () => {
        const expectedAction = {
            type: authActions.userLoggedOut.type,
            payload: undefined
        }
        expect(authActions.userLoggedOut()).toEqual(expectedAction)
    })
    test("action userLoggedIn test", () => {
        // ожидаем выработки конкретно этого action
        const expectedAction = {
            type: authActions.userLoggedIn.type,
            payload: {
                name: "SomeUsername",
                email: "useremail@email.com",
                permissions: "some_permissions"
            }
        }
        expect(authActions.userLoggedIn({
            name: "SomeUsername",
            email: "useremail@email.com",
            permissions: "some_permissions"
        })).toEqual(expectedAction)
    })
})
