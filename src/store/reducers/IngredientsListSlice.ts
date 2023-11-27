import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IIngredient} from "../../utils/Interfaces";
import {getIngredientsAPI} from "../../utils/burger-api";
import {RejectedAction} from "@reduxjs/toolkit/dist/query/core/buildThunks";


interface IIngredientsState {
    ingredients: Array<IIngredient>;
    ingredientsFetching: boolean;
    error: string
}

const initialState: IIngredientsState = {
    ingredients: Array<IIngredient>(),
    ingredientsFetching: true,
    error: ''
}



export const ingredientsSlice = createSlice(
    {
        name: 'ingredients',             //ключ, который станет префиксом всех экшенов. Например: type: 'counter/increment');
        initialState: initialState,
        reducers: {             // Это типа switch case. Тут все reducerы
            ingredientsFetching(state) {
                state.ingredientsFetching = true
            },
            ingredientsFetchingSuccess(state, action: PayloadAction<Array<IIngredient>>) { // action ЭТО ОБЪЕКТ {type: blalbalba, payload: {ingredients: asdfasdf, something: XCVxcvxcv}}
                state.ingredientsFetching = false
                state.error = ''
                state.ingredients = action.payload
            },
            ingredientsFetchingFailure(state, action: PayloadAction<string>) {
                state.ingredientsFetching = false
                state.error = action.payload
            }
        },
        extraReducers: (builder) => {
            /* смотрим на состояние промиса, который был создан здесь getIngredients (строка 58) и в соответствии с этим заполняем стейт */
            builder
                .addCase(getIngredients.pending, (state) => {
                    state.ingredientsFetching = true;
                })
                .addCase(getIngredients.fulfilled, (state, action) => {
                    state.ingredientsFetching = false;
                    state.error = '';
                    state.ingredients = action.payload;
                })
                .addCase(getIngredients.rejected, (state, action) => {
                    state.ingredientsFetching = false;
                    state.error = action.error.message!;
                });
        }
    }) // отсюда можно вытащить actions и reducers и еще много чего


export const getIngredients = createAsyncThunk(
    "ingredients/get",
    async () => {
        const data = await getIngredientsAPI();
        return data;
    }
);




/* ВАРИАНТ БЕЗ EXTRA REDUCERS */
/*// создаёт экшены, генераторы экшенов и редьюсеры.
export const ingredientsSlice = createSlice(
    {
        name: 'ingredients',             //ключ, который станет префиксом всех экшенов. Например: type: 'counter/increment');
        initialState: initialState,
        reducers: {             // Это типа switch case. Тут все reducerы
            ingredientsFetching(state: IIngredientsState) {
                state.ingredientsFetching = true
            },
            ingredientsFetchingSuccess(state: IIngredientsState, action: PayloadAction<Array<IIngredient>>) { // action ЭТО ОБЪЕКТ {type: blalbalba, payload: {ingredients: asdfasdf, something: XCVxcvxcv}}
                state.ingredientsFetching = false
                state.error = ''
                state.ingredients = action.payload
            },
            ingredientsFetchingFailure(state: IIngredientsState, action: PayloadAction<string>) {
                state.ingredientsFetching = false
                state.error = action.payload
            }
        },
    }) // отсюда можно вытащить actions и reducers и еще много чего


export const getIngredients = createAsyncThunk(
    "ingredients/get",
    // аргумент            // thunkAPI имеет getState и dispatch
    async (_,thunkAPI) => {
        thunkAPI.dispatch(ingredientsActions.ingredientsFetching())
        getIngredientsAPI().then(data => {
            thunkAPI.dispatch(ingredientsActions.ingredientsFetchingSuccess(data))
        }).catch(e => {
            thunkAPI.dispatch(ingredientsActions.ingredientsFetchingFailure(e))
        })
    }
)*/

export const ingredientsReducers = ingredientsSlice.reducer
export const ingredientsActions = ingredientsSlice.actions

