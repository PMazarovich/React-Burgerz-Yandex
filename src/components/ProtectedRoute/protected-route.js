
// Этот компонент будет проверять аутентифицированность пользователя для каждого защищенного маршрута в приложении
import {useEffect, useState} from "react";
import {useAuth} from "../../utils/auth";
import {Navigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {authActions} from "../../store/reducers/AuthSlice";

export function ProtectedRouteElement({ children }) {
    // Вернём из хранилища запрос на получение данных о пользователе и текущий объект с пользователем
    let auth = useAuth();
    const [isUserLoaded, setUserLoaded] = useState(false);
    const userLoggedIn = useSelector((store) => store.authState.userLoggedIn);
    // getUser всего лишь пытается получить пользователя (логин/email/его права/что угодно).
    // getUser вызывается 1 раз за время жизни приложения (в самом начале при попытке входа на любой "защищенный" маршрут).
    const dispatch = useDispatch();

    useEffect(() => {
        async function checkUserAuth() {
            try {
                const creds = await auth.getUser();
                console.log(creds)
                dispatch(authActions.userLoggedIn({email: creds.user.email, name: creds.user.name, permissions: null, userLoggedIn: true }));
                setUserLoaded(true);
            } catch (error) {
                setUserLoaded(true);
            }
        }
        if (!userLoggedIn) {
            checkUserAuth();
        } else {
            setUserLoaded(true);
        }
    }, []);


    if (!isUserLoaded) { // Show loading or some placeholder if user info is still being fetched
        return <div>Loading...</div>;
    }

    if (userLoggedIn) {
        // Если user есть, возвращаем элемент, который был в аргументах ProtectedRoute
        return children;
    } else { // Если user нет, то перенаправляем его обратно на login
        return <Navigate to="/login" replace />;
    }
}
