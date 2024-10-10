import { useEffect, useState } from 'react';
import s from './navbar.module.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';



export const AdminNavbar = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const { i18n } = useTranslation();
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
                        <p>{i18n.language === 'en' ? 'Ad' : 'Реклама'}</p>
                    </div>
                    <div onClick={() => navigate('/applications')} className={`${s.navbar_item} ${isActive('/applications') ? s.active : ''}`}>
                        <p>{i18n.language === 'en' ? 'Applications' : 'Заявка'}</p>
                    </div>
                    <div onClick={() => navigate('/categories')} className={`${s.navbar_item} ${isActive('/categories') ? s.active : ''}`}>
                        <p>{i18n.language === 'en' ? 'Categories' : 'Категории'}</p>
                    </div>
                    <div onClick={() => toggleSubmenu()} className={`${s.navbar_item}`}>
                        <p>{i18n.language === 'en' ? 'Moderation' : 'Модерация'}</p>
                    </div>
                    {isSubmenuVisible && (
                    <div className={`${s.submenu} ${isSubmenuVisible ? s.visible : ''}`}>
                        <div onClick={() => navigate('/events')} className={`${s.navbar_item} ${isActive('/events') ? s.active : ''}`}>
                            <p>{i18n.language === 'en' ? 'Events' : 'Мероприятия'}</p>
                        </div>
                        <div onClick={() => navigate('/manufactures')} className={`${s.navbar_item} ${isActive('/manufactures') ? s.active : ''}`}>
                            <p>{i18n.language === 'en' ? 'Manufactures' : 'Производители'}</p>
                        </div>
                        <div onClick={() => navigate('/costumes')} className={`${s.navbar_item} ${isActive('/costumes') ? s.active : ''}`}>
                            <p>{i18n.language === 'en' ? 'Costumes' : 'Костюмы'}</p>
                        </div>
   
                    </div>
                )}

                        <div className={s.header_language}>
                            <p style={{fontWeight: i18n.language === 'ru' ? 700 : 400}} onClick={() => {
                                    i18n.changeLanguage('ru');  // Передаем строку 'ru'
                                    window.location.reload()
                                    
                                }}>RU</p>
                                <p> / </p>
                                <p style={{fontWeight: i18n.language === 'en' ? 700 : 400}} onClick={() => {
                                    i18n.changeLanguage('en');  // Передаем строку 'en'
                                    window.location.reload()
                                }}>EN</p>
                         </div>

            </div>
        </div>
    );
};

export default AdminNavbar;