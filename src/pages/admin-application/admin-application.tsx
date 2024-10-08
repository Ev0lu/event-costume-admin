import { useEffect, useState } from 'react';
import AdminNavbar from '../../shared/navbar/navbar';
import s from './admin-application.module.css'
import { deleteManufacturerApplication, getCategories, getManufacturerById, getManufacturers, patchManufacturerApplication } from '../../shared/api';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { getToken } from '../../App';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const AdminApplications = () => {
    
    
    const settings = {
        dots: true, // Показать индикаторы
        infinite: true, // Бесконечная прокрутка
        speed: 500, // Скорость анимации
        slidesToShow: 3, // Показывать по 3 изображения
        slidesToScroll: 1, // Прокручивать по одному
        centerMode: true, // Центрирование текущего слайда
        variableWidth: true, // Адаптация ширины изображений

    };
    const [categories, setCategories] = useState<Category[]>([]);
    const [manufacturers, setManufacturers] = useState<any[]>([]);
    const { i18n } = useTranslation();
    const [category, setCategory] = useState<Category | null>(null); // Выбранная категория
    const [offset, ] = useState(0);

    useEffect(() => {
        getAllCategories()
        if (i18n.language === 'ru-RU' || i18n.language === 'ru-EN') {
            i18n.changeLanguage('ru')
        }
    }, [])
    // Функция для получения всех категорий
    const getAllCategories = async () => {

        const response = await getCategories(i18n.language === 'en' ? 'en' : 'ru');
        const data = await response.json();
        const formattedCategories = data.categories.map((category: any) => ({
            label: i18n.language === 'en' ? category.name_en : category.name_ru,
            value: category.category_id,
        }));
        setCategories(formattedCategories);

        // Устанавливаем первую категорию по умолчанию
        if (formattedCategories.length > 0) {
            setCategory(formattedCategories[0]); // Выбираем первую категорию
        }
    };

    // Функция для получения всех производителей
    const getAllManufacturers = async (categoryId: string) => {
        const token = getToken('access')
        const status = 'pending'
        const response = await getManufacturers(token, categoryId, i18n.language, offset, status);
        const data = await response.json();
        const manufacturersWithDetails = await Promise.all(
            data.manufacturers.map(async (manufacturer: any) => {
                // Выполняем запрос для получения дополнительных данных по каждому производителю
                const manufacturerResponse = await getManufacturerById(token, manufacturer.manufacturer_id, i18n.language === 'en' ? 'en' : 'ru');
                const manufacturerData = await manufacturerResponse.json();
                
                // Возвращаем обновлённые данные по производителю
                return {
                    ...manufacturer, // Данные производителя из начального списка
                    ...manufacturerData // Данные производителя из детального запроса
                };
            })
        );
    
        // Обновляем состояние с новыми производителями
        setManufacturers(manufacturersWithDetails);
        console.log(manufacturersWithDetails);
    };

    // Обработчик изменения выбора категории
    const handleSelectChange = (selectedOption: Category | null) => {
        if (selectedOption) {
            setCategory(selectedOption); // Устанавливаем выбранную категорию
            localStorage.setItem('nameManufactory', selectedOption.label);
            getAllManufacturers(selectedOption.value);
        }
    };

    useEffect(() => {
        getAllCategories();
    }, []);

    useEffect(() => {
        // При изменении категории загружаем производителей для выбранной категории
        if (category) {
            getAllManufacturers(category.value);
        }
    }, [category]);



    const deleteManufacturer = async (id: string) => {
        const token = getToken('access')
        await deleteManufacturerApplication(id, token);
        if (category) {
            await getAllManufacturers(category.value)
        }
    };

    const patchManufacturer = async (id: string) => {
        const token = getToken('access')
        const data = {
            status: 'accepted'
        }
        await patchManufacturerApplication(data, id, token);
        if (category) {
            await getAllManufacturers(category.value)
        }
    };

    return (
        <div className={s.login}>
            <div className={s.login_wrapper}>
                <AdminNavbar />
                <div className={s.main_content}>
                    <div className={s.main_select}>
                        <Select
                            options={categories} // Опции для селекта
                            onChange={handleSelectChange} // Обработчик выбора
                            value={category} // Текущая выбранная категория
                            placeholder={i18n.language === 'en' ? 'Select category...' : 'Выбрать...'}
                        />
                    </div>
 
                        {manufacturers.length > 0 ? (
                                                        <div className={s.manufacturer_list}>

                                                        {manufacturers.map((manufacturer: any) => (
                                                            <div key={manufacturer.manufacturer_id} className={s.manufacturer_item}>
                                                                <div className={s.manufacturer_title}>
                                                                    <img style={{width: '100px', height: '100px', borderRadius: '20px'}} src={manufacturer.logo.url}></img>
                                                                    <h2>{i18n.language === 'en' ? manufacturer.name_en : manufacturer.name_ru}</h2>
                                                                </div>
                                                                <div className={s.manufacturer_description}>
                                                                    <p>{manufacturer.manufacturer_id}</p>
                                                                    <p>{i18n.language === 'en' ? manufacturer.description_en : manufacturer.description_ru}</p>
                                                                    <p>{manufacturer.email}</p>
                                                                </div>

                                                                <div className={s.carouselWrapper}>
                                                                    <Slider {...settings}>
                                                                        {manufacturer.manufacturer.products.map((product: any, index: any) => (
                                                                            <div key={index} className={s.slide}>
                                                                                <img src={product.url} alt={`Slide ${index}`} className={s.image} />
                                                                            </div>
                                                                        ))}
                                                                    </Slider>
                                                                </div>
                                                                <div className={s.buttons_wrapper}>
                                                                    <button onClick={() => {
                                                                        deleteManufacturer(manufacturer.manufacturer_id)
                                                                    }}>{i18n.language === 'en' ? 'Refuse' : 'Отказаться'}</button>
                                                                    <button onClick={() => {
                                                                        patchManufacturer(manufacturer.manufacturer_id)
                                                                    }}>{i18n.language === 'en' ? 'Add' : 'Добавить'}</button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
    
                        ) : (
                            <p style={{marginTop: '20px'}}>{i18n.language === 'en' ? 'No applications found' : 'Заявки не найдены'}</p>
                        )}
                </div>
            </div>
        </div>
    );
};

interface Category {
    label: string;
    value: string;
}
