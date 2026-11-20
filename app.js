import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {Reflector} from 'three/addons/objects/Reflector.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

/* ------------------------------------------------------------------ content (client-facing only) */
const T = {
  th: {
    nav_home: 'ภาพรวม', nav_zones: 'โซน', nav_light: 'แสงและโคมไฟ', nav_journey: 'เส้นทางแขก', contact_btn: 'ติดต่อเรา',
    eyebrow: 'ดินเนอร์ล่องเรือ — เจ้าพระยา — พ.ค. 2570',
    hero_sub: 'ดินเนอร์ล่องเรือธีมนีออน บนเรือ VIVA Alangka Cruise แม่น้ำเจ้าพระยา',
    cta_explore: 'สำรวจเรือ 3D', cruise_pause: 'หยุดล่องเรือ', cruise_play: 'ล่องเรือต่อ', done: 'เสร็จ',
    loading: 'กำลังโหลดเรือ 3D', hint: 'ลากเพื่อหมุน · กดสำรวจเพื่อซูม',
    st_seats: 'ที่นั่งสูงสุด', st_zones: 'โซนตกแต่ง', st_lamps: 'โคมไฟบนโต๊ะ',
    split_h: 'แยกชั้นดูง่าย', split_p: 'ยกแต่ละชั้นแยกกัน ไม่ซ้อนทับ', split_back: 'รวมชั้นกลับ',
    more: 'ดูรายละเอียด', see3d: 'ดูโซนนี้ใน 3D', k_zone: 'ZONE',
    lamps_h: 'โคมไฟบนทุกโต๊ะ', lamps_p: 'ทุกโต๊ะมีโคมไฟเรืองแสง 1 ดวง ชาร์จแบต เปลี่ยนสีได้ ไม่ต้องเดินสายไฟ สลับ 3 แบบทั่วทั้งเรือ',
    lamp1_h: 'ก้อนกลมซ้อน · บล็อกบิด', lamp1_p: 'ไล่สีชมพู ม่วง ฟ้า เรืองแสงทั้งตัว',
    lamp2_h: 'โคมแมงกะพรุน', lamp2_p: 'โดมเรืองแสงกับหนวดใส บนฐานอะคริลิก',
    lamp3_h: 'วางจริงบนโต๊ะดาดฟ้า (3D)', lamp3_p: 'ทั้ง 3 แบบสลับกันทีละโต๊ะ',
    lamp_note: 'ภาพโคมเป็นภาพตัวอย่างสินค้า รุ่นและสีจริงยืนยันอีกครั้งก่อนสั่ง',
    beam_h: 'ไฟบีมในห้องอาหารชั้น 2', beam_p: 'ไฟมูฟวิ่งเฮด 2 ตัว วางพื้นข้างหน้าเวที ยิงลำแสงชมพูและฟ้าขึ้นฝ้า ขยับช้าตามเพลง ไม่ยิงเข้าตาแขก และไม่แขวนจากฝ้า',
    sw_pink: 'เส้นนีออนหลัก ราวดาดฟ้าและขอบเรือ', sw_cyan: 'ขอบดาดฟ้า ขอบชั้น 1 และทางเดินพรม',
    sw_violet: 'กรอบจอ LED และไฟในห้อง', sw_gold: 'ผนังถ่ายรูปชิมเมอร์ทอง และไฟทองเดิมของเรือ',
    jr_h: 'เส้นทางของแขก', note: 'ภาพทั้งหมดเป็นภาพจำลองแนวคิด รายละเอียดจริงอาจปรับตามหน้างาน',
    seats: n => `${n} ที่นั่ง`, deck_roof: 'ดาดฟ้า', deck_l2: 'ชั้น 2', deck_l1: 'ชั้น 1',
  },
  en: {
    nav_home: 'Overview', nav_zones: 'Zones', nav_light: 'Light & lamps', nav_journey: 'Guest journey', contact_btn: 'Contact us',
    eyebrow: 'DINNER CRUISE — CHAO PHRAYA — MAY 2027',
    hero_sub: 'A neon-themed dinner cruise on VIVA Alangka Cruise, Chao Phraya River, Bangkok',
    cta_explore: 'Explore in 3D', cruise_pause: 'Pause the cruise', cruise_play: 'Resume the cruise', done: 'Done',
    loading: 'Loading the 3D boat', hint: 'Drag to rotate · tap Explore to zoom',
    st_seats: 'seats available', st_zones: 'decorated zones', st_lamps: 'table lamps',
    split_h: 'Decks apart', split_p: 'Lift each deck apart, nothing overlaps', split_back: 'Put decks back',
    more: 'See details', see3d: 'See this zone in 3D', k_zone: 'ZONE',
    lamps_h: 'A lamp on every table', lamps_p: 'Every table gets one rechargeable glowing lamp that changes colour, no cables. Three styles alternate across the boat.',
    lamp1_h: 'Stacked pebbles · twisted blocks', lamp1_p: 'Pink, violet and cyan, glowing all over',
    lamp2_h: 'Jellyfish lamp', lamp2_p: 'Glowing dome with clear tentacles on an acrylic base',
    lamp3_h: 'On the rooftop tables (3D)', lamp3_p: 'The three styles alternate table by table',
    lamp_note: 'Lamp photos are product samples; final model and colours confirmed before ordering.',
    beam_h: 'Beam lights in the deck 2 room', beam_p: 'Two moving-head lights on the floor beside the stage front shoot pink and cyan beams onto the ceiling, moving slowly with the music. Never into guests\u2019 eyes, nothing hung from the ceiling.',
    sw_pink: 'Main neon lines on the rooftop rail and hull', sw_cyan: 'Rooftop edge, lower deck edge and the carpet path',
    sw_violet: 'LED screen frames and room light', sw_gold: 'Gold shimmer photo wall and the boat\u2019s own gold lights',
    jr_h: 'Guest journey', note: 'All images are concept visuals. Final details may be adjusted on site.',
    seats: n => `${n} seats`, deck_roof: 'Rooftop', deck_l2: 'Deck 2', deck_l1: 'Deck 1',
  },
};
const ICON = {
  ext: '<path d="M2 17c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0"/><path d="M4 14l2-5h12l2 5"/><path d="M8 9V6h8v3"/>',
  pier: '<path d="M3 20h18M5 20V9l7-5 7 5v11"/><path d="M9 20v-6h6v6"/>',
  roof: '<path d="M4 18h16M6 18v-5M18 18v-5M3 13h18"/><circle cx="12" cy="7" r="2.5"/>',
  stage: '<rect x="4" y="4" width="16" height="10" rx="1.5"/><path d="M8 20h8M12 14v6"/>',
  bow: '<path d="M4 20l8-16 8 16"/><path d="M12 10v5"/><circle cx="12" cy="17" r=".8"/>',
  l2: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 12h18M8 5v14"/>',
  l1: '<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M7 7V4h10v3M7 13h10"/>',
  split: '<path d="M4 6h16M4 12h16M4 18h16"/><path d="M8 3l-2 3 2 3M16 15l2 3-2 3"/>',
};
const PLACES = [
  {id: 'ext', imgs: ['06_exterior-night', '3d_ext'], dot: '#00E5FF', seats: 0,
    name: {th: 'ภายนอกเรือ', en: 'The boat at night'}, sub: {th: 'มองจากแม่น้ำ', en: 'From the river'},
    items: {th: ['เส้นนีออนชมพูและฟ้าตามขอบเรือทุกชั้น มองเห็นจากฝั่งตลอดเส้นทาง', 'ป้ายชื่อเรือ VIVA Alangka Cruise คงไว้ชัดเจน', 'ไฟสีทองเดิมของเรือที่ขอบชั้นยังเปิดอยู่', 'ไฟบีมบนดาดฟ้ายิงขึ้นฟ้า เห็นได้ไกล'],
      en: ['Pink and cyan neon along every deck edge, seen from both banks', 'The VIVA Alangka Cruise name stays clear', 'The boat\u2019s own gold edge lights stay on', 'Rooftop beams into the sky, seen from far away']},
    cam: {p: [6, 4.5, -46], t: [0, 3.2, 0]}, pin: null},
  {id: 'pier', imgs: ['teen-pier', '08_pier-archway', '3d_pier'], dot: '#FF2E88', seats: 0,
    name: {th: 'ท่าเรือเอเชียทีค', en: 'Asiatique pier'}, sub: {th: 'จุดขึ้นเรือ', en: 'Boarding point'},
    items: {th: ['ซุ้มอุโมงค์นีออนเดินลอด ป้าย NEON NIGHT บนหัวซุ้ม', 'แผงป้ายขอบนีออน ป้ายวงกลม "Neon Night 2027" สำหรับถ่ายรูป', 'กล่องเรืองแสง ต้นไม้ และดอกไม้ขาว-ชมพู', 'พรมขอบไฟ เดินผ่านซุ้มถึงสะพานขึ้นเรือ'],
      en: ['Walk-through neon tunnel with a NEON NIGHT sign on top', 'Neon-edged panel and a round "Neon Night 2027" sign for photos', 'Glowing cubes, plants and white-pink flowers', 'Lit carpet through the tunnel to the gangway']},
    cam: {p: [-9.8, 2.556, 22.646], t: [-9.8, 2.556, 9.88]}, pin: [-9.8, 5.2, 10.0]},
  {id: 'roof', imgs: ['teen-roof', 'teen-roof-top', '03_rooftop-wide', '10_table-lamps-3d', '3d_roof'], dot: '#FF2E88', seats: 288,
    name: {th: 'ดาดฟ้า', en: 'Open-air rooftop'}, sub: {th: 'ชั้นบนสุด เปิดโล่ง', en: 'Top deck, open sky'},
    items: {th: ['72 โต๊ะ โต๊ะละ 4 ที่ ใต้ท้องฟ้าเปิดโล่ง', 'นีออนชมพูตามราวกันตก และนีออนฟ้าตามขอบดาดฟ้า', 'โคมไฟเรืองแสงบนทุกโต๊ะ สลับก้อนกลมซ้อน บล็อกบิด และแมงกะพรุน', 'ทางเดินกว้าง 1 ม. เดินถึงบันไดได้ทุกทาง'],
      en: ['72 tables of 4 under the open sky', 'Pink neon on the rail, cyan neon on the deck edge', 'A glowing lamp on every table: pebbles, twisted blocks and jellyfish', '1 m aisles, every table reaches the stairs']},
    cam: {p: [0.0, 5.123, 6.966], t: [0.0, 5.123, -5.25]}, pin: [-6, 6.8, 0]},
  {id: 'stage', imgs: ['teen-stage', '04_rooftop-stage', '3d_stage'], dot: '#A855F7', seats: 0,
    name: {th: 'เวทีดาดฟ้า', en: 'Rooftop stage'}, sub: {th: 'เวทีและจอ LED ของเรือ', en: 'The boat\u2019s stage and LED'},
    items: {th: ['จอ LED 3×2 ม. ของเรือ แสดงกราฟิก NEON NIGHT', 'กรอบนีออนม่วงรอบจอ และเส้นไฟชมพูหน้าเวที', 'ไฟบีม 8 ตัวยิงขึ้นฟ้า และไฟ PAR 8 ตัว วางพื้นข้างเวที', 'ป้ายนีออน NEON NIGHT ข้างจอ 2 ป้าย'],
      en: ['The boat\u2019s 3 × 2 m LED screen shows the NEON NIGHT graphic', 'Violet neon frame around the screen, pink line along the stage front', '8 beam lights into the sky and 8 PAR lights on the deck beside the stage', 'Two NEON NIGHT neon signs beside the screen']},
    cam: {p: [2.468, 5.047, 0.635], t: [16.6, 5.047, 0.635]}, pin: [16.6, 7.6, 0]},
  {id: 'bow', imgs: ['3d_bow'], dot: '#D9A85A', seats: 0,
    name: {th: 'หัวเรือชั้น 2 · โฟโต้บูธ', en: 'Bow deck · photo booth'}, sub: {th: 'ลานถ่ายรูปเปิดโล่ง ไม่มีที่นั่ง', en: 'Open photo-booth deck, no seating'},
    items: {th: ['ผนังถ่ายรูปชิมเมอร์ทอง 4×2 ม. ป้ายนีออน "Neon Night 2027"', 'คริสตัลเรืองแสงข้างละ 3 ชิ้น', 'ไฟส่องผนังและไฟส่องหน้า ให้ภาพถ่ายสวย', 'ไม่มีโต๊ะและที่นั่ง ลานโล่งให้แขกต่อคิวและถ่ายรูปได้สะดวก'],
      en: ['4 × 2 m gold shimmer photo wall with a "Neon Night 2027" neon sign', 'Three glowing crystals on each side', 'Wall and face lighting set for good photos', 'No tables or seats: open deck so guests can queue and take photos easily']},
    cam: {p: [26.64, 3.544, 1.387], t: [17.27, 3.544, 1.387]}, pin: [17.3, 5.0, 0]},
  {id: 'l2', imgs: ['teen-l2', '12_L2-stage-3d', 'teen-l2-wide', '13_L2-wide-3d', '14_decor-stage-3d', '15_decor-table-3d', '3d_l2'], dot: '#FF2E88', seats: 200,
    name: {th: 'ห้องอาหารชั้น 2 (VIP)', en: 'Deck 2 dining room (VIP)'}, sub: {th: 'ห้องแอร์', en: 'Air-conditioned'},
    items: {th: ['ข้างจอ LED: แผ่นอะคริลิกใสหัวตัดเฉียง ขอบไฟเส้นนีออนฟ้า ขาว ชมพู ข้างละ 5 แผ่น', 'กรอบไฟเส้นนีออนชมพูรอบจอ LED จอแสดงกราฟิก Neon Night 2027', 'ไฟเส้นนีออนรอบกระจกทุกบาน ฝั่งซ้ายฟ้า ฝั่งขวาชมพู และไฟตามขอบเพดาน', 'ไฟมูฟวิ่งเฮด 2 ตัว วางพื้นหน้าเวที ยิงลำแสงขึ้นฝ้า', 'ทุกโต๊ะ: โคมแมงกะพรุน 8.5 × 8.5 × 16.6 ซม. และช่อดอกไม้ชมพูในแจกันแก้ว'],
      en: ['Beside the LED screen: clear acrylic fins with slanted tops and cyan, white and pink LED neon edges, 5 per side', 'Pink LED neon frame around the screen, which shows the Neon Night 2027 graphic', 'LED neon around every window pane, cyan on the left and pink on the right, plus a lit ceiling edge', 'Two moving-head lights on the floor in front of the stage, beams up to the ceiling', 'Every table: jellyfish lamp (8.5 × 8.5 × 16.6 cm) and a pink flower posy in a glass vase']},
    cam: {p: [8.202, 3.451, 0.334], t: [16.46, 3.451, 0.334]}, pin: [-6, 4.6, -6.3], cut: 'l2'},
  {id: 'l1', imgs: ['teen-l1', '16_L1-stage-3d', '17_L1-windows-3d', '3d_l1'], dot: '#00E5FF', seats: 160,
    name: {th: 'ห้องอาหารชั้น 1', en: 'Deck 1 dining room'}, sub: {th: 'ห้องแอร์ พร้อมบุฟเฟ่ต์', en: 'Air-conditioned, with buffet'},
    items: {th: ['ไฟเส้นนีออนฟ้ารอบกระจกทุกบาน และเส้นไฟชมพูตามขอบเพดาน', 'ข้างจอ LED: แผ่นอะคริลิกใสขอบไฟเส้นนีออน ข้างละ 5 แผ่น กรอบนีออนชมพูรอบจอ', 'ไฟเส้นฟ้าตามขอบเคาน์เตอร์บุฟเฟ่ต์', 'ไฟมูฟวิ่งเฮด 2 ตัว วางพื้นหน้าเวที', 'ทุกโต๊ะ: โคมแมงกะพรุน และช่อดอกไม้ชมพูในแจกันแก้ว'],
      en: ['Cyan LED neon around every window pane, pink light along the ceiling edge', 'Beside the LED screen: clear acrylic fins with LED neon edges, 5 per side; pink neon frame around the screen', 'Cyan light along the buffet counter edge', 'Two moving-head lights on the floor in front of the stage', 'Every table: jellyfish lamp and a pink flower posy in a glass vase']},
    cam: {p: [-1.544, 2.02, 0.263], t: [17.25, 2.02, 0.263]}, pin: [6, 2.3, 6.4], cut: 'l1'},
];
const SPLIT = {l2: 7.5, roof: 15.5};                       // how far each deck lifts in the split view (m)
const SPLIT_CAM = {p: [-30, 34, 50], t: [2, 6.5, 0]};
const OVERVIEW = {p: [-40, 22, 44], t: [-1, 3, 0]};
const CRUISE_CAM = innerWidth < 760 ? {p: [-50, 12, 52], t: [-3, 9.5, 0]} : {p: [-50, 15, 40], t: [-3, 1.0, 0]};   // phone: boat sits in the lower half, under the text
const STEPS = {
  th: [['เช็คอิน', 'เอเชียทีค ระหว่างโกดัง 2 และ 3'], ['เดินลอดซุ้มนีออน', 'พรมขอบไฟ ไปถึงสะพานขึ้นเรือ'], ['ขึ้นเรือ เข้าที่นั่ง', 'ดาดฟ้า หรือห้องแอร์ชั้น 1 และ 2'], ['ถ่ายรูปที่โฟโต้บูธ', 'ผนังทอง หัวเรือชั้น 2'], ['ล่องชมวิว', 'วัดอรุณ พระบรมมหาราชวัง สะพานพระราม 8']],
  en: [['Check in', 'Asiatique, between warehouses 2 and 3'], ['Walk through the neon tunnel', 'Lit carpet to the gangway'], ['Board and take your seat', 'Rooftop or the deck 1 and 2 rooms'], ['Photo booth at the gold wall', 'Bow deck, deck 2'], ['Cruise the river', 'Wat Arun, the Grand Palace, Rama VIII Bridge']],
};

