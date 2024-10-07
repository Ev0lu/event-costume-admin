
import { useEffect, useState } from 'react';
import s from './admin-login.module.css'
import { useNavigate } from 'react-router-dom';
import { Authorize } from '../../shared/api';
import { setToken } from '../../App';

export const AdminLogin = () => {
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const navigate = useNavigate()

    useEffect(() => {
        if (password == '') {
            setShowPassword(true)
        } else {
            setTimeout(() => setShowPassword(false), 200)
        }        
    }, [password])

    const sendLoginForm = async () => {
        const data = {
            username: login,
            password: password
        }

        const formBody = new URLSearchParams();
        formBody.append('username', data.username);
        formBody.append('password', data.password);

        const response = await Authorize(formBody)
        if (response.status !== 200) {
            setPassword('')
            setLogin('')
        } else {
            const data = await response.json()
            setToken('access', data.access_token)
            setToken('refresh', data.refresh_token)
            navigate('/')
        }
    }

    return (
        <div className={s.login}>
                <div className={s.login_wrapper}>
                    <div className={s.main_content}>
                        <div className={s.registrationForm_field}>
                            <input value={login}
                            onChange={(e) => setLogin(e.target.value)} className={`${s.registrationForm_field__input}`} placeholder='Имя пользователя'></input>
                        </div>

                        <div className={s.registrationForm_field__password}>
                            <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={showPassword ? 'text' : 'password'}
                            className={`${s.registrationForm_field__input__password}`} placeholder='Пароль'></input>

                        </div>   
                        <div className={s.registrationForm_button_wrapper}>
                                <button onClick={() => {
                                    sendLoginForm()
                        }} className={s.registrationForm_button}>Войти</button>
                        </div> 
                    </div>
                </div>
        </div>
    );
};

