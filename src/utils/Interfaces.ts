import exp from "constants";
import PropTypes from "prop-types";

export interface IIngredient {
    _id: string;
    name: string;
    type: string;
    proteins: number;
    fat: number;
    carbohydrates: number;
    calories: number;
    price: number;
    image: string;
    image_mobile: string;
    image_large: string;
    __v: number;
}

export interface IGetIngredientsResponse {
    data: Array<IIngredient>
    success: boolean
}

export interface IFoodContainer extends Omit<IIngredient, "_id" | "__v" | "price" | "image_large" | "image" | "image_mobile" | "type"> {
    ingredientId: string;
    price?: number; // This is optional, so use "?"
    imgSrc: string;
    imgAlt: string;
}

export interface IIngredientDetailsModal extends Omit<IFoodContainer, "price" | "ingredientId"> {
}

export interface IConstructorState extends IIngredient {
    bun: string
}

interface IOwner {
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

interface IOrder {
    ingredients: IIngredient[];
    _id: string;
    owner: IOwner;
    status: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    number: number;
    price: number;
}

export interface ISubmitAnOrderResponse {
    success: boolean;
    name: string;
    order: IOrder;
}

export interface IOrderFeed {
    ingredients: string[];
    _id: string;
    status: string;
    number: number;
    createdAt: string;
    updatedAt: string;
    name? : string
}

export interface IFeed {
    success: boolean;
    orders: IOrderFeed[];
    total: number;
    totalToday: number;
}

//////////////////////////////AUTH///////////////////////////////

export interface IUserResponse {
    success: boolean;
    user: {
        email: string;
        name: string;
    };
}

export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface IAuthResponse extends IUserResponse {
    accessToken: string;
    refreshToken: string;
}

export interface IUserRegistration extends ILoginCredentials {
    name: string;
}

export interface INewRefreshTokenResponse extends Omit<IAuthResponse, "user"> {
    // Here, ICustomInterface will have all properties of AuthResponse
    // except for the 'user' property.
}

export interface ILogoutResponse {
    success: boolean
    message: string
}

////////////////////////////////////////COMPONENTS/////////////////////////////
export interface IBurgerIngredients {
    setIngredientDragging: (value: boolean) => void;
}
