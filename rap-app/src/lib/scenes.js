// Visual cues for freestyle drills: vivid everyday scenes, Allahabad-first.
// Text prompts (not images) so the app stays fully offline and weightless.
// Add your own freely — one line each.

export const SCENES = [
  'Sangam at dawn — boats, mist, one diya floating past',
  'Loknath ki gali — samose ki khushboo, bheed, shor',
  'Civil Lines coffee house — old men arguing over chai',
  'Allahabad Junction platform 1 — coolie, gathri, announcement echo',
  'Company Bagh — barbad banyan ke neeche ek khali bench',
  'Rickshaw at Katra market, monsoon puddle splash',
  'University wall — faded election graffiti, naya poster upar',
  'Yamuna bridge at night — trucks, wind, ek akela chaiwala',
  'Mohalle ki chhat — patang, loudspeaker se door ka gaana',
  'Kumbh crowd — ash-covered sadhu checking a smartphone',
  'Purani Delhi–Allahabad train — window seat, sunset on fields',
  'Chowk ki jewellery shop — mirror, gold, guard oonghta hua',
  'Power cut evening — inverter beep, candle shadows, carrom',
  'Cricket in the gali — one brick wicket, tennis ball, shor',
  'Barsaat ke baad — bheegi mitti ki khushboo, saaf aasmaan',
  'Nukkad ki paan shop — radio, takraar, chuna lagati ungli',
  'Wedding band baja — offbeat dhol, naachte hue chacha',
  'Exam season hostel — chai, charts, 3 AM ka sannata',
  'Old bookshop — dhool, Urdu diwan, ek postcard gira hua',
  'Mango orchard June mein — loo, dopahar, ek radio kahin',
  'Sabzi mandi subah 5 baje — auction jaisi awaazein',
  'Barber shop Sunday — queue, akhbaar, filmi behas',
  'Diwali ki raat chhat se — poora shehar ek saath jagmagata',
  'Winter fog morning — school van ki headlight, thithurte bacche',
]

export function randomScene() {
  return SCENES[Math.floor(Math.random() * SCENES.length)]
}
