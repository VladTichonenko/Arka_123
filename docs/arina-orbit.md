# Сцена Арины с облётом камеры

Текущий источник проверен 23 октября 2026 года.

## Последний выбор: широкий план

После итерации Veo с приближением пользователь выбрал широкий план с Ариной
в полный рост. По умолчанию `ArinaScrollStory.tsx` использует
`public/videos/arina-orbit-wide.mp4`: Kling v3.0 Pro, около 12 секунд.
В браузере подтверждены этот URL и duration 12.041667 секунды.
Далее сохранено описание производства Veo-итерации; её файл остаётся
в проекте, но больше не является источником по умолчанию.

Стартовый кадр и общий способ управления видео скроллом сохранены.
Новая платная генерация без согласования бюджета не запускалась.

## Запрос пользователя

Повторить механику и композицию Instagram-референса:
https://www.instagram.com/reel/DeCcBVckxqA/

Один блок на всю ширину окна. В комнате АРКИ стоит наша Арина. Вертикальный
скролл управляет непрерывным облётом камеры на 360° с приближением к лицу.
Видны фронтальный, боковые, задний ракурсы и возвращение к лицу.
По бокам — карточки с описанием, три главы в одной сцене.
Плоский параллакс и разделённый фото/текст пользователь прямо отверг.
Приветственное модальное окно не возвращать.

Пользователь одобрил механику первого видео, но отметил плохое качество.
Причины: мало деталей лица в общем плане Kling 720p и дополнительное
CSS-увеличение. Увеличение удалено; текущее видео Veo 3.1 изначально 1080p,
движение к лицу сделано внутри ролика, финал закреплён чётким портретом.

## Готовые файлы

- На сайте: `public/videos/arina-orbit-v2.mp4`, 1920×1080, 24 fps,
  8 секунд, 19,299,710 байт, без аудио.
- Оригинал Veo: `work/arina-scroll/arina-orbit-v2-original.mp4`.
- Стартовый кадр: `public/images/arina-scroll/orbit-poster.webp`.
- Чёткий финальный портрет: `public/images/arina-scroll/orbit-close.webp`.
- Сводка ракурсов: `work/arina-scroll/orbit-v2-frames.jpg`.
- Резкий финал оригинала / web: `orbit-v2-close.png`, `orbit-v2-web-close.png`
  в `work/arina-scroll/`.

Оба исходных кадра созданы встроенным ImageGen с оригинальным портретом
`public/images/arina-arka-123.jpg` и настоящим фото комнаты
`public/images/space/room-main.webp`. Лицо, волосы, одежда и брошь закреплены.
Правила образа — `docs/arina.md`.
Это концептуальное видео, а не точный обмерный скан помещения.
Прежние вырезанные фигуры сохранены как промежуточные материалы и не выводятся.

## Реализация и поведение

`src/widgets/ArinaScrollStory.tsx`, `src/widgets/arina-scroll-story.css`.
Якорь #arina-story, после #space перед сохранённым #experience.
В `App.tsx` прямая ссылка на #arina-story открывает блок после прелоадера.
Сам прелоадер и обычное начало страницы без этой ссылки не менялись.

Блок выходит из общего ограничения 1440 px и занимает ширину окна.
Видео без autoplay: прокрутка меняет currentTime вперёд и назад; когда
прокрутка остановлена, ролик стоит. При seek промежуточные запросы объединяются,
после seeked выбирается последняя нужная позиция. Медиа подгружается рядом с блоком.
К финалу приближается сама камера в видео, CSS-масштабирования больше нет.
Заголовок исчезает в начале движения, карточки переключаются по трём главам.
Каждый кадр MP4 ключевой, без B-кадров, moov в начале, yuv420p, CRF19.
Платные API при просмотре сайта не вызываются, воспроизводится локальный MP4.

На телефоне карточки идут стопкой снизу без пересечений; лицо не перекрыто.
Кнопка чата становится компактной, подсказка скролла скрыта.
При prefers-reduced-motion или высоте окна ≤500 px — статичный постер,
нет длинного закрепления, кнопки вручную меняют три главы.
С 24 октября при ошибке видео геометрия sticky-секции сохраняется, чтобы
страница не прыгала; доступна повторная загрузка. Она также предлагается
после 12 секунд ожидания кадра. Контроллер `scroll-video.ts` разрешает seek
после metadata, продолжает синхронизацию после canplay/progress и объединяет
запросы во время seek до последней позиции. Смена вкладки и pageshow вызывают
пересчёт позиции. Регрессионная проверка — `tests/scroll-video.test.mjs`.

По умолчанию подключён локальный MP4 выше. Необязательная переменная
`VITE_ARINA_ORBIT_VIDEO_URL` позволяет заменить источник.
Ключ генерации не добавлять в VITE, исходники или клиентский бандл.

## Генерация и расходы

Пользователь явно разрешил использовать OpenRouter с суммарным лимитом $3.
Ключ использован только в памяти процесса и после завершения очищен.
В проект, .env, запросы сайта, отчёты и сборку ключ не записан.

| Попытка | Модель | Параметры | Фактическая стоимость |
| --- | --- | --- | --- |
| 1, архив | kwaivgi/kling-v3.0-pro | 12 с, запрошено 720p, без аудио | $1.344 |
| 2, используется | google/veo-3.1 | 8 с, 1080p, без аудио | $1.60 |
| Всего | | | **$2.944** |

Остаток лимита — $0.056. Других платных попыток не было.
Итог без секретов — `work/arina-scroll/generation-costs.json`.
ID заданий: `orbit-job.json`, `orbit-job-v2.json`; результаты:
`orbit-result.json`, `orbit-result-v2.json` в той же папке.
Не запускать новые платные генерации без нового бюджета пользователя.

## Промпты

Полный текущий видеопромпт: `work/arina-scroll/orbit-video-v2-prompt.txt`.
Первый промпт: `work/arina-scroll/orbit-video-prompt.txt`.

Стартовый кадр, built-in ImageGen: identity-preserve, cinematic landscape16:9,
Arina in the center of the exact room, full-body in black blazer/trousers,
ivory blouse, black pumps and silver arch123 brooch; preserve exact face,
grey-green eyes and pinned dark-blond hair, age30–35. Grounded feet, matching
natural daylight, cream walls, black-framed arched windows, black ceiling and
oak herringbone floor. Wide eye-level establishing shot, clear side areas
for HTML cards, one integrated photoreal scene, no UI or typography.

Финальный кадр, built-in ImageGen: identity-preserve, cinematic landscape16:9
close-up, exact same Arina face/eyes/hair/age/wardrobe and123 brooch. Full head
with margin, head/neck ~55% of frame height, shoulders/brooch visible, centered
frontal eye-level view in the actual room, crisp eyes and natural skin texture,
recognizable arched windows and matching daylight, no UI/text/extra people.
Оба исходных референса переданы напрямую при каждой генерации кадра.

Кадры для анализа исходной записи: `reference-first-frame.png`,
`reference-back-frame.png`, `reference-opening.jpg`, `reference-contact-sheet.jpg`
в `work/arina-scroll/`.
