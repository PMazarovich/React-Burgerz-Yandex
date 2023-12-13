import fetchMock from "fetch-mock";
import configureMockStore from 'redux-mock-store';
import thunk from "redux-thunk";
import {getIngredients, ingredientsReducers} from "../reducers/IngredientsListSlice";
import {NORMA_API} from "../../utils/burger-api";

const middleware = [thunk]
const mockStore = configureMockStore(middleware)

const initialState = {
    ingredients: [],
    ingredientsFetching: true,
    error: '',
}

describe("ingredients list action tests", () => {
    test("initial state value test", () => {
        // сравниваем начальное состояние стора из ingredientsReducers и объекта, который был создан в тесте
        expect(ingredientsReducers(undefined, {})).toEqual(initialState)
    })
    test("successful case actions test", async () => {
        // подделаем ответ сервера
        const mockServerResponseBody = {"data": "some server response, we are not interested in it"}
        // fetchMock перехватывает запросы по url и возвращает подделку
        fetchMock.mock(`https://norma.nomoreparties.space/api/ingredients`, {
            body: mockServerResponseBody,
            headers: {"content-type": "application/json"},
            status: 200
        })
        const store = mockStore()
        const expectedActions = [
            {
                type: getIngredients.pending.type,
            },
            {
                type: getIngredients.fulfilled.type,
                payload: "some server response, we are not interested in it"
            }
        ]
        // начинаем тест: обращаемся к thunk. Обращаемся через поддельный стор
        const response = await store.dispatch(getIngredients())
        //console.log(response)
        if (!response) {
            return false;
        }
        const actionsList = store.getActions().map(action => ({
            type: action.type,
            payload: action.payload
        }));
        expect(actionsList).toEqual(expectedActions)
        //expect(response.payload).toEqual({"someServerResponse": "some server response, we are not interested in it"});
    })
    test("failed case actions test", async () => {
        fetchMock.mock(`${NORMA_API}/ingredients`, {
            throws: new Error('can not fetch ingredients')
        }, {overwriteRoutes: true});
        const store = mockStore()
        const expectedActions = [
            {
                type: getIngredients.pending.type
            },
            {
                type: getIngredients.rejected.type,
            }
        ]
        const response = await store.dispatch(getIngredients())
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