/* ------------------------------------------------------------------ UI */
let lang = localStorage.getItem('nn-lang') || 'th';
let current = null, shown = 'roof', gi = 0, splitOn = false, exploring = false, cruising = true;
const $ = s => document.querySelector(s);
const hero = $('.hero');
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const P = id => PLACES.find(x => x.id === id);

function renderText() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-t]').forEach(el => { const v = T[lang][el.dataset.t]; if (typeof v === 'string') el.textContent = v; });
  document.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.lang === lang));
  $('#zsplit').classList.toggle('on', splitOn);
  $('#zgrid').innerHTML = PLACES.map(p => `<button data-zone="${p.id}" class="${shown === p.id ? 'on' : ''}"><img loading="lazy" src="assets/img/${p.imgs[0]}-s.jpg" alt=""><span>${esc(p.name[lang])}</span></button>`).join('');
  $('#steps').innerHTML = STEPS[lang].map(([a, b]) => `<li><b>${esc(a)}</b><span>${esc(b)}</span></li>`).join('');
  const rail = $('#rail');
  if (rail) rail.innerHTML = PLACES.map(p => `<button data-id="${p.id}" class="${current === p.id ? 'on' : ''}" aria-label="${esc(p.name[lang])}"><svg viewBox="0 0 24 24">${ICON[p.id]}</svg><span>${esc(p.name[lang])}</span></button>`).join('')
    + `<hr><button data-split="1" class="${splitOn ? 'on' : ''}" aria-label="${esc(T[lang].split_h)}"><svg viewBox="0 0 24 24">${ICON.split}</svg><span>${esc(splitOn ? T[lang].split_back : T[lang].split_h)}</span></button>`;
  renderPins(); renderFeat(); renderZone();
  $('#split b').textContent = splitOn ? T[lang].split_back : T[lang].split_h;
}
function renderPins() {
  const deckPins = [['roof', T[lang].deck_roof], ['l2', T[lang].deck_l2], ['l1', T[lang].deck_l1]];
  $('#pins').innerHTML = PLACES.filter(p => p.pin).map(p => `<button class="pin" data-id="${p.id}">${esc(p.name[lang])}</button>`).join('')
    + deckPins.map(([id, n]) => `<button class="pin deck" data-id="${id}" data-deck="1">${esc(n)}</button>`).join('');
}
function renderFeat() {
  const k = PLACES.findIndex(p => p.id === (current || shown)), p = PLACES[k];
  $('#feat').innerHTML = `<button class="th zoomable" data-src="assets/img/${p.imgs[0]}.jpg" data-cap="${esc(p.name[lang])}"><img src="assets/img/${p.imgs[0]}-s.jpg" alt=""></button>
    <div class="b"><div class="k"><span>${esc(T[lang].k_zone)}</span><span>${String(k + 1).padStart(2, '0')} / ${String(PLACES.length).padStart(2, '0')}</span></div>
    <h3>${esc(p.name[lang])}</h3><p>${esc(p.items[lang][0])}</p>
    <div class="row"><button class="more" data-more="1">${esc(T[lang].more)} →</button>
      <span class="dash">${PLACES.map((_, i) => `<i class="${i === k ? 'on' : ''}"></i>`).join('')}</span>
      <span class="arrows"><button data-step="-1" aria-label="Previous">←</button><button data-step="1" aria-label="Next">→</button></span></div></div>`;
}
function renderZone() {
  const p = P(shown);
  $('#zname').textContent = p.name[lang];
  $('#zseats').textContent = p.seats ? T[lang].seats(p.seats) : p.sub[lang];
  gi = Math.min(gi, p.imgs.length - 1);
  const g = $('#gmain'); g.dataset.src = `assets/img/${p.imgs[gi]}.jpg`; g.dataset.cap = p.name[lang]; g.querySelector('img').src = `assets/img/${p.imgs[gi]}.jpg`;
  $('#gthumbs').innerHTML = p.imgs.length > 1 ? p.imgs.map((f, i) => `<button data-gi="${i}" class="${i === gi ? 'on' : ''}"><img src="assets/img/${f}-s.jpg" alt=""></button>`).join('') : '';
  $('#zitems').style.setProperty('--dot', p.dot);
  $('#zitems').innerHTML = p.items[lang].map(i => `<li>${esc(i)}</li>`).join('');
  document.querySelectorAll('#zgrid button').forEach(b => b.classList.toggle('on', b.dataset.zone === shown));
}
document.addEventListener('click', e => {
  const t = e.target;
  const lb = t.closest('.lang button'); if (lb) { lang = lb.dataset.lang; localStorage.setItem('nn-lang', lang); renderText(); return; }
  if (t.closest('#zsplit') || t.closest('#split') || t.closest('#rail [data-split]')) { setSplit(!splitOn); return; }
  const r = t.closest('#rail button[data-id], .pin'); if (r) { go(r.dataset.id); return; }
  const st = t.closest('[data-step]'); if (st) { const k = PLACES.findIndex(p => p.id === (current || shown)); go(PLACES[(k + +st.dataset.step + PLACES.length) % PLACES.length].id); return; }
  if (t.closest('[data-more]')) { $('#zone').scrollIntoView({behavior: 'smooth'}); return; }
  const zg = t.closest('[data-zone]'); if (zg) { shown = zg.dataset.zone; gi = 0; renderZone(); return; }
  const th = t.closest('[data-gi]'); if (th) { gi = +th.dataset.gi; renderZone(); return; }
  if (t.closest('#z3d')) { window.scrollTo({top: 0, behavior: 'smooth'}); go(shown); return; }
  const z = t.closest('.zoomable'); if (z) { const box = $('#lb'); box.querySelector('img').src = z.dataset.src; box.querySelector('p').textContent = z.dataset.cap || ''; box.hidden = false; return; }
  if (t.closest('#lb')) $('#lb').hidden = true;
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { $('#lb').hidden = true; if (exploring) exitExplore(); } });
$('#explore').onclick = () => enterExplore();
$('#xexplore').onclick = () => exitExplore();
renderText();

