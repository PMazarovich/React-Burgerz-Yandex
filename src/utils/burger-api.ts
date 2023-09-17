import {getCookie} from "./utils";
import {
    IAuthResponse,
    IIngredient,
    ILoginCredentials, ILogoutResponse,
    INewRefreshTokenResponse,
    IOrder,
    IUserRegistration,
    IUserResponse
} from "./Interfaces";

let NORMA_API = "https://norma.nomoreparties.space/api"

/* we need this function as there may be some cases when we can do some summary basing only on status code (201, 202 etc)
* That's why it is better to parse json in the separate function just like we do with checkReponseStatusCode
*  */
// todo here it can be any type of all response types. fill this later
async function parseJsonFromResponse(response: Response): Promise<any> {  // todo return type!
    const data: any = await response.json();
    if (data.error) {
        throw new Error("failed to parse json", data.error);
    } else {
        return data
    }
}
function checkReponseStatusCode(response: Response): Response {
    if (response.ok) { /* status codes: 200-299 */
        return response;
    } else {
        console.log("in checkReponseStatusCode, and an Error will be Thrown!")
        throw new Error(`Request failed with status code: ${response.status}`); /* this will be caught in catch of the parent function */
    }
}

async function getIngredients(): Promise<Array<IIngredient>> {
    const response: Response = await fetch(`${NORMA_API}/ingredients`);
    const extractedJson = await parseJsonFromResponse(checkReponseStatusCode(response))
    return extractedJson.data
}


async function postOrder(order: IOrder): Promise<number> { /* This returns order number OR throws an error */
    const response: Response = await fetch(`${NORMA_API}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + getCookie('accessToken')
        },
        body: JSON.stringify({"ingredients": order})
    });
    // noinspection UnnecessaryLocalVariableJS
    let extractedJson = await parseJsonFromResponse(checkReponseStatusCode(response))
    return extractedJson
}


/////////////////////////////////////AUTH///////////////////////////////////////
async function restorePassword(email: string): Promise<void>{
    const response: Response = await fetch(`${NORMA_API}/password-reset`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"email": email})
    })
    checkReponseStatusCode(response)
}

async function resetPassword(password: string, token: string): Promise<void>{
    const response: Response = await fetch(`${NORMA_API}/password-reset/reset`,{
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"password": password, "token": token})
    })
    checkReponseStatusCode(response)
}

async function getUserRequest(): Promise<IUserResponse> {
    // нужно передать запрос только из куков
    const response: Response = await fetch(`${NORMA_API}/auth/user`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
                   // Отправляем токен и схему авторизации в заголовке при запросе данных
            Authorization: 'Bearer ' + getCookie('accessToken')
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
    })
    let res = await parseJsonFromResponse(checkReponseStatusCode(response))
    return res
}

async function loginRequest(creds: ILoginCredentials): Promise<IAuthResponse> {
    console.log("in burger-api.loginRequest")
    const response = await fetch(`https://norma.nomoreparties.space/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(creds)
    });
    console.log("loginRequest was made")
    return await parseJsonFromResponse(checkReponseStatusCode(response))

}

async function registerRequest(registerRequest: IUserRegistration): Promise<IAuthResponse> {
    console.log("in registerRequest")
    console.log(registerRequest)
    const response: Response = await fetch(`${NORMA_API}/auth/register`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(registerRequest)
    });
    let extractedJson = await parseJsonFromResponse(checkReponseStatusCode(response))
    return extractedJson
}

async function getNewAccessToken(refreshToken: string): Promise<INewRefreshTokenResponse> {
    const response: Response = await fetch(`${NORMA_API}/auth/token`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({"token": refreshToken})
    });
    let extractedJson = await parseJsonFromResponse(checkReponseStatusCode(response))
    return extractedJson.accessToken
}

async function logout(refreshToken: string): Promise<ILogoutResponse> {
    const response: Response = await fetch(`${NORMA_API}/auth/logout`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({"token": refreshToken})
    });
    /*
    * {
      "success": true,
      "message": "Successful logout"
      }
    * */
    let extractedJson = await parseJsonFromResponse(checkReponseStatusCode(response))
    return extractedJson
}


async function fetchIngredientById(id: string): Promise<IIngredient> {
    const response = await fetch(`${NORMA_API}/ingredients/${id}`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookie('accessToken')
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    })
    let extractedJson = await parseJsonFromResponse(checkReponseStatusCode(response))
    return extractedJson
}

async function updateUser(name: string, email: string, password: string){ // todo check what will be returned
    const response = await fetch(`${NORMA_API}/auth/user`, {
        method: 'PATCH',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookie('accessToken')
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
            "email": email,
            "password": password,
            "name": name
        } )
    });
    let extractedJson = await parseJsonFromResponse(checkReponseStatusCode(response))
    return extractedJson
}


export {
    postOrder, getIngredients, restorePassword, resetPassword, getUserRequest,
    loginRequest, parseJsonFromResponse, checkReponseStatusCode, registerRequest,
    getNewAccessToken, logout, updateUser
}

