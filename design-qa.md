# Design QA — лаймовый первый экран

22 октября 2026 года.

## Источники и состояние

- Источник: `work/qa/hero-lime/reference.png`, 788×384 px.
- Реализация в in-app Browser: http://localhost:5173/.
- Основной точный масштаб: viewport 788×600 CSS px, герой 788×384 CSS px,
  расположен на y58 под сохранённой шапкой. Браузерный снимок
  `reference-size-full.png`; содержательная область `reference-size.png`,
  788×384 px. Плотность снимка 1:1 к CSS px. Источник и реализация сравнивались
  без растяжения в `comparison-final.jpg` (1576×384 px).
- Детали заголовка, кнопки, фото и плашек: `comparison-detail.jpg`, 1120×250 px,
  обе стороны вырезаны из одинаковой области x140–700, y55–305.
- Дополнительно viewport 1440×900: `desktop-full.png`, `desktop.png`;
  телефоны 390×844 и 320×780: `mobile-390.png`, `mobile-320.png`.
  Снимки сохранены из браузера, а не созданы из макета.
- Состояние: страница после прелоадера, начало страницы, меню закрыто.
  Лента статична по последнему прямому уточнению пользователя.

## Проверенные поверхности

- Типографика: Arial/Helvetica, чёрный жирный заголовок в три строки,
  плотный интерлиньяж .96, отрицательный трекинг. Положение заголовка
  и небольшого описания соответствует композиции источника. Содержание
  переведено в существующий контекст АРКА 123; финансовые обещания не перенесены.
- Композиция: текст начинается на 18.5% ширины, фото примерно на 63%;
  правая граница около 88%. Фото имеет пропорцию 198/242, как источник.
  Белая плашка площади выступает влево, маленькая плашка адреса — снизу фото.
  На телефоне обе колонки складываются вертикально; элементы не обрезаются.
- Палитра: светло-зелёный фон, яркая зелёная лента, чёрные текст и кнопка,
  белые информационные плашки. Цвет фона ассета уточнён статичным CSS-фильтром
  hue-rotate(8deg) saturate(1.2), визуально проверен рядом с источником.
- Изображения: реальное фото `room-light.webp`, не новая выдуманная комната.
  Лента — отдельный растровый ассет image_gen по исходному референсу;
  SVG/CSS-рисунком изображение не заменялось. Фото резкое и без искажения.
- Содержание: сохранены смысл исходного заголовка АРКИ, 123 м², Минск,
  расположение напротив Библиотеки и переход к форматам.

## История исправлений

1. На промежуточном сравнении `comparison.jpg` фон был недостаточно насыщенным.
   Уточнён оттенок фонового ассета. Сравнение после правки — `comparison-final.jpg`.
2. [P2, исправлено] При 788 px минимальные размеры описания и кнопки делали
   левый блок плотнее источника. Минимальный кегль описания уменьшен до 9 px
   только для desktop/tablet-масштаба; размер кнопки масштабируется 24–40 px.
   Мобильные размеры остались 14 и 12 px. После правки заголовок и CTA
   занимают нужное положение; подтверждено `comparison-final.jpg` и деталями.
3. При очистке старого hero восстановлены общие стили шрифта #about и скрытия
   локации в шапке до 1200 px. Три исходные карточки второго блока сохранены.

## Взаимодействия и проверки

- Основная кнопка реально переводит к #formats: после прокрутки top секции 77.76 px.
- Фотография открывает #gallery; нижняя плашка адреса открывает #contact.
- Мобильное меню открывается и закрывается, aria-expanded меняется на true.
- При 1440, 788, 390 и 320 px scrollWidth равен innerWidth: горизонтального
  переполнения нет.
- У hero и ::before animation-name: none. Фоновая лента не анимируется.
  Фирменный прелоадер других частей страницы не изменён.
- Проверены логи браузера: ошибок и предупреждений нет.
- `npm run lint` и `npm run build` проходят. Прежнее предупреждение о размере
  three.js связано с существующим туром и не вызвано новым экраном.
- Временные размеры viewport сброшены, вкладка оставлена открытой.

## Findings и дальнейшая полировка

Активных P0/P1/P2 замечаний нет. Фото, текст и подписи адаптированы к АРКЕ,
поэтому они отличаются от финансового сайта в источнике. Сохранённая шапка
находится над hero и не входит в сопоставляемый прямоугольник 788×384.
P3: контур растровой ленты немного отличается от размытого исходника;
композиция, масштаб, палитра и основные изгибы сохранены.

Проверено: композиция, типографика, цвета, качество изображений, содержание,
мобильные размеры и основные переходы. Невыполненных блокирующих исправлений нет.

final result: passed

## Обновление палитры — 23 октября 2026

По приложенному одноцветному образцу герой перекрашен в жёлто-лаймовую
палитру АРКИ. RGB образца 230, 241, 126 (`#e6f17e`), тот же цвет установлен
в --hero-lime и небольших акцентах. Фон перекрашен CSS-фильтром без замены
композиции. Новый браузерный снимок: `work/qa/hero-lime/brand-colors.png`.
Визуально проверено во встроенном браузере; 1440 px без переполнения.
`npm run lint` и `npm run build` прошли. Лента по-прежнему статичная.

final result: passed

## Full-width hero and white header - 23 October 2026

Verified viewport 1920: hero x=0, width=1920, height=702. Mobile 390: hero width=390 and no horizontal overflow. Background extends upward behind the header by 68px on desktop and 58px on mobile. Final user clarification keeps the header opaque white: computed background-color rgb(255,255,255). Transparent header iteration was removed. Browser evidence: work/qa/hero-lime/white-header.png. Lint and build passed.

final result: passed

## Footer tour and drawer - 23 October 2026

Current verification report: `work/qa/footer-tour/qa.md`. Standalone tour section removed; footer photo button opens the panorama dialog. Rounded white footer panel overlaps the pinned photo on desktop, with ordinary scrolling on mobile and reduced motion. Browser evidence: `work/qa/footer-tour/drawer-overlap.png`. Lint and build passed.

final result: passed

## Final clarification: static footer shape - 23 October 2026

Removed sticky positioning from the photo/form at every viewport. The rounded white panel retains only its static shape, shadow and small overlap. Browser check at 1440x900: scrollY 10704 to 11084.5; photo top 77.92 to -302.58 and panel top 729.51 to 349.01, both moving by the same 380.5px. Computed photo position is relative; upper radius remains 44px. Evidence: work/qa/footer-tour/footer-static.png. This supersedes the earlier pinned-photo drawer behavior. Lint and build passed.

final result: passed

## Pricing ribbon background - 23 October 2026

The pricing section now uses the same static image, color filter and base color as the hero through shared CSS variables. Browser computed backgroundImage and filter match exactly. Verified full viewport width at 1920px (x=0, width=1920) and 390px with no horizontal overflow. Three tariff cards and prices are unchanged. Lint and build passed. Browser capture: work/qa/pricing-ribbon/cards.png; geometry and computed-style evidence: work/qa/pricing-ribbon/capture.json.

final result: passed

## Final scope: ribbon only below tariff heading - 23 October 2026

Split services and tariffs into separate sections. #services contains the existing heading and three service rows on white (computed rgb(255,255,255), no background image). #pricing contains the tariff heading, three cards and note on the hero ribbon background. Navigation to #pricing now targets the actual tariff section. Verified at 1440 and 390px with no horizontal overflow. Card content and prices unchanged. Browser evidence: services-and-prices.png and split-capture.json in work/qa/pricing-ribbon. Lint and build passed.

final result: passed