/* ------------------------------------------------------------------ 3D */
const canvas = $('#c3d'), viewer = $('#viewer');
const renderer = new THREE.WebGLRenderer({canvas, antialias: true, powerPreference: 'high-performance'});
let DPR = Math.min(window.devicePixelRatio || 1, 1.5);
renderer.setPixelRatio(DPR);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.85;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05070f);
scene.fog = new THREE.FogExp2(0x070815, 0.0032);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.12;

const camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.1, 2000);
camera.position.set(...CRUISE_CAM.p);
const controls = new OrbitControls(camera, canvas);
controls.target.set(...CRUISE_CAM.t);
controls.enableDamping = true; controls.dampingFactor = 0.08;
controls.minDistance = 2.5; controls.maxDistance = 150;
controls.maxPolarAngle = Math.PI * 0.495;
controls.screenSpacePanning = true; controls.zoomToCursor = true;
controls.enableZoom = false; controls.enablePan = false;
controls.autoRotate = true; controls.autoRotateSpeed = 0.35;

/* sky dome */
scene.add(new THREE.Mesh(new THREE.SphereGeometry(900, 48, 24), new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, fog: false,
  vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `varying vec3 vP;
    float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,45.164)))*43758.5453); }
    void main(){ float y = max(vP.y, 0.);
      vec3 col = mix(vec3(0.10,0.06,0.20), vec3(0.008,0.012,0.035), pow(y, .45));
      col += vec3(0.16,0.06,0.16) * exp(-y*14.) * .25;
      vec3 q = floor(vP*300.); float s = step(.9992, h(q)) * smoothstep(.15,.5,y);
      col += vec3(.75,.8,1.) * s * .5;
      gl_FragColor = vec4(col,1.); }`,
})));

