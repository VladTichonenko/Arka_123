
## Pricing ribbon background - 23 October 2026

The pricing section now uses the same static image, color filter and base color as the hero through shared CSS variables. Browser computed backgroundImage and filter match exactly. Verified full viewport width at 1920px (x=0, width=1920) and 390px with no horizontal overflow. Three tariff cards and prices are unchanged. Lint and build passed. Browser capture: work/qa/pricing-ribbon/cards.png; geometry and computed-style evidence: work/qa/pricing-ribbon/capture.json.

final result: passed

## Final scope: ribbon only below tariff heading - 23 October 2026

Split services and tariffs into separate sections. #services contains the existing heading and three service rows on white (computed rgb(255,255,255), no background image). #pricing contains the tariff heading, three cards and note on the hero ribbon background. Navigation to #pricing now targets the actual tariff section. Verified at 1440 and 390px with no horizontal overflow. Card content and prices unchanged. Browser evidence: services-and-prices.png and split-capture.json in work/qa/pricing-ribbon. Lint and build passed.

final result: passed
