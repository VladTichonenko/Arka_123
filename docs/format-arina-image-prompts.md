# Карточки с нашей Ариной в нашем зале — 22 октября 2026

Актуальный вариант после прямого уточнения пользователя: для новых сцен
нужно использовать существующую героиню и фотографии нашей комнаты.
Первый вариант со сторонними моделями и цветной выдуманной студией отвергнут.

Встроенный `image_gen`, пять отдельных изображений 1536×1024. Для каждого
вызова через `referenced_image_paths` переданы следующие файлы после просмотра:

1. `public/images/arina-arka-123.jpg` — лицо, волосы, одежда и брошь Арины.
2. `public/images/space/room-main.webp` — архитектура реального зала.
3. `public/images/space/room-light.webp` — дополнительный ракурс того же зала.

Стиль рекламного референса пользователя сохранён в цветах оформления,
типографике, одежде гостей и небольших предметах; чужие логотипы исключены.
Референс хранится в `work/format-redesign/campaign-reference.png`.
Сцены концептуальные, не документальные фотографии реальных мероприятий
и не подтверждение наличия реквизита. Соответствующая подпись есть в секции.

PNG-оригиналы: `work/generated/formats-arina/{workshop,seminar,presentation,team,gathering}.png`.
Финальная коррекция камерной встречи — `work/generated/formats-arina/gathering-v2.png`;
на сайт экспортируется именно v2.
Файлы сайта: `public/images/formats/{workshop,seminar,presentation,team,gathering}-arina.webp`.
Экспорт Pillow в исходном размере: WebP quality=88, method=6, без ретуши.
Текст, плашки и кнопки — доступные HTML/CSS, не часть растровых изображений.

## workshop — мастер-класс

```text
Use case: ads-marketing, identity-preserving conceptual lifestyle scene.
Asset type: one premium commercial website workshop card image, landscape 3:2, 1536×1024.
Input images: Image 1 (arina-arka-123.jpg) is the REQUIRED exact fictional character identity reference; images 2 and 3 (room-main.webp and room-light.webp) are REQUIRED actual venue architecture references.
Primary invariant: preserve the recognizable SAME Arina from image 1, same face geometry, grey-green eyes, dark-blond neatly pinned-up hair, age 30–35, black tailored blazer, ivory blouse and small polished silver arch-shaped 123 brooch on the viewer-right lapel. Do not replace her with a generic model. Keep realistic skin texture and understated warm expression.
Scene: Arina is the primary focus center-left, sharing and displaying a ceramic bowl with ONE adult female guest in a vivid mint top, at a simple light workshop table. Natural restrained happy interaction, both faces fully visible, plausible fingers, hands and arms. Small tastefully saturated mint and lilac ceramic props and a few brushes on the table.
Venue invariant: reproduce the recognizable REAL room architecture from images 2 and 3, with the two existing differently sized black-framed arched windows, cream walls, dark exposed ceiling with suspended linear white LED lights, light oak herringbone floor. Keep room neutral and architecturally faithful. No fantasy architecture, no new windows, no colored or neon 3D arches.
Style and mood: photorealistic premium editorial lifestyle advertising, bright flattering natural daylight, positive youthful campaign energy inspired by the supplied colorful Sber campaign but original and branding-free. Subtle cyan edge light and small mint/lilac props add energy without recoloring the room.
Composition: wide 3:2, faces and hands within central 70%, modest headroom for an external HTML badge, waist-up camera framing with enough real room visible for recognition. Entire image filled.
Constraints: conceptual staged advertising scene, not documentary event photography. Exactly ONE image. No text, logos, words, watermarks, frame or UI, except the small original 123 brooch. Preserve Arina's face and wardrobe as primary invariant; preserve real room architecture as second invariant.
```

## seminar — семинар