/* river: reflective water (512 px reflection = half the old cost) + a cheap flat fallback used inside rooms / split view */
const water = new Reflector(new THREE.PlaneGeometry(1400, 1400), {
  textureWidth: 512, textureHeight: 512, clipBias: 0.002, color: 0xffffff,
  shader: {
    name: 'RiverShader',
    uniforms: {color: {value: null}, tDiffuse: {value: null}, textureMatrix: {value: null}, time: {value: 0}, flow: {value: 0}},
    vertexShader: `uniform mat4 textureMatrix; varying vec4 vUv; varying vec3 vW;
      #include <common>
      #include <logdepthbuf_pars_vertex>
      void main(){ vUv = textureMatrix*vec4(position,1.); vW = (modelMatrix*vec4(position,1.)).xyz;
        gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.);
        #include <logdepthbuf_vertex>
      }`,
    fragmentShader: `uniform sampler2D tDiffuse; uniform float time; uniform float flow; varying vec4 vUv; varying vec3 vW;
      #include <logdepthbuf_pars_fragment>
      float w(vec2 p){ return sin(p.x*1.1+time*.9)*cos(p.y*1.6-time*.7) + .6*sin(p.x*2.7-p.y*2.1+time*1.3) + .35*sin(p.y*5.3+p.x*.7-time*1.9); }
      void main(){
        #include <logdepthbuf_fragment>
        vec2 q = vW.xz + vec2(flow, 0.);
        vec2 d = vec2(w(q*.8), w(q.yx*.9+7.)) * .007;
        vec4 uv = vUv; uv.xy += d * uv.w;
        vec3 r = texture2DProj(tDiffuse, uv).rgb;
        vec3 V = normalize(cameraPosition - vW);
        float f = .18 + .82*pow(1. - max(V.y, 0.), 4.);
        float dist = length(cameraPosition.xz - vW.xz);
        vec3 col = vec3(.004,.008,.016) + r * f * .75;
        col = mix(col, vec3(.04,.04,.09), smoothstep(120., 520., dist));
        gl_FragColor = vec4(col, 1.);
      }`,
  },
});
water.rotation.x = -Math.PI / 2; scene.add(water);
const flatWater = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), new THREE.MeshBasicMaterial({color: 0x04060d}));
flatWater.rotation.x = -Math.PI / 2; flatWater.position.y = -0.01; flatWater.visible = false; scene.add(flatWater);

/* light: few lights (each extra light costs every pixel) */
scene.add(new THREE.HemisphereLight(0x4a5a90, 0x05060a, 0.75));
const moon = new THREE.DirectionalLight(0x9fb4ff, 0.35); moon.position.set(-40, 60, 30); scene.add(moon);
const PINK = 0xff2e88, CYAN = 0x00e5ff, VIO = 0xa855f7, WARM = 0xffc27a;

