import {getNewAccessToken, getUserRequest, loginRequest, logout, registerRequest} from "./burger-api";
import {authActions} from "../store/reducers/AuthSlice";
import {deleteCookie, extractBearerToken, getCookie, setCookie} from "./utils";
import {IAuthResponse, ILoginCredentials, IUserRegistration} from "./Interfaces";
import {useAppDispatch} from "./hooks";

// login ReactBurgerzUzer
// email HeNZPQZyofer8K63YovU1BsKl8fGqCkd@test.com
// password HeNZPQZyofer8K63YovU1BsKl8fGqCkd


// В этом файле описаны все методы для аутентификации пользователя
// Напишем хук, который будет заниматься аутентификацией

export function useAuth() {
    const dispatch = useAppDispatch()

    function saveAuthInfo(type: string, message: IAuthResponse) {
        if (message.success) {
            // Сохраним accessToken в куки и сделаем протухание через 20 минут
            setCookie('accessToken', extractBearerToken(message.accessToken), {expires: 6000}); // 10 минут
            // Поместим в хранилище браузера refreshToken
            setCookie('refreshToken', message.refreshToken, {expires: 60000})
            // Сохраним в redux созданного пользователя.
            dispatch(authActions.userLoggedIn({
                    name: message.user.name,
                    email: message.user.email,
                    userLoggedIn: true,
                }
            ))
        } else {
            alert(`an error occured during ${type}, see console`)
            console.log(message)
        }
    }

    async function signIn(signInMessage: ILoginCredentials) {
        // api call to /login
        try {
            const data = await loginRequest(signInMessage); // Execution will pause here until the promise is resolved
            saveAuthInfo("login", data);
        } catch (e) {
            alert("A signIn error occurred, see console for details");
            throw e;
        }
    }

    async function registerUser(registerMessage: IUserRegistration): Promise<void> {
        // посылаем api запрос на регистрацию
        registerRequest(registerMessage).then((resp: IAuthResponse) => {
            //resp.password = registerMessage.password
            saveAuthInfo("registration", resp)
        }).catch(e => {
            alert("an error occured during registration, see console")
            console.log(e)
        })
    }


    async function getUser() {
        // тут происходит запрос на сервер headerом Authorization: 'Bearer ' + getCookie('token').
        // Проверим, есть ли токен в куках. Если он есть, делаем запрос, если его нет, пытаемся получить новый токен по RefreshToken
        let token = getCookie('accessToken')
        if (token === undefined) {
            // Проверим, есть ли refreshToken в cookie
            let refreshToken = getCookie('refreshToken')
            if (refreshToken !== undefined && refreshToken !== null && refreshToken !== "undefined") {
                // если refreshToken есть, пытаемся получить новый access token
                let newAccessToken = await getNewAccessToken(refreshToken)
                setCookie('accessToken', extractBearerToken(newAccessToken), {"expires": 6000})
                await getUser()
            }
            // если refreshToken отсутствует, выкинем ошибку (которая будет поймана в protectedRoute и потом перенаправление на login)
            else {
                throw new Error('Refresh token is empty, you need to re-login')
            }
        } else {
            // Если access token есть, прикрепляем его к запросу и получаем информацию о пользователе
            return await getUserRequest()
            //setCookie('refreshToken', parsedJson.refreshToken, {expires: 6000})
        }
    }

    async function signOut() {
        try {
            let token: string | undefined = getCookie('refreshToken')
            if (token) {
                await logout(token);
                // Удаляем пользователя из cookie
                deleteCookie('refreshToken');
                // Удаляем пользователя из redux
                dispatch(authActions.userLoggedOut())
                // Удаляем куку token
                deleteCookie('accessToken');
            }
        } catch (e) {
            throw e
        }
    }

    function getAccessToken(): string | undefined{
        return getCookie('accessToken')
    }


    return {
        registerUser,
        getUser,
        signIn,
        signOut,
        getAccessToken,
    }

}
