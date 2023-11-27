import React, {useEffect} from 'react';
import profileStyles from './profile.module.css';
import {Button, Input} from "@ya.praktikum/react-developer-burger-ui-components";
import {updateUser} from "../../utils/burger-api";
import {authActions} from "../../store/reducers/AuthSlice";
import {TICons} from "@ya.praktikum/react-developer-burger-ui-components/dist/ui/icons";
import {useAppDispatch, useAppSelector} from "../../utils/hooks";

function Profile() {
    const {namee, emaill} = useAppSelector((state) => ({
        namee: state.authState.name,
        emaill: state.authState.email
    }));
    const dispatch = useAppDispatch()
    const [showCommitButtons, setShowCommitButtons] = React.useState<boolean>(false)
    const [name, setName] = React.useState(namee)
    const [password, setPassword] = React.useState<string>('')
    const [email, setEmail] = React.useState<string>(emaill)
    const [passwordShowed, setPasswordShowed] = React.useState<boolean>(false)
    const [passwordIconState, setPasswordIconState] = React.useState<keyof TICons | undefined>('HideIcon')
    const [passwordFieldType, setPasswordFieldType] = React.useState<"password" | "email" | "text" | undefined>('password')
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

    // this makes no sense as we already have everything we need in redux or in localstorage/cookies
    useEffect(() => {
            if (passwordShowed) {
                setPasswordIconState('HideIcon')
                setPasswordFieldType('text')
            } else {
                setPasswordIconState('ShowIcon')
                setPasswordFieldType('password')
            }
        }
        , [])

    useEffect(() => {
        if ((name !== namee) || (email !== emaill) || password !== '') {
            setShowCommitButtons(true)
        } else {
            setShowCommitButtons(false)
        }

    }, [name, email, password])

    function resetChanges() {
        setPassword('')
        setEmail(emaill)
        setName(namee)
    }

    function updateUserr() {
        updateUser(name, email, password).then((resp) => {
            console.log(resp)
            dispatch(authActions.userLoggedIn({
                name: resp.user.name,
                email: resp.user.email,
                userLoggedIn: true,
            }))
        }).catch(err => console.error(err))
    }

    return (
        <div className={`${profileStyles.inputBoxColumns} ${profileStyles.flexedCenterContainer}`}>
            <Input
                type={'text'}
                placeholder={'Name'}
                onChange={e => setName(e.target.value)}
                value={name}
                error={false}
                errorText={'Ошибка'}
                size={'default'}
                extraClass="ml-1"
            />
            <div className={profileStyles.marginTop20px}>
                <Input
                    type={'email'}
                    placeholder={'Login'}
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    error={false}
                    errorText={'Ошибка'}
                    size={'default'}
                    extraClass="ml-1"
                />
            </div>
            <div className={profileStyles.marginTop20px}>
                <Input
                    type={passwordFieldType}
                    placeholder={'Password'}
                    onChange={e => setPassword(e.target.value)}
                    icon={passwordIconState}
                    value={password}
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
            {showCommitButtons && <div className={profileStyles.buttonFlexedRow}>
                <Button htmlType="button" type="primary" size="small" extraClass="ml-2" onClick={updateUserr}>
                    Сохранить
                </Button>
                <Button htmlType="button" type="primary" size="small" extraClass="ml-2" onClick={resetChanges}>
                    Отмена
                </Button>

            </div>}
        </div>
    )
        ;
}


export default Profile;