```text
Use case: identity-preserve and ads-marketing. Asset type: ARKA 123 seminar website card, exactly ONE wide landscape 3:2 conceptual premium commercial photograph. INPUT REFERENCE ROLES: Image 1 is the original fictional brand heroine Arina and is the strict identity and clothing reference. Images 2 and 3 are actual ARKA 123 room photographs and strict recognizable interior references. Primary invariant: preserve EXACTLY Arina's original face from image 1, same facial proportions, grey-green eyes, dark-blond neatly pinned-up hair, age 30–35, natural skin; do not replace her with another model. Preserve her tailored black blazer, ivory blouse and single polished silver arch-shaped brooch containing 123 on the lapel at viewer-right, visible. SCENE: Arina smiling naturally and explaining three simple colored circles on a small white flipchart to ONE engaged adult participant wearing a vibrant blue/mint shirt. Wider waist-up composition with both faces inside central 70%, ample headroom and visible brooch, natural anatomy and hands. Actual recognizable ARKA room from reference photographs, preserve cream walls, black framed arched windows, dark exposed ceiling with suspended straight linear LED lights, oak herringbone floor, black radiator below windows, realistic architectural scale and window geometry. Bright beautiful natural window daylight with polished lively advertising energy. Tasteful lilac/cyan/lime colors on three paper diagram circles and participant clothes only; keep room authentic. No fantasy studio, no neon or decorative invented arch. Original campaign-inspired energetic photography, no copying any bank branding. No text, UI, letters, logos, watermark or frame anywhere except the 123 brooch. The flipchart must contain exactly three simple colored circles and no writing. Conceptual staged advertising scene, not documentary event photography.
```

## presentation — презентация

```text
Use case: identity-preserve. Asset type: premium conceptual commercial website photo for presentation event card, wide 3:2. Input image 1 is the exact fictional brand representative Arina identity reference; images 2 and 3 are actual room references, preserve this recognizable real room architecture. Arina must have exact recognizable original face geometry, grey-green eyes, neat dark-blond updo, age 30–35, tailored black blazer and ivory blouse with original small silver arch123 brooch on viewer-right lapel. Confident warm smile toward camera, holding simple charcoal microphone naturally in one hand and gesturing invitingly with the other, beside a minimal lilac lectern in our REAL room. Preserve recognizable black-framed arched windows, cream walls, dark exposed ceiling and white linear LEDs, oak herringbone floor, real scale. Camera waist-up or medium-wide with recognizable room behind not blurred away. Bright natural window light, subtle turquoise rim accent, tasteful mint/lilac conceptual event props, vibrant ad energy, premium polished contemporary editorial photography with realistic skin and natural proportions. Do not turn room into fantasy colored set or add arches. Face and brooch inside center70%, head fully safe from crop and external top badge. No text, UI, logos, watermark except original 123 brooch. One image only.
```

## team — командная встреча

```text
Use case: ads-marketing, identity-preserving conceptual lifestyle scene.
Asset type: exactly one premium commercial website team-meeting card image, landscape 3:2, 1536×1024.
Input images: Image 1 (arina-arka-123.jpg) is the REQUIRED exact fictional character identity reference; images 2 and 3 (room-main.webp and room-light.webp) are REQUIRED actual venue architecture references. All three images are supplied as local references.
Primary invariant: preserve the recognizable SAME Arina from image 1: same face geometry, grey-green eyes, dark-blond neatly pinned-up hair, age 30–35, black tailored blazer, ivory blouse and small polished silver arch-shaped 123 brooch on the viewer-right lapel. Realistic skin texture. Do not substitute a generic model.
Scene: Arina at center facilitating a creative brainstorming session with exactly TWO other adult coworkers, one man in a lavender shirt and one woman in a mint top, around a simple light table. Warm restrained smiles and authentic eye contact with one another. Open laptop with a blank screen and a few blank lime and cyan paper notes. All three people are distinct, no clones. Anatomically natural hands and arms.
Venue invariant: recognizable REAL room from images 2 and 3, with the same two differently sized black-framed arched windows, cream walls, dark exposed ceiling with irregular suspended linear white LED lights, oak herringbone floor, real building view outside. Preserve the photographed architecture and proportions, keep room visible and neutral. No new geometry, no extra windows, no fantasy studio, no neon 3D arches.
Style and mood: photorealistic premium editorial advertising, bright flattering natural daylight, positive youthful campaign energy through small vibrant lime, mint and lilac props, authentic faces and skin.
Composition: wide 3:2, all faces and hands in central 70%, modest headroom for external HTML badge. Entire canvas filled; enough background visible to recognize the real venue.
Constraints: conceptual staged advertising scene, not documentary photography. Exactly ONE image. No text, logos, words, watermarks, frame or UI except the original small 123 brooch. Original Arina identity and photographed room architecture are highest priorities.
```

