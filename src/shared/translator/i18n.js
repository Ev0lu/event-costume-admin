import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector) // Использование для автоматического определения языка
  .use(initReactI18next)  // Связывание с React
  .init({
    debug: true,
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false, // Не экранируем строки для React
    },
    resources: {
      en: {
        translation: {
          main_catalog: {
            part1: 'Your guide to the world of holidays and events',
            part2: 'The best experts and resources of the Ivent industry in one place',
            part3: 'A platform where leading manufacturers of life-size puppets, stage costumes and props for animators are gathered.',
            part4: 'Verified and recommended masters in the Ivent industry',
            part5: 'All information about upcoming and significant events',
            part6: 'SUBSCRIBE TO NEWSLETTER',
            part7: 'Catalog - rubricator',
            part8: 'Create an Unforgettable Halloween: Costumes That Amaze!',
            part9: 'Original and high-quality suits for any look - be a star at any event',
            part10: 'Closest events',
          },
          header: {
            part1: 'Main',
            part2: 'Fabricators',
            part3: 'Events',
            part4: 'Contacts',
            part5: 'User Agreement',
            part6: 'Privacy Policy',
            part7: 'Search',
            part8: 'All rights reserved'
          },
          contacts: {
            part1: 'Placement information',
            part2: 'To place advertisements on banners and purchase advertising space in the catalog, write:',
            part3: 'To get into the directory, provide all the necessary data in the attached form:',
            part4: 'FORM FOR COMPLETING AN APPLICATION',
            part5: 'IE Danilenko Tatyana Aleksandrovna',
            part6: 'UIN 12132134112312',
            part7: 'ON MAIN',
          },
          events: {
            part1: 'Main',
            part2: 'Events',
            part3: 'BACK',
            part4: 'LOAD MORE'
          }
        },
      },
      ru: {
        translation: {
          main_catalog: {
            part1: 'Ваш путеводитель в мире праздников и мероприятий!',
            part2: 'Лучшие мастера и ресурсы Ivent индустрии в одном месте',
            part3: 'Платформа, где собраны ведущие производители ростовых кукол, сценических костюмов и реквизита для аниматоров.',
            part4: 'Проверенные и рекомендованные мастера в Ivent индустрии',
            part5: 'Вся информация о ближайших и значимых событиях',
            part6: 'ПОДПИСАТЬСЯ НА РАССЫЛКУ',
            part7: 'Каталог - рубрикатор',
            part8: 'Создайте Незабываемый Хэллоуин: Костюмы, Которые Поражают!',
            part9: 'Оригинальные и качественные костюмы для любого образа — будьте звездой на любом мероприятии',
            part10: 'Ближайшие мероприятия'
          },
          header: {
            part1: 'Главная',
            part2: 'Производители',
            part3: 'Мероприятия',
            part4: 'Контактная информация',
            part5: 'Пользовательское соглашение',
            part6: 'Политика конфиденциальности',
            part7: 'Поиск',
            part8: 'Все права защищены'
          },
          contacts: {
            part1: 'Информация по размещению',
            part2: 'Для размещения рекламы на баннерах и покупки рекламных мест в каталоге пишите:',
            part3: 'Чтобы попасть в каталог, укажите все необходимые данные в приложенной форме:',
            part4: 'ФОРМА ДЛЯ ЗАПОЛНЕНИЯ ЗАЯВКИ',
            part5: 'ИП Даниленко Татьяна Александровна',
            part6: 'ИНН 12132134112312',
            part7: 'НА ГЛАВНУЮ',
          },
          events: {
            part1: 'Главная',
            part2: 'Мероприятия',
            part3: 'ВЕРНУТЬСЯ НАЗАД',
            part4: 'ЗАГРУЗИТЬ БОЛЬШЕ'
          }
        },
      },
    },
  });

export default i18n;