/* materials */
function canvasTex(w, h, draw, rep = 1) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8; t.repeat.set(rep, rep); return t;
}
const rnd = (a, b) => a + Math.random() * (b - a);
const TEX = {
  deck: canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#3b2a1e'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 32) { g.fillStyle = `hsl(25,${rnd(28, 40)}%,${rnd(15, 22)}%)`; g.fillRect(0, y, w, 30); g.fillStyle = '#120c08'; g.fillRect(0, y + 30, w, 2);
      for (let k = 0; k < 40; k++) { g.fillStyle = `rgba(0,0,0,${rnd(.03, .09)})`; g.fillRect(rnd(0, w), y + rnd(0, 30), rnd(20, 120), 1); } } }, 1 / 3),
  grass: canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#2f6b2a'; g.fillRect(0, 0, w, h); for (let i = 0; i < 9000; i++) { g.fillStyle = `hsl(${rnd(95, 120)},${rnd(35, 55)}%,${rnd(18, 34)}%)`; g.fillRect(rnd(0, w), rnd(0, h), 1, rnd(1, 3)); } }, 1),
  concrete: canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#34363d'; g.fillRect(0, 0, w, h); for (let i = 0; i < 6000; i++) { g.fillStyle = `rgba(${rnd(0, 1) > .5 ? 255 : 0},${rnd(0, 1) > .5 ? 255 : 0},255,${rnd(.01, .04)})`; g.fillRect(rnd(0, w), rnd(0, h), 2, 2); } }, 1 / 2),
  marble: canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#e9e5df'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(120,115,110,.18)';
    for (let i = 0; i < 26; i++) { g.lineWidth = rnd(.5, 2); g.beginPath(); let x = rnd(0, w), y = 0; g.moveTo(x, y); while (y < h) { x += rnd(-14, 14); y += rnd(8, 22); g.lineTo(x, y); } g.stroke(); } }, 1 / 1.2),
  sequin: canvasTex(256, 256, (g, w, h) => { const s = 8; for (let y = 0; y < h; y += s) for (let x = 0; x < w; x += s) { const l = rnd(35, 78); g.fillStyle = `hsl(${rnd(36, 44)},${rnd(70, 90)}%,${l}%)`; g.fillRect(x, y, s - 1, s - 1); } }, 4),
  carpet: canvasTex(128, 128, (g, w, h) => { g.fillStyle = '#0d0d10'; g.fillRect(0, 0, w, h); for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(255,255,255,${rnd(.01, .04)})`; g.fillRect(rnd(0, w), rnd(0, h), 1, 1); } }, 1),
};
TEX.sequinE = TEX.sequin.clone();
const ledTex = new THREE.TextureLoader().load('assets/led.jpg'); ledTex.colorSpace = THREE.SRGBColorSpace; ledTex.anisotropy = 8;

const std = (o) => new THREE.MeshStandardMaterial(o);
const phys = (o) => new THREE.MeshPhysicalMaterial(o);
const neon = (hex, k = 2.4) => new THREE.MeshBasicMaterial({color: new THREE.Color(hex).multiplyScalar(k), toneMapped: true, fog: true});
const MAT = {
  Hull_White: phys({color: 0xe9edf2, roughness: .35, clearcoat: .6, clearcoatRoughness: .25}),
  Rail_White: phys({color: 0xe2e6ea, roughness: .3, metalness: .2, clearcoat: .4}),
  Hull_Navy: phys({color: 0x0b1738, roughness: .3, clearcoat: .7}),
  Black: std({color: 0x0c0c10, roughness: .55}), Black_Matte: std({color: 0x0a0a0c, roughness: .9}),
  Glass_Tint: phys({color: 0x183238, roughness: .04, metalness: .1, transparent: true, opacity: .32, envMapIntensity: 1.4, depthWrite: false}),
  Truss_Alu: std({color: 0xaab2bd, metalness: .9, roughness: .32}),
  Chair_Slat: std({color: 0x3a2618, roughness: .55}), Table_Dark: std({color: 0x141212, roughness: .3}),
  Artificial_Grass: std({map: TEX.grass, roughness: 1}),
  Pier_Concrete: std({map: TEX.concrete, roughness: .85}),
  Deck_Roof: std({map: TEX.deck, roughness: .7}), Deck_Teak: std({map: TEX.deck, roughness: .65}),
  Interior_Floor: std({color: 0x1c1d22, roughness: .4}),
  Door_Blue: std({color: 0x163b9c, roughness: .4}), LifeRing_Orange: std({color: 0xff5a1f, roughness: .6}), Tyre_Black: std({color: 0x111111, roughness: .9}),
  Photo_GoldShimmer: std({map: TEX.sequin, color: 0xffffff, metalness: .8, roughness: .3, emissive: 0xffb04a, emissiveMap: TEX.sequinE, emissiveIntensity: .22}),
  LED_Screen: new THREE.MeshBasicMaterial({map: ledTex, color: new THREE.Color(1.05, 1.05, 1.05)}),
  Gold_LED: neon(0xffb347, 1.8), Sign_Gold: neon(0xffcf7a, 1.6),
  Neon_Pink: neon(PINK), Neon_Cyan: neon(CYAN), Neon_Violet: neon(VIO, 2.8),
  I_NeonPink: neon(PINK, 2.0), I_NeonCyan: neon(CYAN, 2.0), I_NeonViolet: neon(VIO, 2.2),
  I_Candle: neon(0xffb060, 1.8), I_PanelGlass: neon(0x26d7ff, 1.0), I_UnderGlow: neon(0xff3fa0, 1.1),
  I_CoveBlue: neon(0xb04dff, 0.9), I_StripWhite: neon(0xffe8ff, 0.7),
  I_CeilWash: std({color: 0x3a1e52, emissive: 0xb14dff, emissiveIntensity: .22, roughness: .8}),
  I_CeilWhite: std({color: 0x2c2238, emissive: 0xd060ff, emissiveIntensity: .15, roughness: .8}),
  I_Marble: phys({map: TEX.marble, roughness: .18, clearcoat: .8}),
  I_ChairCream: std({color: 0xd9c8a5, roughness: .7}), I_ChairBlack: std({color: 0x18181a, roughness: .6}),
  I_ChairNavy: std({color: 0x22305e, roughness: .85}),
  I_Velvet: std({color: 0x202a62, roughness: .85}),
  I_Leg: std({color: 0x1a1a1a, metalness: .6, roughness: .35}), I_Steel: std({color: 0xa7adb5, metalness: .9, roughness: .3}),
  I_Runner: std({map: TEX.carpet, roughness: .95}), I_Black: std({color: 0x0b0b0d, roughness: .7}),
  I_Floor: std({color: 0x24252b, roughness: .25, metalness: .1}),
  I_GoldFrame: std({color: 0xb98a3a, metalness: .9, roughness: .3}), I_Beige: std({color: 0xa48d6a, roughness: .7}),
  I_StripeBlue: std({color: 0x1c3fb8, roughness: .5}), I_StripeWhite: std({color: 0xe5e8ee, roughness: .5}),
  I_Buffet: std({color: 0x0e1840, roughness: .4}), I_BuffetTop: phys({color: 0xf0f0f0, roughness: .15, clearcoat: 1}),
  I_Column: std({color: 0xe8e8e8, roughness: .5}), I_Grille: std({color: 0xa9abaf, metalness: .7, roughness: .4}),
  I_PanelRed: std({color: 0x2a0710, roughness: .6}), I_StageCarpet: std({color: 0x2a2a2e, roughness: .95}),
};
Object.assign(MAT, {
  Neon_White: neon(0xf6f0ff, 0.9), Ring_White: neon(0xffe3f6, 1.8), Slat_Screen_White: neon(0xf1ecff, 0.7),
  Planter_Glow_Blue: neon(0x2f6bff, 0.8), Planter_Glow_White: neon(0xa04dff, 0.8),
  Plant_Fern: std({color: 0x3f8a3a, emissive: 0x16351a, emissiveIntensity: .6, roughness: .6}),
  Carpet_Navy: std({color: 0x2a2f70, roughness: .55}), Pier_Wet: phys({color: 0x3a3a48, roughness: .08, metalness: .2, clearcoat: 1}),
  Lamp_pink: neon(0xff4fa8, 1.5), Lamp_violet: neon(0xb36bff, 1.6), Lamp_white: neon(0xf2e8ff, 1.0), Lamp_cyan: neon(0x38e6ff, 1.4), Lamp_coral: neon(0xff7a6b, 1.4),
  Lamp_Base: std({color: 0xeeeeea, roughness: .4}),
  Portal_Navy: std({color: 0x0b0d2c, roughness: .7, envMapIntensity: 0}), Portal_Slat: neon(0x7fe8ff, 1.2),
  Plant_Green: std({color: 0x3f9a58, emissive: 0x1c4d29, emissiveIntensity: .6, roughness: .7}),
  Planter_Glow: neon(0x8a3dff, 0.8), Planter_Frame: neon(0xf4ecff, 1.3),
  Flower_Pink: std({color: 0xf2a8ca, emissive: 0x6a2c48, emissiveIntensity: .5, roughness: .6}), Flower_White: std({color: 0xf5f2f5, emissive: 0x4a4650, emissiveIntensity: .5, roughness: .6}),
  Sign_Disc: std({color: 0x120a26, roughness: .4}), Carpet_Black: std({map: TEX.carpet, roughness: .95}),
});
for (let k = 0; k < 6; k++) MAT['Crystal_' + k] = new THREE.MeshPhysicalMaterial({color: 0xffffff, emissive: [0xff7ad0, 0x7ae8ff, 0xc89bff][k % 3], emissiveIntensity: 1.2, roughness: .1, transmission: 0, transparent: true, opacity: .9});
for (let k = 0; k < 8; k++) MAT['GlowSphere_' + k] = neon(k % 2 ? 0xff5cc8 : 0x5ce8ff, 1.2);

const cityMat = new THREE.ShaderMaterial({
  fog: false, uniforms: {},
  vertexShader: `varying vec3 vW; varying vec3 vN; void main(){ vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz; vN = normalize(mat3(modelMatrix)*normal); gl_Position = projectionMatrix*viewMatrix*w; }`,
  fragmentShader: `varying vec3 vW; varying vec3 vN;
    float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
    void main(){
      vec2 uv = abs(vN.x) > .5 ? vec2(vW.z, vW.y) : vec2(vW.x, vW.y);
      vec2 cell = floor(uv / vec2(2.6, 3.4)); vec2 f = fract(uv / vec2(2.6, 3.4));
      float win = step(.18, f.x)*step(f.x, .82)*step(.25, f.y)*step(f.y, .8);
      float on = step(.62, h(cell + floor(vW.xz/40.)));
      vec3 wc = mix(vec3(1.,.72,.42), vec3(.75,.85,1.), step(.5, h(cell*1.7)));
      vec3 col = vec3(.012,.014,.024) + wc * win * on * (.55 + .6*h(cell*3.1));
      if (vN.y > .5) col = vec3(.015,.016,.025);
      float d = length(vW.xz - cameraPosition.xz);
      col = mix(col, vec3(.05,.045,.10), smoothstep(150., 700., d) * .75);
      gl_FragColor = vec4(col, 1.);
    }`,
});
MAT.City_Windows = cityMat;
Object.assign(MAT, {MH_Black: std({color: 0x121216, roughness: .5}), MH_Lens_pink: neon(0xff2e88, 3), MH_Lens_cyan: neon(0x00e5ff, 3)});

/* groups: boat (moves when cruising) > decks (lift apart in the split view) */
const boat = new THREE.Group(); scene.add(boat);
/* ZCARDS-BEGIN */
const ZCARDS = {"bow": {"w": 11.259, "h": 6.337, "pos": [17.27, 3.544, 1.387], "rotY": 1.5708, "cam": {"p": [26.64, 3.544, 1.387], "t": [17.27, 3.544, 1.387]}}, "stage": {"w": 16.981, "h": 4.048, "pos": [16.6, 5.047, 0.635], "rotY": -1.5708, "cam": {"p": [2.468, 5.047, 0.635], "t": [16.6, 5.047, 0.635]}}, "roof": {"w": 14.679, "h": 5.826, "pos": [0.0, 5.123, -5.25], "rotY": 0.0, "cam": {"p": [0.0, 5.123, 6.966], "t": [0.0, 5.123, -5.25]}}, "pier": {"w": 15.339, "h": 8.633, "pos": [-9.8, 2.556, 9.88], "rotY": 0.0, "cam": {"p": [-9.8, 2.556, 22.646], "t": [-9.8, 2.556, 9.88]}}, "l1": {"w": 22.582, "h": 12.702, "pos": [17.25, 2.02, 0.263], "rotY": -1.5708, "cam": {"p": [-1.544, 2.02, 0.263], "t": [17.25, 2.02, 0.263]}}, "l2": {"w": 9.923, "h": 3.976, "pos": [16.46, 3.451, 0.334], "rotY": -1.5708, "cam": {"p": [8.202, 3.451, 0.334], "t": [16.46, 3.451, 0.334]}}};
delete ZCARDS.bow;   // 19-11 client: bow = photo booth, no seats -> Teen's picture (with the banquet table) not shown; 3D view only
const zcard = {};   // Teen's zone pictures at true scale (measured anchors), shown only in that zone's view
for (const [k, c] of Object.entries(ZCARDS)) {
  const tx = new THREE.TextureLoader().load(`assets/zcard_${k}.jpg`); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(c.w, c.h), new THREE.MeshBasicMaterial({map: tx, fog: false, toneMapped: false, color: 0xffffff, depthTest: false, depthWrite: false}));   // OPAQUE: replaces the 3D
  m.position.set(...c.pos); m.rotation.y = c.rotY; m.renderOrder = 30; m.visible = false; m.name = 'ZCard_' + k; boat.add(m); zcard[k] = m;
  const bt = new THREE.TextureLoader().load(`assets/zblur_${k}.jpg`); bt.colorSpace = THREE.SRGBColorSpace;
  const bs = Math.max(c.w, c.h) * 4;
  const bd = new THREE.Mesh(new THREE.PlaneGeometry(bs, bs), new THREE.MeshBasicMaterial({map: bt, fog: false, toneMapped: false, depthTest: false, depthWrite: false}));
  bd.position.z = -0.05; bd.renderOrder = 29; bd.name = 'ZCardBackdrop_' + k; m.add(bd);   // CARDBACKDROP (blurred copy fills the whole view)
}
let cardOn = false;   // a picture is up: no bloom, no lamp halos (they smear over the picture near the camera)
function showCard(id) {
  cardOn = !!(id && zcard[id]);
  for (const k in zcard) { zcard[k].visible = k === id; zcard[k].children.forEach(ch => { ch.visible = true; }); }
  scene.traverse(o => { if (o.isPoints || /TableLamp/.test(o.name)) o.visible = !cardOn; });
  beams.forEach(b => { b.visible = !cardOn; });
}
controls.addEventListener('start', () => { if (cardOn) showCard(null); });   // dragging = back to the 3D (picture only at the zone viewpoint)
function cardCam(id, cam) {   // whole picture in view on any screen: back off along the view line until width and height fit
  const c = ZCARDS[id]; if (!c) return cam;
  const vf = THREE.MathUtils.degToRad(camera.fov), hf = 2 * Math.atan(Math.tan(vf / 2) * camera.aspect);
  const d = Math.max(c.h / 2 / Math.tan(vf / 2), c.w / 2 / Math.tan(hf / 2)) * 1.04;
  const t = new THREE.Vector3(...cam.t), dir = new THREE.Vector3(...cam.p).sub(t).normalize();
  const p = t.clone().add(dir.multiplyScalar(d));
  if (id === 'roof' && camera.aspect >= 1) p.z = Math.min(p.z, 4.6);   // desktop: stay inside the railing; phones back off so the picture fits
  return {p: p.toArray(), t: cam.t};
}
/* ZCARDS-END */
const deck = {l1: new THREE.Group(), l2: new THREE.Group(), roof: new THREE.Group()};
Object.values(deck).forEach(g => boat.add(g));
const pierG = new THREE.Group(); scene.add(pierG); pierG.visible = false;
function pl(g, c, i, d, x, y, z) { const l = new THREE.PointLight(c, i * 0.45, d, 2); l.position.set(x, y, z); g.add(l); return l; }
pl(deck.roof, PINK, 40, 18, -14, 6.4, 4.6); pl(deck.roof, CYAN, 40, 18, -14, 6.4, -4.6); pl(deck.roof, CYAN, 40, 18, 4, 6.4, 4.6); pl(deck.roof, PINK, 40, 18, 4, 6.4, -4.6);
pl(deck.roof, VIO, 70, 10, 14.6, 5.6, 0); pl(deck.roof, WARM, 22, 16, -5, 6.0, 0);
pl(deck.l2, 0xd060ff, 22, 14, -10, 4.3, 0); pl(deck.l2, 0xff4fb0, 20, 12, 8, 4.3, 0); pl(deck.l2, 0xffd9a0, 30, 7, 20.2, 3.6, 0);
pl(deck.l1, 0x40a0ff, 18, 14, 0, 2.1, 0);
pl(pierG, PINK, 6, 7, -9.8, 2.0, 11.5); pl(pierG, WARM, 7, 14, -10, 3.4, 12.5);

/* rooftop sky beams (8 moving heads beside the stage) */
const beamMat = (c, len, a) => new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
  uniforms: {c: {value: new THREE.Color(c)}, L: {value: len}, A: {value: a}},
  vertexShader: `varying float vY; varying vec3 vN; varying vec3 vV; void main(){ vY = position.y; vec4 w = modelMatrix*vec4(position,1.); vN = normalize(mat3(modelMatrix)*normal); vV = normalize(cameraPosition - w.xyz); gl_Position = projectionMatrix*viewMatrix*w; }`,
  fragmentShader: `uniform vec3 c; uniform float L; uniform float A; varying float vY; varying vec3 vN; varying vec3 vV;
    void main(){ float a = pow(1. - clamp(vY/L, 0., 1.), 2.2) * A; float e = pow(abs(dot(vN, vV)), 1.5); gl_FragColor = vec4(c * a * e, 1.); }`,
});
const beams = [];
const skyGeo = new THREE.CylinderGeometry(0.05, 1.5, 34, 20, 1, true).translate(0, 17, 0);
[[15.25, -2.45], [15.55, -2.45], [15.25, -2.15], [15.55, -2.15], [15.25, 2.15], [15.55, 2.15], [15.25, 2.45], [15.55, 2.45]].forEach(([x, by], i) => {
  const m = new THREE.Mesh(skyGeo, beamMat(i % 2 ? CYAN : PINK, 34, .13)); m.position.set(x, 5.5, -by); m.renderOrder = 5; m.userData = {k: i, sw: .38, tw: .22}; deck.roof.add(m); beams.push(m);
});
/* deck 2 room: 6 floor moving heads (Chauvet Intimidator Spot 160 ILS, 15 deg) -> short beams onto the 2 m ceiling */
const roomGeo = new THREE.CylinderGeometry(0.03, 0.24, 1.62, 16, 1, true).translate(0, 0.875, 0);
[[15.35, -2.65], [15.35, 2.65], [-12.4, -5.45], [-12.4, 5.45], [-21.3, -4.75], [-21.3, 4.75]].forEach(([x, by], i) => {
  const m = new THREE.Mesh(roomGeo, beamMat(i % 2 ? CYAN : PINK, 1.75, .55)); m.position.set(x, 2.75 + 0.33, -by); m.renderOrder = 5;
  m.userData = {k: i + 3, sw: .2, tw: .15, base: by > 0 ? -.12 : .12}; deck.l2.add(m); beams.push(m);
});

/* glow halos over every table lamp (so the lamps read from far away) */
const haloTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.25, 'rgba(255,255,255,.55)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
const LAMP_COL = [new THREE.Color(0xff7ccf), new THREE.Color(0xb98cff), new THREE.Color(0x6fe6ff)];
fetch('assets/lamps.json?v=202611182355').then(r => r.json()).then(list => {
  const by = {l1: [], l2: [], roof: []};
  list.filter(([x, y, z]) => !(x > 17.0 && z > 2.3 && z < 4.0)).forEach(([x, y, z, st]) => by[z > 4.7 ? 'roof' : z > 2.4 ? 'l2' : 'l1'].push([x, z + 0.13, -y, st]));   // halo at the 166 mm lamp
  for (const [k, arr] of Object.entries(by)) {
    const pos = new Float32Array(arr.length * 3), col = new Float32Array(arr.length * 3);
    arr.forEach(([x, y, z, st], i) => { pos.set([x, y, z], i * 3); col.set([LAMP_COL[st].r, LAMP_COL[st].g, LAMP_COL[st].b], i * 3); });
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({size: 0.55, map: haloTex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true, opacity: .9}));
    pts.renderOrder = 6; deck[k].add(pts);
  }
});

/* wake behind the stern while cruising */
const wake = new THREE.Mesh(new THREE.PlaneGeometry(70, 16), new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, uniforms: {t: {value: 0}, a: {value: 1}},
  vertexShader: `varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `uniform float t; uniform float a; varying vec2 vU;
    float n(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
    void main(){ float x = 1. - vU.x; float y = abs(vU.y - .5) * 2.;
      float edge = smoothstep(.10, 0., abs(y - x*.85)) * .55 + smoothstep(.35, 0., y) * .25 * (1. - x);
      float foam = edge * (.6 + .4*n(floor(vec2(vU.x*240. + t*30., vU.y*60.))));
      gl_FragColor = vec4(vec3(.75,.85,1.), foam * (1. - x) * a * .5); }`,
}));
wake.rotation.x = -Math.PI / 2; wake.position.set(-27.5 - 35, 0.03, 0); boat.add(wake);

