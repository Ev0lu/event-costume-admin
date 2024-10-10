import { useEffect, useState } from 'react';
import AdminNavbar from '../../shared/navbar/navbar';
import s from './categories.module.css';
import { createCategory, getCategories, patchCategory } from '../../shared/api';
import { useTranslation } from 'react-i18next';
import { getToken } from '../../App';

export const Categories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const { i18n } = useTranslation();


    interface CategoryDetails {
        category_image: File | null;
        // другие поля...
        category_id: string, // ID категории, если она уже существует
        name_ru: string, // Название категории на русском
        name_en: string, // Название категории на английском

      }
    const [categoryDetails, setCategoryDetails] = useState<CategoryDetails>({
        category_id: '', // ID категории, если она уже существует
        category_image: null, // Изображение категории (файл)
        name_ru: '', // Название категории на русском
        name_en: '', // Название категории на английском
    });

    const getAllCategories = async () => {
        const response = await getCategories(i18n.language === 'en' ? 'en' : 'ru');
        const data = await response.json();
        setCategories(data.categories);

        console.log(data.categories)
    };

    useEffect(() => {
        getAllCategories();
    }, []);


    const handleSaveCategory = async (categoryDetails: any) => {
        const token = getToken('access')
        const formData = new FormData();
        
        // Добавляем данные в formData
        
        if (categoryDetails.category_image) {
          formData.append('category_image', categoryDetails.category_image);
        }
        
        if (categoryDetails.name_ru) {
            formData.append('name_ru', categoryDetails.name_ru);
        }

        if (categoryDetails.name_en) {
            formData.append('name_en', categoryDetails.name_en);
        }
      
        
          // Если есть category_id, то это обновление, иначе создание новой категории
          if (categoryDetails.category_id) {
            await patchCategory(formData, categoryDetails.category_id, token)
            getAllCategories();
          } else {
            await createCategory(formData, token)
            getAllCategories();
          }
      
          // Проверка успешного запроса
        
      };
      

    return (
        <div className={s.login}>
            <div className={s.login_wrapper}>
                <AdminNavbar />
                <div className={s.main_content}>
                <form
                        className={s.category_details}
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSaveCategory(categoryDetails); // Функция для сохранения
                        }}
                        >
                        <h2 style={{ fontSize: '14px' }}>
                            {i18n.language === 'en' ? 'Create/Update Category' : 'Создание/Изменение категории'}
                        </h2>

                        {/* Поле для category_id */}
                        <input
                            type="text"
                            value={categoryDetails.category_id}
                            onChange={(e) => setCategoryDetails({ ...categoryDetails, category_id: e.target.value })}
                            placeholder={i18n.language === 'en' ? 'Category ID' : 'Айди категории'}
                        />

                        {/* Поле для загрузки изображения категории */}
                        <div className={s.input_wrapper}>
                            <label>{i18n.language === 'en' ? 'Logo' : 'Логотипы'}</label>
                            <input
                            type="file"
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                setCategoryDetails({ ...categoryDetails, category_image: e.target.files[0] });
                                }
                            }}
                            />
                        </div>




                        {/* Поле для названия категории на русском */}
                        <input
                            type="text"
                            value={categoryDetails.name_ru}
                            onChange={(e) => setCategoryDetails({ ...categoryDetails, name_ru: e.target.value })}
                            placeholder={i18n.language === 'en' ? 'Category Name (RU)' : 'Название категории (RU)'}
                        />

                        {/* Поле для названия категории на английском */}
                        <input
                            type="text"
                            value={categoryDetails.name_en}
                            onChange={(e) => setCategoryDetails({ ...categoryDetails, name_en: e.target.value })}
                            placeholder={i18n.language === 'en' ? 'Category Name (EN)' : 'Название категории (EN)'}
                        />

                        {/* Кнопка для сохранения */}
                        <button className={s.saveButton} type="submit">
                            {i18n.language === 'en' ? 'Save' : 'Сохранить'}
                        </button>
                        </form>
                    <div className={s.manufacturers_list}>
                        <div style={{ marginBottom: '-20px' }} className={s.manufacturers_item}>
                            <h2 style={{ marginRight: '17.4%' }}>{i18n.language === 'en' ? 'Category name' : 'Название категории'}</h2>
                            <p>{i18n.language === 'en' ? 'Category id' : 'Айди категории'}</p>
                        </div>
                        {categories && categories.length > 0 ? (
                            <div className={s.manufacturer_list}>
                                {categories && categories.map((manufacturer: any) => (
                                    <div key={manufacturer.category_id} className={s.manufacturer_item}>
                                        <h2>
                                            {i18n.language === 'en' ? manufacturer.name_en : manufacturer.name_ru}
                                        </h2>
                                        <p>{manufacturer.category_id}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ marginTop: '20px' }}>{i18n.language === 'en' ? 'No category found' : 'Категории не найдены'}</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

interface Category {
    label: string;
    value: string;
}
