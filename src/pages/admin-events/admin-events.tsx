import { useEffect, useState } from 'react';
import AdminNavbar from '../../shared/navbar/navbar';
import s from './admin-events.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteEvent, getEvents, getEventById, createEvent, patchEvent } from '../../shared/api';
import { useTranslation } from 'react-i18next';
import { getToken } from '../../App';

export const AdminEvents = () => {
    const [eventId, setEventId] = useState(''); 
    const [events, setEvents] = useState<any[]>([]);
    const { t, i18n } = useTranslation();
    const [offset, setOffset] = useState(0);
    const [eventData, setEventData] = useState<any>({
        title_ru: '',
        title_en: '',
        description_ru: '',
        description_en: '',
        event_date: '',
        contact_info_ru: '',
        contact_info_en: '',
        excluded_photos: [],
        pictures: null,
        video_link: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        getAllEvents();
        if (eventId) {
            loadEventData(eventId);
        }
    }, [eventId]);

    const loadEventData = async (id: string) => {
        const token = getToken('access');
        const response = await getEventById(id, token, i18n.language);
        const data = await response.json();
        setEventData(data);
    };

    const getAllEvents = async () => {
        const token = getToken('access');
        const response = await getEvents(token, i18n.language, offset);
        const data = await response.json();
        setEvents(data.events);
        console.log(data)
    };

    const deleteEventById = async (id: string) => {
        const token = getToken('access');
        await deleteEvent(id, token);
        getAllEvents(); // Обновляем список после удаления
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const { value } = e.target;
        setEventData({ ...eventData, [name]: value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const fileList = e.target.files;
        setEventData({ ...eventData, [name]: fileList });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = new FormData();

        if (eventData.pictures) {
            Array.from(eventData.pictures).forEach((file: any) => {
                form.append('pictures', file);
            });
        }

        if (eventData.excluded_photos.length > 0) {
            eventData.excluded_photos.forEach((photoId: any) => form.append('excluded_photos', photoId));
        }

        if (eventData.title_ru){
            form.append('title_ru', eventData.title_ru);
        }

        if (eventData.title_en) {
            form.append('title_en', eventData.title_en);
        }

        if (eventData.description_ru){
            form.append('description_ru', eventData.description_ru || '');
        }

        if (eventData.description_en){
            form.append('description_en', eventData.description_en || '');
        }

        if (eventData.event_date){
            form.append('event_date', eventData.event_date);
        }

        if (eventData.contact_info_ru) {
            form.append('contact_info_ru', eventData.contact_info_ru);
        }

        if (eventData.contact_info_en) {
            form.append('contact_info_en', eventData.contact_info_en);
        }

        if (eventData.video_link) {
            form.append('video_link', eventData.video_link);
        } 

        const token = getToken('access');

        if (eventId) {
            await patchEvent(form, eventId, token);
        } else {
            await createEvent(form, token);
        }

        getAllEvents(); 
    };

    return (
        <div className={s.login}>
            <div className={s.login_wrapper}>
                <AdminNavbar />
                <div className={s.main_content}>
                    <form className={s.formModal} onSubmit={handleSubmit}>
                        <div className={s.title_popup}>
                            <p>{eventId ? t('Edit Event') : t('Create Event')}</p>
                        </div>
                        <div className={s.input_form}>
                            <label>Event ID</label>
                            <input type="text"  value={eventId} onChange={(e) => setEventId(e.target.value)} />
                        </div>
                        <div className={s.input_form}>
                            <label>{t('Title (RU)')}</label>
                            <input type="text" name="title_ru" value={eventData.title_ru} onChange={(e) => handleInputChange(e, 'title_ru')} required={eventId === ''} />
                        </div>
                        <div className={s.input_form}>
                            <label>{t('Title (EN)')}</label>
                            <input type="text" name="title_en" value={eventData.title_en} onChange={(e) => handleInputChange(e, 'title_en')} required={eventId === ''} />
                        </div>
                        <div className={s.input_form}>
                            <label>{t('Description (RU)')}</label>
                            <input name="description_ru" value={eventData.description_ru} onChange={(e) => handleInputChange(e, 'description_ru')} />
                        </div>
                        <div className={s.input_form}>
                            <label>{t('Description (EN)')}</label>
                            <input name="description_en" value={eventData.description_en} onChange={(e) => handleInputChange(e, 'description_en')} />
                        </div>
                        <div className={s.input_form}>
                            <label>{t('Event Date')}</label>
                            <input type="date" name="event_date" value={eventData.event_date} onChange={(e) => handleInputChange(e, 'event_date')} required={eventId === ''} />
                        </div>
                        <div className={s.input_form}>
                            <label>{t('Contact Info (RU)')}</label>
                            <input name="contact_info_ru" value={eventData.contact_info_ru} onChange={(e) => handleInputChange(e, 'contact_info_ru')} />
                        </div>
                        <div className={s.input_form}>
                            <label>{t('Contact Info (EN)')}</label>
                            <input name="contact_info_en" value={eventData.contact_info_en} onChange={(e) => handleInputChange(e, 'contact_info_en')} />
                        </div>
                        <div className={s.input_form}>
                            <label>{t('Upload Event Pictures')}</label>
                            <input type="file" name="pictures" multiple onChange={(e) => handleImageChange(e, 'pictures')} />
                        </div>
                        <div className={s.input_form}>
                            <label>{t('Video Link')}</label>
                            <input type="text" name="video_link" value={eventData.video_link} onChange={(e) => handleInputChange(e, 'video_link')} />
                        </div>
                        <button type="submit">{eventId ? t('Update Event') : t('Create Event')}</button>
                    </form>

                    <div className={s.events_list}>
                        <div style={{ marginBottom: '-20px' }} className={s.events_item}>
                            <h2 style={{ marginRight: '17.4%' }}>{i18n.language === 'en' ? 'Event Title' : 'Название события'}</h2>
                            <p>{i18n.language === 'en' ? 'Event ID' : 'Айди события'}</p>
                        </div>
                        {events && events.length > 0 ? (
                            <div className={s.event_list}>
                                {events.map((event: any) => (
                                    <div key={event.event_id} className={s.event_item}>
                                        <h2
                                        >
                                            {i18n.language === 'en' ? event.title_en : event.title_ru}
                                        </h2>
                                        <p>{event.event_id}</p>
                                        <p style={{ color: 'red', cursor: 'pointer' }} onClick={() => deleteEventById(event.event_id)}>x</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ marginTop: '20px' }}>{i18n.language === 'en' ? 'No events found' : 'События не найдены'}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
