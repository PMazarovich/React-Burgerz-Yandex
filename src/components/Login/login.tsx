import React, {SyntheticEvent, useEffect, useState} from 'react';
import loginStyles from './login.module.css'
import {Button, Input} from "@ya.praktikum/react-developer-burger-ui-components";
import {useAuth} from "../../utils/auth";
import {useNavigate} from "react-router-dom";
import {ILoginCredentials} from "../../utils/Interfaces";
import {TICons} from "@ya.praktikum/react-developer-burger-ui-components/dist/ui/icons";

function Login() {
    /*const [login, setLogin] = React.useState('')
    const [password, setPassword] = React.useState('')*/
    const [passwordShowed, setPasswordShowed] = React.useState<boolean>(false)
    const [passwordIconState, setPasswordIconState] = React.useState<keyof TICons | undefined>('HideIcon')
    const [passwordFieldType, setPasswordFieldType] = React.useState<"password" | "email" | "text" | undefined>('password')
    const auth = useAuth()
    const navigate = useNavigate()
    const [credentials, setCredentials] = useState<ILoginCredentials>({
        email: '',
        password: '',
    });

    async function signIn(e: SyntheticEvent): Promise<void> {
        try {
            e.preventDefault()
            await auth.signIn(credentials);
            navigate("/")
        } catch (error: any) { // ???
            console.error("Error:", error.message);
        }
    }

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const {name, value} = e.target;
        setCredentials((prevState) => ({
            ...prevState,
            [name]: value   /* [ name ] - это прием, который позволяет подставить переменную */
        }));
    }


    useEffect(() => {
            if (passwordShowed) {
                setPasswordIconState('HideIcon')
                setPasswordFieldType('text')
            } else {
                setPasswordIconState('ShowIcon')
                setPasswordFieldType('password')
            }
        }
        , [passwordShowed])

    return (
        <div className={loginStyles.gridWrapper}>

            <div className={loginStyles.centralBox}>
                <div className={loginStyles.flexedCenterColumn}>
                    <p className="text text_type_main-large">
                        Вход
                    </p>
                    <form onSubmit={signIn} className={loginStyles.flexedCenterColumn}>
                        <div className={loginStyles.marginTop20px}>
                            <Input
                                type={'email'}
                                placeholder={'E-mail'}
                                onChange={e => onChange(e)}
                                value={credentials.email}
                                name={'email'}
                                error={false}
                                errorText={'Ошибка'}
                                size={'default'}
                                extraClass="ml-1"
                            />
                        </div>
                        <div className={loginStyles.marginTop20px}>
                            <Input
                                type={passwordFieldType}
                                placeholder={'Пароль'}
                                onChange={e => onChange(e)}
                                icon={passwordIconState}
                                value={credentials.password}
                                name={'password'}
                                error={false}
                                hidden={passwordShowed}
                                onIconClick={() => {
                                    if (passwordShowed) {
                                        setPasswordShowed(false)
                                    } else {
                                        setPasswordShowed(true)
                                    }
                                }}
                                errorText={'Ошибка'}
                                size={'default'}
                                extraClass="ml-1"
                            />
                        </div>
                        <div className={loginStyles.marginTop20px}>
                            <Button htmlType="submit" type="primary" size="large">
                                Войти
                            </Button>
                        </div>
                    </form>
                    <div className={loginStyles.marginTop80px}>
                        <p className="text text_type_main-default">
                            Вы - новый пользователь? <a href="/register"> Зарегистрироваться </a>
                        </p>
                    </div>
                    <div className={loginStyles.marginTop20px}>
                        <p className="text text_type_main-default">
                            Забыли пароль? <a href="/forgot-password"> Восстановить </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>

    );
}


export default Login;
