import {getCookie} from "./utils";

let NORMA_API = "https://norma.nomoreparties.space/api"

/* we need this function as there may be some cases when we can do some summary basing only on status code (201, 202 etc)
* That's why it is better to parse json in the separate function just like we do with checkReponseStatusCode
*  */
async function parseJsonFromResponse(response) { /* taking Response object */
    const data = await response.json();
    if (data.error) {
        throw new Error("failed to parse json", data.error);
    } else {
        return data
    }
}

function checkReponseStatusCode(response) { /* taking Response object */
    if (response.ok) { /* status codes: 200-299 */
        return response;
    } else {
        console.log("in checkReponseStatusCode, and an Error will be Thrown!")
        throw new Error(`Request failed with status code: ${response.status}`); /* this will be caught in catch of the parent function */
    }
}

async function getIngredients() { /* This returns Ingredients data OR throws an error */
    const response = await fetch(`${NORMA_API}/ingredients`);
    let extractedJson = await parseJsonFromResponse(checkReponseStatusCode(response))
    return extractedJson.data
}


async function postOrder(order) { /* This returns order number OR throws an error */
    const response = await fetch(`${NORMA_API}/orders`, {
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
async function restorePassword(email){
    const response = await fetch(`${NORMA_API}/password-reset`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"email": email})
    })
    return await parseJsonFromResponse(checkReponseStatusCode(response))
}

async function resetPassword(password, token){
    const response = await fetch(`${NORMA_API}/password-reset/reset`,{
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"password": password, "token": token})
    })
    return await parseJsonFromResponse(checkReponseStatusCode(response))
}

async function getUserRequest() {
    // нужно передать запрос только из куков
    const response = await fetch(`${NORMA_API}/auth/user`, {
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
    // возврат
    /*
    {
    "success": true,
    "user": {
        "email": "henzpqzyofer8k63yovu1bskl8fgqckd@test.com",
        "name": "ReactBurgerzUzer"
    }
} */
    let res = await parseJsonFromResponse(checkReponseStatusCode(response))
    return res
}

async function loginRequest(form) {
    /*
    form = {
        "email": "",
        "password": ""
         }
    */
    console.log("in burger-api.loginRequest")
    const response = await fetch(`https://norma.nomoreparties.space/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
    });
    console.log("loginRequest was made")
    /*{
         "success": true,
         "accessToken": "Bearer ...",
         "refreshToken": "",
         "user": {
           "email": "",
           "name": ""
         }
    } */

    return await parseJsonFromResponse(checkReponseStatusCode(response))

}

async function registerRequest(registerRequest) {
    /* form вида = {
        "email": form.email,
        "password": form.password,
        "name": form.name
    }*/
    console.log("in registerRequest")
    console.log(registerRequest)
    const response = await fetch(`${NORMA_API}/auth/register`, {
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
   /* образец ответа
    {
        "success": true,
        "user": {
        "email": "",
            "name": ""
    },
        "accessToken": "Bearer ...",
        "refreshToken": ""
    }*/
    let extractedJson = await parseJsonFromResponse(checkReponseStatusCode(response))
    return extractedJson
}

async function getNewAccessToken(refreshToken) {
    const response = await fetch(`${NORMA_API}/auth/token`, {
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
    /*{
       "success": true,
       "accessToken": "Bearer ...",
        "refreshToken": ""
      } */
    return extractedJson.accessToken
}

async function logout(refreshToken) {
    const response = await fetch(`${NORMA_API}/auth/logout`, {
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
    /*{
       "success": true,
       "accessToken": "Bearer ...",
        "refreshToken": ""
      } */
    return extractedJson
}


async function fetchIngredientById(id) {
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
    });
    /*
    * {
      "success": true,
      "message": "Successful logout"
      }
    * */
    let extractedJson = await parseJsonFromResponse(checkReponseStatusCode(response))
    /*{
       "success": true,
       "accessToken": "Bearer ...",
        "refreshToken": ""
      } */
    return extractedJson
}

async function updateUser(name, email, password){
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