/* post */
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.5, 0.35, 0.9);
composer.addPass(bloom);
composer.addPass(new OutputPass());

/* model */
const WALL = /Walls|_Glass|Mullions|Portholes|Door_|CeilWhite|CeilWash|Grille|PanelRed|PanelGlass|RakedFront|^Stair_|Life_Rings|CoveBlue|StripWhite|Interior_L2_Column|Interior_L2_Beige|Interior_L2_GoldFrame|Interior_L1_Stripe|L1_BowBlock|FrontGlass|^Sign_|Life_Rings|Tyre_Fenders|Hull_RubRail|SlabEdge|SternRailing|SternRail_/;
const parts = [];
const draco = new DRACOLoader().setDecoderPath('vendor/three/draco/');
new GLTFLoader().setDRACOLoader(draco).load('assets/boat.glb?v=202611181719', g => {
  const root = g.scene; root.updateMatrixWorld(true);
  const meshes = []; root.traverse(o => { if (o.isMesh) meshes.push(o); });
  const bb = new THREE.Box3();
  meshes.forEach(o => {
    const name = o.name || '';
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    const nm = mats.map(m => {
      const key = (m.name || '').replace(/\.\d+$/, '');
      if (key === 'LED_Screen') {
        const pos = o.geometry.attributes.position, uv = o.geometry.attributes.uv; o.geometry.computeBoundingBox();
        const b = o.geometry.boundingBox, sx = b.max.x - b.min.x, sz = b.max.z - b.min.z, sy = b.max.y - b.min.y;
        for (let i = 0; i < pos.count; i++) { const a = sz >= sx ? (b.max.z - pos.getZ(i)) / (sz || 1) : (pos.getX(i) - b.min.x) / (sx || 1); uv.setXY(i, sz >= sx ? 1 - a : a, (pos.getY(i) - b.min.y) / (sy || 1)); }
        uv.needsUpdate = true;
      }
      return MAT[key] || m;
    });
    o.material = Array.isArray(o.material) ? nm : nm[0];
    if (/^LED_Content_/.test(name)) o.visible = false;
    if (/^Boat_LED_Face/.test(name)) o.material = MAT.LED_Screen;
    bb.setFromObject(o);
    let lvl;
    if (/^Skyline|^Riverbanks|^City/.test(name)) lvl = 'world';
    else if (/^Pier_|^Gangway|^TIME_Carpet|^TIME_Pier|^TIME_Portal|^TIME_Panel|^TIME_RoundSign|^TIME_Slat|^TIME_Flowers|^TIME_LightFrame|^TIME_Planter|^TIME_Gangway/.test(name)) lvl = 'pier';
    else if (/^Stair_/.test(name)) lvl = 'l2';
    else lvl = bb.min.y >= 4.7 ? 'roof' : bb.min.y >= 2.4 ? 'l2' : 'l1';
    o.userData.lvl = lvl; o.userData.wall = WALL.test(name);
    parts.push(o);
  });
  meshes.forEach(o => { const l = o.userData.lvl; (l === 'world' ? scene : l === 'pier' ? pierG : deck[l]).attach(o); });
  // 19-11 client: bow deck = photo booth, no seating -> hide the boat's bow tables/chairs and the lamps on them
  meshes.forEach(o => {
    if (/^BowDeck_(Tables|Chairs)/.test(o.name)) { o.visible = false; o.userData.gone = true; }
    if (/TableLamp_L2/.test(o.name)) {
      const pa = o.geometry.attributes.position, v = new THREE.Vector3(), mw = o.matrixWorld;
      for (let i = 0; i < pa.count; i++) { v.fromBufferAttribute(pa, i).applyMatrix4(mw); if (v.x > 17.0 && v.y > 2.3 && v.y < 4.0) pa.setXYZ(i, 0, -50, 0); }
      pa.needsUpdate = true; o.geometry.computeBoundingSphere();
    }
  });
  { // Teen's pier picture at true scale (plain quad: the compressed mesh scrambles UVs)
    const tex = new THREE.TextureLoader().load('assets/pier_ref_card.jpg'); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const card = new THREE.Mesh(new THREE.PlaneGeometry(15.339, 3.761), new THREE.MeshBasicMaterial({map: tex, toneMapped: false, color: 0xe6e6e6, side: THREE.DoubleSide}));
    card.position.set(-9.800, 2.331, 9.88); pierG.add(card);
  }
  $('#vload').classList.add('done');
  window.__scene = scene;
}, e => { if (e.total) { const p = Math.min(99, Math.round(e.loaded / e.total * 100)); /* gzip total can pass 100 */ $('#vpct').textContent = p + '%'; $('#vprog').value = p; } },
() => { $('#vload div').textContent = 'The 3D view could not load.'; });

