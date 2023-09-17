export interface IIngredient{
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

export interface IOrder {
    ids: Array<string>
}

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

export interface IAuthResponse extends IUserResponse{
    accessToken: string;
    refreshToken: string;
}
export interface IUserRegistration extends ILoginCredentials{
    name: string;
}

export interface INewRefreshTokenResponse extends Omit<IAuthResponse, "user"> {
    // Here, ICustomInterface will have all properties of AuthResponse
    // except for the 'user' property.
}

export interface ILogoutResponse{
    success: boolean
    message: string
}
