import React, {useEffect, useState} from 'react';
import loginStyles from './registration.module.css'
import {Button, HideIcon, Input, ShowIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import {useAuth} from "../../utils/auth";
import {useNavigate} from "react-router-dom";


function Registration() {
    let auth = useAuth()
    const [credentials, setCredentials] = useState({
        name: '',
        email: '',
        password: '',
    });
    const navigate = useNavigate()
    function onChange(e) {
        const {name, value} = e.target;
        setCredentials((prevState) => ({
            ...prevState,
            [name]: value   /* [ name ] - это прием, который позволяет подставить переменную */
        }));
    }

    const [passwordShowed, setPasswordShowed] = React.useState(false)
    const [passwordIconState, setPasswordIconState] = React.useState('HideIcon')
    const [passwordFieldType, setPasswordFieldType] = React.useState('password')
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
                        Регистрация
                    </p>
                    <form onSubmit={(e) => {
                        console.log("submit button pressed")
                        auth.registerUser(credentials).then(x => {
                                alert("resistration successfull!")
                                navigate('/')
                            }
                        ).catch(e => {
                            alert("can not register with provided credentials!")
                            console.log(e)
                        })
                        e.preventDefault();
                    }

                    } className={loginStyles.flexedCenterColumn}>
                        <div className={loginStyles.marginTop20px}>
                            <Input
                                type={'text'}
                                placeholder={'Name'}
                                onChange={e => onChange(e)}
                                value={credentials.name}
                                name={'name'}
                                error={false}
                                errorText={'Ошибка'}
                                size={'default'}
                                extraClass="ml-1"
                            />
                        </div>
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
                                placeholder={'Password'}
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
                            <Button
                                htmlType="submit" type="primary" size="large">
                                Зарегистрироваться
                            </Button>
                        </div>
                    </form>
                    <div className={loginStyles.marginTop80px}>
                        <p className="text text_type_main-default">
                            Уже зарегистрированы? <a href="/login"> Войти </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>

    );
}


export default Registration
;
