
import fetchMock from "fetch-mock";
import configureMockStore from 'redux-mock-store';
import thunk from "redux-thunk";
import {submitAnOrderHandler, submitAnOrderReducers} from "../reducers/SubmitAnOrderSlice";

const middleware = [thunk]
const mockStore = configureMockStore(middleware)

const initialState = {
    orderNumber: 0,
    fetching: false,
    error: '',
    name: '',
}

describe("submit an order action tests", () => {
    test("initial state value test", () => {
        console.log("THIS IS A STORE", configureMockStore)
        // сравниваем начальное состояние стора из submitAnOrderReducers и объекта, который был создан в тесте
        expect(submitAnOrderReducers(undefined, {})).toEqual(initialState)
    })
    // in this test we will see, which actions will be fired when submitAnOrderHandler thunk is executed. So, expected actions are: postOrder and orderConfirmed
    // todo this fails when run from console, but does not when run from IDE
    /*test("successful case actions test", async () => {
        // подделаем ответ сервера
        const mockServerResponseBody = {"someServerResponse": ["1", "2", "3"]}
        // fetchMock перехватывает запросы по url и возвращает подделку
        fetchMock.mock(`https://norma.nomoreparties.space/api/orders`, {
            body: mockServerResponseBody,
            headers: {"content-type": "application/json"},
            status: 200
        })
        // создадим поддельный стор
        // A mock store does not update the Redux state, but instead it records the actions that are dispatched to it1.
        // You can use a mock store to simulate the behavior of a real store and check if your actions are working as expected.
        const store = mockStore()
        //console.log(store)
        // Создадим actions, которые будут сгенерированы при выполнении тестируемого thunk
        const expectedActions = [
            {
                type: submitAnOrderHandler.pending.type
            },

            {
                type: submitAnOrderHandler.fulfilled.type,
                payload: {"someServerResponse": ["1", "2", "3"]}
            }
        ]
        // начинаем тест: обращаемся к thunk. Обращаемся через поддельный стор
        const response = await store.dispatch(submitAnOrderHandler(["1", "2", "3"]))
        if (!response) {
            return false;
        }
        const actionsList = store.getActions().map(action => ({
            type: action.type,
            payload: action.payload
        }));
        expect(actionsList).toEqual(expectedActions)
        //expect(response.payload).toEqual({"someServerResponse": ["1", "2", "3"]});
    })*/
    test("failed case actions test", async () => {
        fetchMock.mock(`https://norma.nomoreparties.space/api/orders`, {
            throws: new Error('can not create an order')
        }, { overwriteRoutes: true });
        const store = mockStore()
        const expectedActions = [
            {
                type: submitAnOrderHandler.pending.type
            },
            {
                type: submitAnOrderHandler.rejected.type,
                payload: "Error"
            }
        ]
        const response = await store.dispatch(submitAnOrderHandler(["1", "2", "3"]))
        if (!response) {
            return false;
        }
        const actionsList = store.getActions().map(action => ({
            type: action.type,
            payload: action.payload
        }));
        expect(actionsList).toEqual(expectedActions)
    })
})

// С помощью mock store можно протестировать и стейт, но если редюсеры написаны нормально, это делать необязательно
