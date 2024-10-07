import { useEffect, useState } from 'react';
import AdminNavbar from '../../shared/navbar/navbar';
import s from './admin-ad.module.css';
import { useNavigate } from 'react-router-dom';
import { getAds, getAdById, patchAd, deleteAd, createAd } from '../../shared/api'; // Предполагается, что эти API методы уже реализованы
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { getToken } from '../../App';

export const AdminAd = () => {
    const { t, i18n } = useTranslation();
    const [ads, setAds] = useState<any[]>([]);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(25); // Лимит по умолчанию
    const [adPlacement, setAdPlacement] = useState<string>('Main page'); // Default placement
    const [selectedAd, setSelectedAd] = useState<any | null>(null); // Выбранное объявление
    const [adDetails, setAdDetails] = useState<any | null>({ad_id: '' ,ad_placement: 'Main page', manufacturer_id: '', start_date: '', end_date: '' }); // Инициализируем пустую форму для создания нового объявления
    const [isLoading, setIsLoading] = useState(false);
    const [advert, setAdvert] = useState<any>();
    const navigate = useNavigate();

    const adPlacementOptions = [
        { label: 'Main page', value: 'Main page' },
        { label: 'Catalog', value: 'Catalog' },
        { label: 'Manufacturer page', value: 'Manufacturer page' },
        { label: 'Contact info', value: 'Contact info' },
        { label: 'Events catalog', value: 'Events catalog' },
        { label: 'Event page', value: 'Event page' },

    ];

    // Получить объявления
    const fetchAds = async () => {
        setIsLoading(true);
        const token = getToken('access')
        const response = await getAds(adPlacement, offset, token);
        const data = await response.json();
        if (offset === 0) {
            setAds((prevAds) => [...data.ads]);
        } else {
            setAds((prevAds) => [...prevAds, ...data.ads]); // Подгрузка новых объявлений
        }
        setIsLoading(false);
    };

    // Получить подробности объявления
    const fetchAdDetails = async (ad_id: string) => {
        const token = getToken('access')
        const response = await getAdById(ad_id, token);
        const data = await response.json();
        console.log(data)
        setAdvert(data.ad)
    };

    // Обработчик изменения места размещения
    const handlePlacementChange = (selectedOption: any) => {
        setAdPlacement(selectedOption.value);
        setAds([]); // Очищаем объявления для новой выборки
        setOffset(0); // Сбрасываем offset
    };

    // Подгрузить ещё объявления
    const loadMoreAds = () => {
        setOffset((prevOffset) => prevOffset + limit);
    };

    // Открыть подробности объявления
    const handleViewDetails = (ad_id: string) => {
        fetchAdDetails(ad_id);
        setSelectedItemId(ad_id)
        // Реализовать анимацию показа (CSS или библиотека)
    };

    // Обновить или создать объявление
    const handleSaveAd = async (adData: any) => {
        const adId = adData.ad_id || ''; // Если ID пустое, создаст новое
        const token = getToken('access')
        const data = {
            "ad_placement": adData.ad_placement,
            "manufacturer_id": adData.manufacturer_id,
            "start_date": adData.start_date,
            "end_date": adData.end_date
        }
        let response;
        if (adData.ad_id !== '') {
            response = await patchAd(data, adId, token);
        } else {
            response = await createAd(data, token);
        }
        if (response.ok) {
            fetchAds(); // Обновляем список объявлений
        }
    };

    // Удалить объявление
    const handleDeleteAd = async (ad_id: string) => {
        const token = getToken('access')

        const response = await deleteAd(ad_id, token);
        if (response.ok) {
            setAds(ads.filter((ad) => ad.ad_id !== ad_id)); // Убираем из списка
        }
    };


    useEffect(() => {
        fetchAds(); // Загружаем объявления при изменении места размещения или offset
    }, [adPlacement, offset]);

    const [selectedItemId, setSelectedItemId] = useState('')

    return (
        <div className={s.login}>
            <div className={s.login_wrapper}>
                <AdminNavbar />
                <div className={s.main_content}>
                    {/* Выбор места размещения */}
                    <Select
                        options={adPlacementOptions}
                        onChange={handlePlacementChange}
                        value={adPlacementOptions.find(option => option.value === adPlacement)}
                        placeholder={i18n.language === 'en' ? 'Select placement...' : 'Выбрать место размещения...'}
                    />

                    {/* Список объявлений */}
                    <div className={s.ad_list}>
                    <div className={s.manufacturers_item}>
                                        <p>Страница</p>
                                        <p style={{paddingRight: '10.5%'}}>Айди мануфактуры</p>
                                        <p style={{marginRight: '-0.6%'}}>Дата начала</p>
                                        <p style={{marginRight: '-3%'}}>Дата завершения</p>
                                        <p>Айди рекламы</p>

                        </div>
                        {ads.length > 0 ? (
                            <div className={s.list}>
                                {ads.map((ad) => (
                                    <div className={s.item_wrapper}>
                                    <div className={s.manufacturer_item}>
                                        <p>{ad.ad_placement}</p>
                                        <p>{ad.manufacturer_id}</p>
                                        <p>{ad.start_date}</p>
                                        <p>{ad.end_date}</p>
                                        <p>{ad.ad_id}</p>
                                        <button onClick={() => handleViewDetails(ad.ad_id)}>
                                            {i18n.language === 'en' ? 'Details' : 'Подробнее'}
                                        </button>
                                        <button onClick={() => handleDeleteAd(ad.ad_id)}>
                                            {i18n.language === 'en' ? 'Delete' : 'Удалить'}
                                        </button>
                                    </div>

                                    <div  className={`${s.grid_container_about_more} ${ad.ad_id === selectedItemId ? s.active : s.unactive}`}>
                                    <p>Название мануфактуры:</p>
                                    <p>
                                        {advert?.manufacturer 
                                            ? (i18n.language === 'en' ? advert.manufacturer.name_en : advert.manufacturer.name_ru) 
                                            : i18n.language === 'en' ? 'Manufacturer name not available' : 'Имя производителя недоступно'}
                                    </p>
                                    <p>Статус мануфактуры:</p>
                                    <p>
                                        {advert?.manufacturer 
                                            ? advert.manufacturer.status 
                                            : i18n.language === 'en' ? 'Status not available' : 'Статус недоступен'}
                                    </p>                                    </div>
                                    </div>


                                ))}
                            </div>
                        ) : (
                            <p style={{fontSize: '12px', margin: '10px 0px'}}>{i18n.language === 'en' ? 'No ads found' : 'Объявления не найдены'}</p>
                        )}
                    </div>

                    {/* Кнопка для загрузки ещё */}
                    <button className={s.loadMoreBtn} onClick={loadMoreAds} disabled={isLoading}>
                        {i18n.language === 'en' ? 'Load more' : 'Загрузить ещё'}
                    </button>
                    
                    {/* Подробности объявления (анимация может быть добавлена через CSS) */}
                    {adDetails && (
                        <div className={s.ad_details}>
                            <h3>{adDetails.title}</h3>
                            <p>{adDetails.description}</p>
                            {/* Форма для изменения рекламы */}
                            <form className={s.ad_details} onSubmit={(e) => {
                                e.preventDefault();
                                handleSaveAd(adDetails);
                            }}>
                                {/* Поля формы */}
                                <h2 style={{fontSize: '14px'}}>Создание/изменение рекламы</h2>
                                <input
                                    type="text"
                                    value={adDetails.ad_id}
                                    onChange={(e) => setAdDetails({ ...adDetails, ad_id: e.target.value })}
                                    placeholder={i18n.language === 'en' ? 'Ad id' : 'Айди рекламы'}
                                />
                                <input
                                    type="text"
                                    value={adDetails.ad_placement}
                                    onChange={(e) => setAdDetails({ ...adDetails, ad_placement: e.target.value })}
                                    placeholder={i18n.language === 'en' ? 'Ad Placement' : 'Место размещения'}
                                />
                                <input
                                    type="text"
                                    value={adDetails.manufacturer_id}
                                    onChange={(e) => setAdDetails({ ...adDetails, manufacturer_id: e.target.value })}
                                    placeholder={i18n.language === 'en' ? 'Manufacturer id' : 'Айди производителя'}
                                />
                                <input
                                    type="date"
                                    value={adDetails.start_date}
                                    onChange={(e) => setAdDetails({ ...adDetails, start_date: e.target.value })}
                                    placeholder={i18n.language === 'en' ? 'Start Date' : 'Дата начала'}
                                />
                                <input
                                    type="date"
                                    value={adDetails.end_date}
                                    onChange={(e) => setAdDetails({ ...adDetails, end_date: e.target.value })}
                                    placeholder={i18n.language === 'en' ? 'End Date' : 'Дата окончания'}
                                />
                                <button className={s.saveButton} type="submit">{i18n.language === 'en' ? 'Save' : 'Сохранить'}</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};