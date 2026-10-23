# Футер-панель и кнопка тура — 23 октября 2026

Проверено во встроенном браузере на http://localhost:5173/#contact.

- Отдельная секция `section.virtual-tour` отсутствует. После тарифов идёт футер.
- На фото рядом с формой есть кнопка «Смотреть 3D-тур». В 1440 px кнопка
  занимает x898–1118 и не пересекает карточку формы. При 650 px кнопка
  заканчивается на 52 px выше карточки, на 320/390 px помещается в фото.
- Панорама загружается в native dialog после нажатия. Проверены загрузка
  canvas, поворот стрелкой вправо и сброс исходного вида, крестик и Escape.
  После закрытия восстанавливаются прокрутка и фокус на #virtual-tour.
- Ссылка «3D-прогулка» в нижней навигации открывает то же окно просмотра.
  Портал окна остаётся поверх нового футера-панели, canvas загружается.
- Состояния загрузки и ошибки с повторной попыткой предусмотрены в коде;
  сетевой сбой искусственно не воспроизводился. Полноэкранный режим зависит
  от доступности Fullscreen API браузера, отдельное подтверждение его
  активации во встроенном браузере не получено.
- Футер имеет белую верхнюю кромку с радиусом 44 px и наплывом 32 px.
  На desktop 1440×900 после прокрутки scrollY 10704→11084.5 фото остаётся
  у верхней границы 68 px, а панель перемещается y729.5→349 px.
  Это реальное перекрытие при скролле. Снимки: drawer-start.png,
  drawer-overlap.png.
- В 390×844 фото имеет position:relative, верхние углы панели 28 px.
  Между низом карточки формы и началом панели остаётся 24 px, поэтому
  сообщения формы и её кнопка не перекрываются. При низком окне и
  prefers-reduced-motion закрепление также отключается.
- При 320, 390, 650 и 1440 px горизонтального переполнения нет.
- Проверены цвета, скругления, тень, положение кнопки, читаемость текста
  и отсутствие перекрытия управляющих элементов. Сохранено настоящее фото
  зала и предупреждение об ИИ-реконструкции панорамы.
- Логи браузера: новых ошибок и предупреждений нет. npm run lint и
  npm run build проходят; прежнее предупреждение о размере three.js сохранено.
- Временный viewport сброшен, preview открыт.

Снимки: footer-desktop.png, footer-mobile.png, tour-desktop.png,
tour-rotated.png, tour-mobile.png, drawer-start.png, drawer-overlap.png,
drawer-mobile.png.

Блокирующих замечаний по изменённым сценариям нет.

final result: passed

## Final clarification: static footer shape - 23 October 2026

Removed sticky positioning from the photo/form at every viewport. The rounded white panel retains only its static shape, shadow and small overlap. Browser check at 1440x900: scrollY 10704 to 11084.5; photo top 77.92 to -302.58 and panel top 729.51 to 349.01, both moving by the same 380.5px. Computed photo position is relative; upper radius remains 44px. Evidence: work/qa/footer-tour/footer-static.png. This supersedes the earlier pinned-photo drawer behavior. Lint and build passed.

final result: passed