/* visibility modes */
let lift = {l2: 0, roof: 0}, liftTo = {l2: 0, roof: 0};
function applyVis(mode) {
  if (typeof showCard === 'function') showCard(null);
  const inRoom = mode === 'l1' || mode === 'l2';
  parts.forEach(o => {
    const l = o.userData.lvl; let v = true;
    if (mode === 'l2') v = l !== 'roof' && !(l === 'l2' && o.userData.wall);
    if (mode === 'l1') v = l !== 'roof' && l !== 'l2' && !(l === 'l1' && o.userData.wall);
    if (mode === 'split') v = l !== 'pier' && !o.userData.wall;
    if (mode && /^Life_Rings|^Tyre_Fenders/.test(o.name)) v = false;
    o.visible = v && !o.userData.gone && !/^LED_Content_/.test(o.name);
  });
  deck.roof.visible = mode !== 'l1' && mode !== 'l2';
  deck.l2.visible = mode !== 'l1';
  pierG.visible = !(mode === 'split' || inRoom);
  water.visible = !(inRoom || mode === 'split'); flatWater.visible = !water.visible;
  liftTo = mode === 'split' ? {...SPLIT} : {l2: 0, roof: 0};
}

/* modes: cruise / explore / zone / split */
let boatX = 0, boatTo = null;
function setCruise(on) {
  cruising = on;
  controls.autoRotate = on && !exploring;
  if (on) { current = null; splitOn = false; applyVis(''); renderText(); pierG.visible = false; }   // out on the river: the pier stays behind
}
function enterExplore() {
  exploring = true; hero.classList.add('exploring'); controls.enableZoom = true; controls.enablePan = true; controls.autoRotate = false;
  if (!current && !splitOn) { setCruise(false); applyVis(''); dockBoat(); flyTo(OVERVIEW); }
}
function exitExplore() {
  exploring = false; hero.classList.remove('exploring'); controls.enableZoom = false; controls.enablePan = false;
  current = null; splitOn = false; applyVis(''); renderText(); setCruise(true); flyTo(CRUISE_CAM, false, true);
}
function dockBoat() { boatTo = 0; }
function go(id) {
  if (['roof', 'l2', 'l1'].includes(id) && splitOn) splitOn = false;
  current = id; shown = id; gi = 0;
  if (!exploring) { exploring = true; hero.classList.add('exploring'); controls.enableZoom = true; controls.enablePan = true; }
  setCruise(false); controls.autoRotate = false; dockBoat();
  const p = P(id); applyVis(ZCARDS[id] ? '' : (p.cut || '')); showCard(id); renderText(); flyTo(cardCam(id, p.cam));
}
function setSplit(on) {
  splitOn = on; current = null;
  if (on) { if (!exploring) { exploring = true; hero.classList.add('exploring'); controls.enableZoom = true; controls.enablePan = true; }
    setCruise(false); controls.autoRotate = false; dockBoat(); applyVis('split'); flyTo(SPLIT_CAM); }
  else { applyVis(''); flyTo(OVERVIEW); }
  renderText();
}

