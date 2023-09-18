import React, {useEffect} from 'react';
import restorePassStyles from './restore-password.module.css'
import {Button, HideIcon, Input, ShowIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import {restorePassword} from "../../utils/burger-api";
import {useNavigate} from "react-router-dom";

function ForgotPassword() {
    const [email, setEmail] = React.useState<string>('')
    const navigate = useNavigate()
    async function restore(){
        restorePassword(email).then(() => {
            navigate('/reset-password')}).catch(e =>{
            alert("error, check console")
            console.log(e)
        })
    }
    return (
        <div className={restorePassStyles.gridWrapper}>
            <div className={restorePassStyles.centralBox}>
                <div className={restorePassStyles.flexedCenterColumn}>
                    <p className="text text_type_main-large">
                        Введите email
                    </p>
                    <div className={restorePassStyles.marginTop20px}>
                        <Input
                            type={'email'}
                            placeholder={'E-mail'}
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                            error={false}
                            errorText={'Ошибка'}
                            size={'default'}
                            extraClass="ml-1"
                        />
                    </div>
                    <div className={restorePassStyles.marginTop20px}>
                        <Button onClick={restore} htmlType="button" type="primary" size="large">
                            Восстановить пароль
                        </Button>
                    </div>
                </div>
            </div>
        </div>

    );
}


export default ForgotPassword;