## gathering — камерное событие

```text
Use case: identity-preserve and ads-marketing. Asset type: ARKA 123 intimate gathering website card. Create exactly ONE wide 3:2 landscape 1536x1024 photorealistic premium conceptual commercial lifestyle photograph. Input references: image 1 is the ORIGINAL fictional heroine Arina, strict identity and wardrobe reference. Images 2 and 3 are photographs of the ACTUAL ARKA room, strict recognizable interior references. PRIMARY INVARIANT: same exact Arina face, facial proportions, grey-green eyes, dark-blond neatly pinned-up hair, age30–35, black tailored blazer, ivory blouse, polished silver arch brooch containing123 on viewer-right lapel, visible. Do not replace her with another woman. SCENE: exactly three adults, Arina as primary subject at center-left, ONE distinct female guest and ONE distinct male guest relaxed and warmly chatting while holding simple ceramic cups beside a simple small round table. Bright natural daylight and soft natural smiles without exaggerated teeth. Tasteful lilac/cyan/mint ceramic cups and pastel guest clothes. Room must faithfully show original cream walls, two differently sized black-framed arched windows, dark exposed ceiling and suspended white straight linear LEDs, oak herringbone floor, black radiators under the windows and realistic room scale. No invented architecture, decorative arches or fantasy neon studio. Medium-wide waist-up framing, all faces/hands within central70%, modest headroom for a later external HTML badge and enough visible room architecture to recognize the venue. Natural realistic skin detail, distinct guest faces, anatomically correct hands and bodies. Warm confident inviting premium event-space campaign energy. No words, logos, UI, watermark, frame, or typography anywhere except originalbrooch123. Conceptual staged scene, not documentary event photograph.
```

### gathering-v2 — исправление фона

В первой версии генерация добавила частичное третье окно слева. Исправлено
встроенным image_gen с тремя референсами: `gathering.png` как edit target,
`room-main.webp` как архитектура и `arina-arka-123.jpg` как лицо.

```text
Use case: precise-object-edit with identity preservation. EDIT IMAGE1, do not regenerate a new composition. Image1 is the exact edit target and foreground to preserve. Image2 is strict reference for actual room architecture. Image3 is original Arina identity reference. Make ONLY one targeted background architecture correction to image1: REMOVE the invented THIRD partial black-framed arched window and radiator at the far LEFT edge of the picture, replacing that far-left background area with plain uninterrupted cream wall matching actual room in image2. The actual room has ONLY TWO differently sized black-framed arched windows together on its back wall behind the people; retain the existing smaller middle background window behind Arina and large right background window behind the guests. Far left wall must be plain cream with no window or opening. Keep dark exposed ceiling and white suspended straight LED lights, natural cream wall texture and oak herringbone floor. PRIMARY INVARIANTS: Preserve all foreground EXACTLY from image1: the exact same three people, Arina face and identity from image3, grey-green eyes, dark-blond neatly pinned-up hair, black blazer, ivory blouse and silver arch123 brooch at viewer-right lapel; all expressions, hair, hands, ceramic cups, body positions, clothes, small round table and vase/flowers. Preserve image1 camera framing, warm natural daylight, realistic skin and photographic quality. Do not alter foreground or camera framing. Result exactly ONE 3:2 landscape 1536x1024 image. No text, UI, logos, watermark or frame; original123 brooch remains.
```

Визуальная проверка: лицо, одежда и брошь Арины узнаваемы во всех пяти сценах.
Окна, материалы и освещение основаны на фото зала. Лишнее левое окно в gathering
удалено. Сцены остаются обозначенными как ИИ, а не съёмка мероприятий.