/* camera moves */
let tween = null;
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
function flyTo(cam, instant, rel) {
  const off = rel ? new THREE.Vector3(boat.position.x, 0, 0) : new THREE.Vector3();
  const p1 = new THREE.Vector3(...cam.p).add(off), t1 = new THREE.Vector3(...cam.t).add(off);
  if (instant) { camera.position.copy(p1); controls.target.copy(t1); controls.update(); return; }
  tween = {p0: camera.position.clone(), t0: controls.target.clone(), p1, t1, s: performance.now(), d: 1500, rel};
}
$('#zin').onclick = () => dolly(0.75); $('#zout').onclick = () => dolly(1.33);
$('#zreset').onclick = () => { if (splitOn) setSplit(false); current = null; applyVis(''); renderText(); flyTo(OVERVIEW); };
$('#zfull').onclick = () => { if (document.fullscreenElement) document.exitFullscreen(); else hero.requestFullscreen?.(); };
function dolly(k) { const d = camera.position.clone().sub(controls.target); const L = THREE.MathUtils.clamp(d.length() * k, controls.minDistance, controls.maxDistance); tween = {p0: camera.position.clone(), t0: controls.target.clone(), p1: controls.target.clone().add(d.setLength(L)), t1: controls.target.clone(), s: performance.now(), d: 450}; }
controls.addEventListener('start', () => { tween = null; });

/* pins */
const pv = new THREE.Vector3();
function placePins(w, h) {
  const placed = [];
  document.querySelectorAll('.pin').forEach(el => {
    const id = el.dataset.id, isDeck = el.dataset.deck;
    if (isDeck) {
      const y = id === 'roof' ? 5.1 + lift.roof + 2.6 : id === 'l2' ? 2.75 + lift.l2 + 2.4 : 0.4 + 2.4;
      pv.set(6 + boat.position.x, y, 7.5);
    } else pv.set(...P(id).pin).add(new THREE.Vector3(id === 'pier' ? 0 : boat.position.x, 0, 0));
    pv.project(camera);
    const x = (pv.x + 1) / 2 * w, y = (1 - pv.y) / 2 * h, bw = el.offsetWidth || 120;
    const vis = pv.z < 1 && Math.abs(pv.x) < 1.05 && Math.abs(pv.y) < 1.05;
    const want = isDeck ? splitOn : (exploring && !splitOn && current === null);
    const clash = placed.some(q => Math.abs(q[0] - x) < (bw + q[2]) / 2 + 6 && Math.abs(q[1] - y) < 30);
    const show = vis && want && !clash;
    if (show) placed.push([x, y, bw]);
    el.classList.toggle('off', !show); el.style.left = x + 'px'; el.style.top = y + 'px';
  });
}

/* resize + adaptive quality (the old page ran 28 point lights + a 1024 px reflection = the lag) */
function resize() {
  const w = viewer.clientWidth, h = viewer.clientHeight;
  renderer.setSize(w, h, false); composer.setSize(w, h); bloom.resolution.set(w / 3, h / 3);
  camera.aspect = w / h; camera.fov = w / h < 1 ? 60 : 42; camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(viewer); resize();
let onScreen = true;
new IntersectionObserver(es => { onScreen = es[0].isIntersecting; }, {rootMargin: '60px'}).observe(viewer);
let ft = [], useBloom = true;
function adapt(dt) {
  ft.push(dt); if (ft.length < 90) return;
  const avg = ft.reduce((a, b) => a + b) / ft.length; ft = [];
  if (avg > 30 && DPR > 0.75) { DPR = Math.max(0.75, DPR - 0.25); renderer.setPixelRatio(DPR); resize(); }
  else if (avg > 30 && useBloom) useBloom = false;
  else if (avg < 14 && DPR < Math.min(window.devicePixelRatio || 1, 1.5)) { DPR = Math.min(DPR + 0.25, 1.5); renderer.setPixelRatio(DPR); resize(); }
}
const clock = new THREE.Timer();
let last = performance.now(), flow = 0;
renderer.setAnimationLoop(() => {
  if (!onScreen) return;
  const now = performance.now(), dt = now - last; last = now; adapt(dt);
  clock.update(); const t = clock.getElapsed(), s = Math.min(dt, 50) / 1000;
  // boat: cruise forward (≈ 4 knots) or glide back to the pier
  const prevX = boat.position.x;
  if (cruising) { boatX += 2.1 * s; if (boatX > 260) { boatX = -260; } }
  else if (boatTo !== null) { boatX += (boatTo - boatX) * Math.min(1, s * 2.2); if (Math.abs(boatTo - boatX) < 0.02) { boatX = boatTo; boatTo = null; } }
  boat.position.x = boatX;
  const dx = boat.position.x - prevX;
  if (Math.abs(dx) > 50) { camera.position.x += dx; controls.target.x += dx; }
  else if (cruising || (tween && tween.rel)) { camera.position.x += dx; controls.target.x += dx; if (tween) { tween.p1.x += dx; tween.t1.x += dx; } }
  boat.rotation.x = Math.sin(t * .6) * .004; boat.rotation.z = Math.sin(t * .45) * .003; boat.position.y = Math.sin(t * .7) * .03;
  wake.material.uniforms.t.value = t; wake.material.uniforms.a.value += ((cruising ? 1 : 0) - wake.material.uniforms.a.value) * Math.min(1, s * 1.5);
  flow += (cruising ? 2.1 : 0) * s; water.material.uniforms.flow.value = flow;
  // decks lift apart (split view)
  for (const k of ['l2', 'roof']) { lift[k] += (liftTo[k] - lift[k]) * Math.min(1, s * 3); deck[k].position.y = lift[k]; }
  if (tween) {
    const k = Math.min(1, (now - tween.s) / tween.d), e = ease(k);
    camera.position.lerpVectors(tween.p0, tween.p1, e); controls.target.lerpVectors(tween.t0, tween.t1, e);
    if (k >= 1) tween = null;
  }
  controls.update();
  water.material.uniforms.time.value = t;
  beams.forEach(b => { const k = b.userData.k; b.rotation.z = (b.userData.base || 0) + Math.sin(t * .45 + k * .8) * b.userData.sw * (k % 2 ? 1 : -1); b.rotation.x = Math.cos(t * .37 + k * 1.3) * b.userData.tw; });
  if (useBloom && !cardOn) composer.render(); else renderer.render(scene, camera);
  placePins(viewer.clientWidth, viewer.clientHeight);
  window.__READY__ = $('#vload').classList.contains('done');
});
window.__go = go; window.__split = setSplit; window.__explore = enterExplore;
