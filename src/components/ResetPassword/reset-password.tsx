import React, {useEffect} from 'react';
import resetPassStyles from './reset-password.module.css'
import {Button, Input} from "@ya.praktikum/react-developer-burger-ui-components";
import {resetPassword} from "../../utils/burger-api";
import {TICons} from "@ya.praktikum/react-developer-burger-ui-components/dist/ui/icons";

function ResetPassword() {
    const [token, setToken] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [passwordShowed, setPasswordShowed] = React.useState(false)
    const [passwordIconState, setPasswordIconState] = React.useState<keyof TICons | undefined>('HideIcon')
    const [passwordFieldType, setPasswordFieldType] = React.useState< "password" | "text" | "email" | undefined>('password')
    function resetPass(){
        resetPassword(password, token).then(()=>console.log("password reset successful")).catch(e => {
            console.log(e)
        })
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
        <div className={resetPassStyles.gridWrapper}>

            <div className={resetPassStyles.centralBox}>
                <div className={resetPassStyles.flexedCenterColumn}>
                    <p className="text text_type_main-large">
                        Восстановление пароля
                    </p>
                    <div className={resetPassStyles.marginTop20px}>
                        <Input
                            type={'text'}
                            placeholder={'Code from e-mail'}
                            onChange={e => setToken(e.target.value)}
                            value={token}
                            name={'name'}
                            error={false}
                            errorText={'Ошибка'}
                            size={'default'}
                            extraClass="ml-1"
                        />
                    </div>
                    <div className={resetPassStyles.marginTop20px}>
                        <Input
                            type={passwordFieldType}
                            placeholder={'New password'}
                            onChange={e => setPassword(e.target.value)}
                            icon={passwordIconState}
                            value={password}
                            name={'name'}
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
                    <div className={resetPassStyles.marginTop20px}>
                        <Button onClick={resetPass} htmlType="button" type="primary" size="large">
                            Войти
                        </Button>
                    </div>
                </div>
            </div>
        </div>

    );
}


export default ResetPassword;
