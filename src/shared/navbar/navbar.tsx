import { useEffect, useState } from 'react';
import s from './navbar.module.css'
import { useLocation, useNavigate } from 'react-router-dom'

export const AdminNavbar = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
    const [isSubmenuVisible, setSubmenuVisible] = useState(false);
    const toggleSubmenu = () => {
        setSubmenuVisible(!isSubmenuVisible);
        localStorage.setItem('isVisible', isSubmenuVisible.toString())
    };
    useEffect(() => {
        if (!localStorage.getItem('isVisible')) {
            localStorage.setItem('isVisible', 'false')
        }
        setSubmenuVisible(localStorage.getItem('isVisible') === 'false')
    }, [])
    return (
        <div className={s.admin_navbar}>
                <div className={s.admin_navbar_wrapper}>
                    <div onClick={() => navigate('/')} className={`${s.navbar_item} ${isActive('/') ? s.active : ''}`}>
                        <p>Реклама</p>
                    </div>
                    <div onClick={() => navigate('/applications')} className={`${s.navbar_item} ${isActive('/applications') ? s.active : ''}`}>
                        <p>Заявки</p>
                    </div>
                    <div onClick={() => toggleSubmenu()} className={`${s.navbar_item}`}>
                        <p>Модерация</p>
                    </div>
                    {isSubmenuVisible && (
                    <div className={`${s.submenu} ${isSubmenuVisible ? s.visible : ''}`}>
                        <div onClick={() => navigate('/events')} className={`${s.navbar_item} ${isActive('/events') ? s.active : ''}`}>
                            <p>Мероприятия</p>
                        </div>
                        <div onClick={() => navigate('/manufactures')} className={`${s.navbar_item} ${isActive('/manufactures') ? s.active : ''}`}>
                            <p>Производители</p>
                        </div>
                        <div onClick={() => navigate('/costumes')} className={`${s.navbar_item} ${isActive('/costumes') ? s.active : ''}`}>
                            <p>Костюмы</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminNavbar;