import {feedActions, socketFeedReducers} from "../reducers/FeedSlice";

const initialState = {
    feedState: {
        success: false,
        orders: [],
        total: 0,
        totalToday: 0,
    },
    socketState: {
        data: null,
        status: "idle",
        error: null
    }
}
describe("feed slice actions tests", () => {
    test("initial state value test", () => {
        expect(socketFeedReducers(undefined, {})).toEqual(initialState)
    })
    test("action message received test", () => {
        // ожидаем создания конкретно этого action из feedActions и сравниваем оригинальный action с expectedAction
        const expectedAction = {
            type: feedActions.messageReceived.type,
            payload: {
                success: false,
                orders: [],
                total: 5,
                totalToday: 5
            }
        }
        expect(feedActions.messageReceived({
            total: 5,
            totalToday: 5,
            orders: [],
            success: false
        })).toEqual(expectedAction)
    })
    test("action connection opened test", () => {
        const expectedAction = {
            type: feedActions.connectionOpened.type,
            payload: undefined
        }
        expect(feedActions.connectionOpened()).toEqual(expectedAction)
    })
    test("action connection closed test", () => {
        // ожидаем выработки конкретно этого action
        const expectedAction = {
            type: feedActions.connectionClosed.type,
            payload: undefined
        }
        expect(feedActions.connectionClosed()).toEqual(expectedAction)
    })
    test("action connection error test", () => {
        // ожидаем выработки конкретно этого action
        const expectedAction = {
            type: feedActions.connectionError.type,
            payload: "some error"
        }
        expect(feedActions.connectionError("some error")).toEqual(expectedAction)
    })
})
