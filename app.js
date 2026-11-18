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
    contact_btn: 'ติดต่อเรา', hero_chip: 'คอนเซ็ปงาน · พ.ค. 2570',
    hero_sub: 'ดินเนอร์ล่องเรือธีมนีออน บนเรือ VIVA Alangka Cruise แม่น้ำเจ้าพระยา',
    st_guests: 'แขก', st_areas: 'โซนรับประทานอาหาร', st_seats: 'ที่นั่งสูงสุด',
    cta_tour: 'ชมเรือแบบ 3D', cta_places: 'ดูการตกแต่งแต่ละโซน',
    tour_h: 'สำรวจเรือแบบ 3D', tour_p: 'หมุน ซูม และเลือกโซนเพื่อดูการตกแต่งในแต่ละพื้นที่',
    loading: 'กำลังโหลดโมเดล 3D', hint: 'ลากเพื่อหมุน · ซูมด้วยล้อเมาส์หรือสองนิ้ว',
    places_h: 'พื้นที่และการตกแต่ง', places_p: 'กดการ์ดเพื่อดูโซนนั้นในโมเดล 3D',
    look_h: 'โทนสีและบรรยากาศ',
    sw_pink: 'เส้นนีออนหลัก ราวดาดฟ้าและขอบเรือ', sw_cyan: 'ขอบดาดฟ้า ขอบชั้น 1 และทางเดินพรม',
    sw_violet: 'กรอบจอ LED และไฟฝ้าในห้อง', sw_gold: 'ผนังถ่ายรูปชิมเมอร์ทอง และไฟทองเดิมของเรือ',
    jr_h: 'เส้นทางของแขก', note: 'ภาพทั้งหมดเป็นภาพจำลองแนวคิด รายละเอียดจริงอาจปรับตามหน้างาน',
    seats: n => `${n} ที่นั่ง`, cap_ext: 'เรือ VIVA Alangka Cruise ในคืน NEON NIGHT', see3d: 'ดูใน 3D',
  },
  en: {
    contact_btn: 'Contact us', hero_chip: 'Event concept · May 2027',
    hero_sub: 'A neon-themed dinner cruise on VIVA Alangka Cruise, Chao Phraya River, Bangkok',
    st_guests: 'guests', st_areas: 'dining areas', st_seats: 'seats available',
    cta_tour: 'Explore the boat in 3D', cta_places: 'See each area',
    tour_h: 'Explore the boat in 3D', tour_p: 'Rotate, zoom and pick an area to see how it is decorated',
    loading: 'Loading the 3D model', hint: 'Drag to rotate · scroll or pinch to zoom',
    places_h: 'Areas and decoration', places_p: 'Tap a card to see that area in 3D',
    look_h: 'Colours and mood',
    sw_pink: 'Main neon lines on the rooftop rail and hull', sw_cyan: 'Rooftop edge, lower deck edge and the carpet path',
    sw_violet: 'LED screen frames and room ceiling light', sw_gold: 'Gold shimmer photo wall and the boat\u2019s own gold lights',
    jr_h: 'Guest journey', note: 'All images are concept visuals. Final details may be adjusted on site.',
    seats: n => `${n} seats`, cap_ext: 'VIVA Alangka Cruise on NEON NIGHT', see3d: 'View in 3D',
  },
};
const ICON = {
  pier: '<path d="M3 20h18M5 20V9l7-5 7 5v11"/><path d="M9 20v-6h6v6"/>',
  ext: '<path d="M2 17c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0"/><path d="M4 14l2-5h12l2 5"/><path d="M8 9V6h8v3"/>',
  roof: '<path d="M4 18h16M6 18v-5M18 18v-5M3 13h18"/><circle cx="12" cy="7" r="2.5"/>',
  stage: '<rect x="4" y="4" width="16" height="10" rx="1.5"/><path d="M8 20h8M12 14v6"/>',
  bow: '<path d="M4 20l8-16 8 16"/><path d="M12 10v5"/><circle cx="12" cy="17" r=".8"/>',
  l2: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 12h18M8 5v14"/>',
  l1: '<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M7 7V4h10v3M7 13h10"/>',
};
const PLACES = [
  {id: 'ext', img: '06_exterior-night', dot: '#00E5FF', seats: 0,
    name: {th: 'ภายนอกเรือ', en: 'The boat at night'},
    sub: {th: 'มองจากแม่น้ำ', en: 'From the river'},
    items: {th: ['เส้นนีออนชมพูและฟ้าตามขอบเรือทุกชั้น มองเห็นจากฝั่งตลอดเส้นทาง', 'ป้ายชื่อเรือ VIVA Alangka Cruise คงไว้ชัดเจน', 'ไฟสีทองเดิมของเรือที่ขอบชั้นยังเปิดอยู่'],
      en: ['Pink and cyan neon along every deck edge, seen from both banks along the route', 'The VIVA Alangka Cruise name stays clear', 'The boat\u2019s own gold edge lights stay on']},
    cam: {p: [6, 4.5, -46], t: [0, 3.2, 0]}, pin: null},
  {id: 'pier', img: '08_pier-archway', dot: '#FF2E88', seats: 0,
    name: {th: 'ท่าเรือเอเชียทีค', en: 'Asiatique pier'},
    sub: {th: 'จุดขึ้นเรือ', en: 'Boarding point'},
    items: {th: ['ซุ้มอุโมงค์เดินลอด 3.2×3.3 ม. ขอบนีออนชมพู ช่องเดินขอบนีออนฟ้า ผนังด้านในเป็นระแนงไฟ', 'ป้ายกล่องไฟ NEON NIGHT บนหัวซุ้ม', 'ป้ายวงกลมนีออน "Neon Night 2027" และแผงป้ายเฉียงขอบนีออน สำหรับถ่ายรูป', 'กระถางกล่องเรืองแสง ต้นไม้ และแจกันดอกไม้ชมพู-ขาว', 'พรมดำขอบไฟ ไปถึงสะพานขึ้นเรือที่ราวติดไฟนีออนฟ้า'],
      en: ['3.2 × 3.3 m walk-through neon tunnel: pink outline, cyan doorway, glowing slats inside', 'NEON NIGHT light-box sign on top', 'Round "Neon Night 2027" neon sign and an angled neon-edged panel for photos', 'Glowing cube planters, plants and pink-white flowers', 'Black carpet with lit edges to the gangway, cyan neon on its rails']},
    cam: {p: [-9.8, 2.6, 21.5], t: [-9.8, 1.8, 9.6]}, pin: [-9.8, 4.2, 10.0]},
  {id: 'roof', img: '03_rooftop-wide', dot: '#FF2E88', seats: 288,
    name: {th: 'ดาดฟ้า', en: 'Open-air rooftop'},
    sub: {th: 'ชั้นบนสุด เปิดโล่ง', en: 'Top deck, open sky'},
    items: {th: ['72 โต๊ะ โต๊ะละ 4 ที่ ใต้ท้องฟ้าเปิดโล่ง', 'นีออนชมพูตามราวกันตก และนีออนฟ้าตามขอบดาดฟ้า', 'โคมไฟตั้งโต๊ะเรืองแสงหลากสี และผ้ารันเนอร์ดำ บนทุกโต๊ะ', 'ทางเดินกว้าง 1 ม. เดินถึงบันไดได้ทุกทาง'],
      en: ['72 tables of 4 under the open sky', 'Pink neon on the rail, cyan neon on the deck edge', 'A glowing colour table lamp and a black runner on every table', '1 m aisles, every table reaches the stairs']},
    cam: {p: [-31, 9.5, 5.5], t: [-2, 5.6, 0]}, pin: [-6, 6.8, 0]},
  {id: 'stage', img: '04_rooftop-stage', dot: '#A855F7', seats: 0,
    name: {th: 'เวทีดาดฟ้า', en: 'Rooftop stage'},
    sub: {th: 'เวทีและจอ LED ของเรือ', en: 'The boat\u2019s stage and LED'},
    items: {th: ['จอ LED 3×2 ม. ของเรือ แสดงกราฟิก NEON NIGHT', 'กรอบนีออนม่วงรอบจอ และเส้นไฟชมพูหน้าเวที', 'ไฟบีม 8 ตัวยิงขึ้นฟ้า และไฟ PAR 8 ตัว วางพื้นข้างเวที', 'ป้ายนีออน NEON NIGHT ข้างจอ 2 ป้าย'],
      en: ['The boat\u2019s 3 × 2 m LED screen shows the NEON NIGHT graphic', 'Violet neon frame around the screen, pink line along the stage front', '8 beam lights into the sky and 8 PAR lights on the deck beside the stage', 'Two NEON NIGHT neon signs beside the screen']},
    cam: {p: [3.5, 7.4, 3.2], t: [16.2, 6.1, 0]}, pin: [16.6, 7.6, 0]},
  {id: 'bow', img: '07_bow-deck-gold-backdrop', dot: '#D9A85A', seats: 48,
    name: {th: 'หัวเรือชั้น 2 · ผนังถ่ายรูป', en: 'Bow deck · photo wall'},
    sub: {th: 'ลานเปิดหน้าห้อง VIP', en: 'Open deck in front of the VIP room'},
    items: {th: ['ผนังถ่ายรูปชิมเมอร์ทอง 4×2 ม. ป้ายนีออน "Neon Night 2027"', 'คริสตัลเรืองแสงข้างละ 3 ชิ้น', 'ไฟส่องผนังและไฟส่องหน้า ให้ภาพถ่ายสวย', '48 ที่นั่งรับลมริมแม่น้ำ โคมไฟเรืองแสงทุกโต๊ะ'],
      en: ['4 × 2 m gold shimmer photo wall with a "Neon Night 2027" neon sign', 'Three glowing crystals on each side', 'Wall and face lighting set for good photos', '48 seats in the river breeze, a glowing lamp on every table']},
    cam: {p: [27.5, 5.0, 5.5], t: [17.6, 3.4, 0]}, pin: [17.3, 5.0, 0]},
  {id: 'l2', img: '02_L2-VIP-dining', dot: '#FF2E88', seats: 200,
    name: {th: 'ห้องอาหารชั้น 2 (VIP)', en: 'Deck 2 dining room (VIP)'},
    sub: {th: 'ห้องแอร์', en: 'Air-conditioned'},
    items: {th: ['นีออนชมพูตามขอบกระจกทั้งสองฝั่ง', 'ไฟฝ้าของเรือเป็นโทนชมพูและม่วง', 'จอ LED แสดงกราฟิก NEON NIGHT พร้อมกรอบนีออนม่วง', 'ทุกโต๊ะ: โคมไฟตั้งโต๊ะเรืองแสงหลากสี ผ้ารันเนอร์ดำ เทียน LED', 'ไฟส่องผนังตามเสา และป้ายนีออน NEON NIGHT 2 ป้าย'],
      en: ['Pink neon along the windows on both sides', 'The boat\u2019s ceiling light in pink and violet', 'LED screen with the NEON NIGHT graphic and a violet neon frame', 'Every table: glowing colour table lamp, black runner, LED candle', 'Uplights at the pillars and two NEON NIGHT neon signs']},
    cam: {p: [-8, 15.5, 15], t: [-2, 3.0, 0]}, pin: [-6, 4.6, -6.3], cut: 'l2'},
  {id: 'l1', img: '01_L1-aircon-dining', dot: '#00E5FF', seats: 160,
    name: {th: 'ห้องอาหารชั้น 1', en: 'Deck 1 dining room'},
    sub: {th: 'ห้องแอร์ พร้อมบุฟเฟ่ต์', en: 'Air-conditioned, with buffet'},
    items: {th: ['นีออนฟ้าตามขอบกระจกทั้งสองฝั่ง', 'ขอบเคาน์เตอร์บุฟเฟ่ต์เป็นเส้นไฟฟ้า', 'จอ LED แสดงกราฟิก NEON NIGHT พร้อมกรอบนีออนม่วง', 'ทุกโต๊ะ: โคมไฟตั้งโต๊ะเรืองแสงหลากสี ผ้ารันเนอร์ดำ เทียน LED', 'ไฟส่องผนังตามเสา และป้ายนีออน NEON NIGHT 2 ป้าย'],
      en: ['Cyan neon along the windows on both sides', 'Lit cyan edge on the buffet counter', 'LED screen with the NEON NIGHT graphic and a violet neon frame', 'Every table: glowing colour table lamp, black runner, LED candle', 'Uplights at the pillars and two NEON NIGHT neon signs']},
    cam: {p: [-2, 12.5, 13.5], t: [4, 0.8, 0]}, pin: [6, 2.3, 6.4], cut: 'l1'},
];
const OVERVIEW = {p: [-40, 22, 44], t: [-1, 3, 0]};
const STEPS = {
  th: [['เช็คอิน', 'เอเชียทีค ระหว่างโกดัง 2 และ 3'], ['เดินลอดซุ้มนีออน', 'พรมดำขอบไฟ ไปถึงสะพานขึ้นเรือ'], ['ขึ้นเรือ เข้าที่นั่ง', 'ดาดฟ้า หัวเรือ หรือห้องแอร์ชั้น 1 และ 2'], ['ถ่ายรูปที่ผนังทอง', 'หัวเรือชั้น 2'], ['ล่องชมวิว', 'วัดอรุณ พระบรมมหาราชวัง สะพานพระราม 8']],
  en: [['Check in', 'Asiatique, between warehouses 2 and 3'], ['Walk through the neon arch', 'Lit black carpet to the gangway'], ['Board and take your seat', 'Rooftop, bow deck or the deck 1 and 2 rooms'], ['Photo at the gold wall', 'Bow deck, deck 2'], ['Cruise the river', 'Wat Arun, the Grand Palace, Rama VIII Bridge']],
};

/* ------------------------------------------------------------------ UI */
let lang = localStorage.getItem('nn-lang') || 'th';
let current = null;
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));

function renderText() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-t]').forEach(el => { const v = T[lang][el.dataset.t]; if (typeof v === 'string') el.textContent = v; });
  document.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.lang === lang));
  $('#plist').innerHTML = PLACES.map(p => `<button data-id="${p.id}" class="${current === p.id ? 'on' : ''}"><svg viewBox="0 0 24 24">${ICON[p.id]}</svg><span>${esc(p.name[lang])}<small>${esc(p.seats ? T[lang].seats(p.seats) : p.sub[lang])}</small></span></button>`).join('');
  $('#pgrid').innerHTML = PLACES.map(p => `<button class="pc card" data-id="${p.id}"><img loading="lazy" src="assets/img/${p.img}-s.jpg" alt="" width="720" height="402"><div class="b"><h3>${esc(p.name[lang])}</h3><div class="meta">${esc(p.seats ? T[lang].seats(p.seats) : p.sub[lang])}</div><ul style="--dot:${p.dot}">${p.items[lang].slice(0, 3).map(i => `<li>${esc(i)}</li>`).join('')}</ul></div></button>`).join('');
  $('#steps').innerHTML = STEPS[lang].map(([a, b]) => `<li><b>${esc(a)}</b><span>${esc(b)}</span></li>`).join('');
  $('#pins').innerHTML = PLACES.filter(p => p.pin).map(p => `<button class="pin" data-id="${p.id}">${esc(p.name[lang])}</button>`).join('');
  renderDetail();
  const hi = $('.hero-img'); hi.dataset.cap = T[lang].cap_ext;
}
function renderDetail() {
  const p = PLACES.find(x => x.id === current) || PLACES[0];
  $('#detail').innerHTML = `<button class="ph zoomable" data-src="assets/img/${p.img}.jpg" data-cap="${esc(p.name[lang])}"><img src="assets/img/${p.img}-s.jpg" alt="" width="720" height="402"></button>
    <div><h3>${esc(p.name[lang])}</h3>${p.seats ? `<span class="seats">${esc(T[lang].seats(p.seats))}</span>` : `<span class="seats">${esc(p.sub[lang])}</span>`}
    <ul style="--dot:${p.dot}">${p.items[lang].map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`;
}
document.addEventListener('click', e => {
  const lb = e.target.closest('.lang button'); if (lb) { lang = lb.dataset.lang; localStorage.setItem('nn-lang', lang); renderText(); return; }
  const pl = e.target.closest('#plist button, .pin'); if (pl) { go(pl.dataset.id); return; }
  const pc = e.target.closest('.pc'); if (pc) { $('#tour').scrollIntoView({behavior: 'smooth'}); go(pc.dataset.id); return; }
  const z = e.target.closest('.zoomable'); if (z) { const box = $('#lb'); box.querySelector('img').src = z.dataset.src; box.querySelector('p').textContent = z.dataset.cap || ''; box.hidden = false; return; }
  if (e.target.closest('#lb')) $('#lb').hidden = true;
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') $('#lb').hidden = true; });
current = null;
renderText();

/* ------------------------------------------------------------------ 3D */
const canvas = $('#c3d'), viewer = $('#viewer');
const renderer = new THREE.WebGLRenderer({canvas, antialias: true, powerPreference: 'high-performance'});
const DPR = Math.min(window.devicePixelRatio || 1, 1.75);
renderer.setPixelRatio(DPR);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.85;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05070f);
scene.fog = new THREE.FogExp2(0x070815, 0.0032);
const pmrem = new THREE.PMREMGenerator(renderer);
const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environment = envTex;
scene.environmentIntensity = 0.12;

const camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.1, 2000);
camera.position.set(...OVERVIEW.p);
const controls = new OrbitControls(camera, canvas);
controls.target.set(...OVERVIEW.t);
controls.enableDamping = true; controls.dampingFactor = 0.08;
controls.minDistance = 2.5; controls.maxDistance = 150;
controls.maxPolarAngle = Math.PI * 0.495;
controls.screenSpacePanning = true;
controls.zoomToCursor = true;

/* sky dome: city-glow horizon + stars */
const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 48, 24), new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, fog: false,
  uniforms: {},
  vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `varying vec3 vP;
    float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,45.164)))*43758.5453); }
    void main(){ float y = max(vP.y, 0.);
      vec3 col = mix(vec3(0.10,0.06,0.20), vec3(0.008,0.012,0.035), pow(y, .45));
      col += vec3(0.16,0.06,0.16) * exp(-y*14.) * .25;
      vec3 q = floor(vP*300.); float s = step(.9992, h(q)) * smoothstep(.15,.5,y);
      col += vec3(.75,.8,1.) * s * .5;
      gl_FragColor = vec4(col,1.); }`,
}));
scene.add(sky);

/* water: reflective river */
const water = new Reflector(new THREE.PlaneGeometry(1400, 1400), {
  textureWidth: 1024, textureHeight: 1024, clipBias: 0.002, color: 0xffffff,
  shader: {
    name: 'RiverShader',
    uniforms: {color: {value: null}, tDiffuse: {value: null}, textureMatrix: {value: null}, time: {value: 0}},
    vertexShader: `uniform mat4 textureMatrix; varying vec4 vUv; varying vec3 vW;
      #include <common>
      #include <logdepthbuf_pars_vertex>
      void main(){ vUv = textureMatrix*vec4(position,1.); vW = (modelMatrix*vec4(position,1.)).xyz;
        gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.);
        #include <logdepthbuf_vertex>
      }`,
    fragmentShader: `uniform sampler2D tDiffuse; uniform float time; varying vec4 vUv; varying vec3 vW;
      #include <logdepthbuf_pars_fragment>
      float w(vec2 p){ return sin(p.x*1.1+time*.9)*cos(p.y*1.6-time*.7) + .6*sin(p.x*2.7-p.y*2.1+time*1.3) + .35*sin(p.y*5.3+p.x*.7-time*1.9); }
      void main(){
        #include <logdepthbuf_fragment>
        vec2 d = vec2(w(vW.xz*.8), w(vW.zx*.9+7.)) * .007;
        vec4 uv = vUv; uv.xy += d * uv.w;
        vec3 r = texture2DProj(tDiffuse, uv).rgb;
        vec3 V = normalize(cameraPosition - vW);
        float f = .18 + .82*pow(1. - max(V.y, 0.), 4.);
        float dist = length(cameraPosition.xz - vW.xz);
        vec3 base = vec3(.004,.008,.016);
        vec3 col = base + r * f * .75;
        col = mix(col, vec3(.04,.04,.09), smoothstep(120., 520., dist));
        gl_FragColor = vec4(col, 1.);
      }`,
  },
});
water.rotation.x = -Math.PI / 2;
water.position.y = 0.0;
scene.add(water);

/* light */
scene.add(new THREE.HemisphereLight(0x4a5a90, 0x05060a, 0.7));
const moon = new THREE.DirectionalLight(0x9fb4ff, 0.35); moon.position.set(-40, 60, 30); scene.add(moon);
function pl(c, i, d, x, y, z) { const l = new THREE.PointLight(c, i * 0.45, d, 2); l.position.set(x, y, z); scene.add(l); return l; }
const PINK = 0xff2e88, CYAN = 0x00e5ff, VIO = 0xa855f7, WARM = 0xffc27a;
// rooftop wash from the rail neon
[-22, -10, 2, 13].forEach((x, i) => { pl(i % 2 ? CYAN : PINK, 26, 13, x, 6.4, 4.6); pl(i % 2 ? PINK : CYAN, 26, 13, x + 4, 6.4, -4.6); });
// stage: PAR wash + screen glow
pl(VIO, 60, 10, 14.6, 5.6, 2.3); pl(PINK, 60, 10, 14.6, 5.6, -2.3); pl(0x7a5cff, 45, 9, 15.6, 6.4, 0);
// table lamps on the rooftop (warm)
pl(WARM, 18, 12, -12, 6.0, 0); pl(WARM, 18, 12, 2, 6.0, 0);
// rooms
[-16, -4, 8].forEach(x => pl(0xd060ff, 14, 9, x, 4.4, 0));
[-2, 8].forEach(x => pl(0x40a0ff, 12, 9, x, 2.1, 0)); pl(0xff70c0, 8, 7, 14, 2.0, 0);
// bow photo wall
pl(0xffd9a0, 30, 7, 20.2, 3.6, 0); pl(PINK, 10, 5, 18, 3.4, 2.6); pl(CYAN, 10, 5, 18, 3.4, -2.6);
// pier
pl(PINK, 22, 8, -9.8, 3.0, 12.0); pl(WARM, 26, 14, -15, 3.4, 9.0); pl(WARM, 26, 14, -3, 3.4, 9.0); pl(CYAN, 12, 6, -9.8, 1.4, 10.2); pl(0xc8a6ff, 10, 6, -13, 1.2, 11.5); pl(PINK, 12, 6, -6.6, 1.8, 11.5);

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
  I_ChairNavy: phys({color: 0x1b2a55, roughness: .9, sheen: 1, sheenColor: 0x6d7bd6, sheenRoughness: .4}),
  I_Velvet: phys({color: 0x1a2457, roughness: .9, sheen: 1, sheenColor: 0x8090ff, sheenRoughness: .35}),
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
  Lamp_pink: neon(0xff4fa8, 1.5), Lamp_violet: neon(0xb36bff, 1.6), Lamp_white: neon(0xf2e8ff, 1.0), Lamp_cyan: neon(0x38e6ff, 1.4), Lamp_coral: neon(0xff7a6b, 1.4),
  Lamp_Base: std({color: 0xeeeeea, roughness: .4}),
  Portal_Navy: phys({color: 0x161a3e, roughness: .45, clearcoat: .4}), Portal_Slat: neon(0xd9ccff, 0.9),
  Plant_Green: std({color: 0x3f9a58, emissive: 0x1c4d29, emissiveIntensity: .6, roughness: .7}),
  Planter_Glow: neon(0xc8a6ff, 1.0), Planter_Frame: neon(0xf4ecff, 1.3),
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

/* beams: 8 moving-head beams into the sky */
const beamMat = (c) => new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
  uniforms: {c: {value: new THREE.Color(c)}},
  vertexShader: `varying float vY; varying vec3 vN; varying vec3 vV; void main(){ vY = position.y; vec4 w = modelMatrix*vec4(position,1.); vN = normalize(mat3(modelMatrix)*normal); vV = normalize(cameraPosition - w.xyz); gl_Position = projectionMatrix*viewMatrix*w; }`,
  fragmentShader: `uniform vec3 c; varying float vY; varying vec3 vN; varying vec3 vV;
    void main(){ float a = pow(1. - clamp(vY/34., 0., 1.), 2.2) * .13; float e = pow(abs(dot(vN, vV)), 1.5); gl_FragColor = vec4(c * a * e, 1.); }`,
});
const beams = [];
const beamGeo = new THREE.CylinderGeometry(0.05, 1.5, 34, 24, 1, true).translate(0, 17, 0);
[[15.25, -2.45], [15.55, -2.45], [15.25, -2.15], [15.55, -2.15], [15.25, 2.15], [15.55, 2.15], [15.25, 2.45], [15.55, 2.45]].forEach(([x, by], i) => {
  const m = new THREE.Mesh(beamGeo, beamMat(i % 2 ? CYAN : PINK)); m.position.set(x, 5.5, -by); m.renderOrder = 5; m.userData.k = i; scene.add(m); beams.push(m);
});

/* post */
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.5, 0.35, 0.9);
composer.addPass(bloom);
composer.addPass(new OutputPass());

/* model */
const zones = {l1: [], l2: [], roofHide: [], roof: []};
const draco = new DRACOLoader().setDecoderPath('vendor/three/draco/');
const loader = new GLTFLoader().setDRACOLoader(draco);
loader.load('assets/boat.glb', g => {
  const root = g.scene;
  root.traverse(o => {
    if (!o.isMesh) return;
    const name = o.name || '', ud = o.userData || {};
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    const nm = mats.map(m => {
      const key = (m.name || '').replace(/\.\d+$/, '');
      if (key === 'LED_Screen') {          // remap world-metre UVs to 0..1 across the face
        const pos = o.geometry.attributes.position, uv = o.geometry.attributes.uv; o.geometry.computeBoundingBox();
        const bb = o.geometry.boundingBox, sx = bb.max.x - bb.min.x, sz = bb.max.z - bb.min.z, sy = bb.max.y - bb.min.y;
        for (let i = 0; i < pos.count; i++) {
          const a = sz >= sx ? (bb.max.z - pos.getZ(i)) / (sz || 1) : (pos.getX(i) - bb.min.x) / (sx || 1);
          uv.setXY(i, sz >= sx ? 1 - a : a, (pos.getY(i) - bb.min.y) / (sy || 1));
        }
        uv.needsUpdate = true;
      }
      return MAT[key] || m;
    });
    o.material = Array.isArray(o.material) ? nm : nm[0];
    if (/^LED_Content_|^Boat_LED_Face/.test(name) && !/^Boat_LED_Face/.test(name)) o.visible = false;
    if (/^Boat_LED_Face/.test(name)) o.material = MAT.LED_Screen;
    const z = ud.zone;
    if (z === 'roof' || /^Rooftop_|Boat_LED|Boat_Stage|Boat_Chairs|Boat_Tables|TIME_Neon_Rooftop|TIME_TableLamp_Roof|TIME_Neon_Fascia|TIME_Beam|TIME_Par|TIME_Fixture|Stair_/.test(name)) zones.roof.push(o);
    if (/^L2_(Walls|Glass|Mullions|RakedFront|FrontGlass)|^Rooftop_Slab|^Rooftop_Fascia|^Interior_L2_CeilWash|^Sign_|^Life_Rings/.test(name)) zones.roofHide.push(o);
    if (/^L1_(Walls|Glass|Mullions|Portholes|Door)|^L2_DeckSlab|^L2_CabinFloor|^Interior_L1_CeilWhite|^TIME_L1_CoveBlue|^TIME_L1_StripWhite|^Hull_RubRail|^TIME_Neon_L2_SlabEdge|^Boat_GoldLED_L2/.test(name)) zones.l1.push(o);
    if (/^TIME_TableLamp_L2/.test(name)) zones.l1.push(o);
    if (/^Interior_L2|^TIME_L2_|^L2_Stern_Bench|^TIME_TableLamp_L2/.test(name) && !/CeilWash|PanelRed|TIME_L2_PanelGlass/.test(name)) zones.l2.push(o);
  });
  scene.add(root);
  $('#vload').classList.add('done');
  current ? go(current, true) : flyTo(OVERVIEW, true);
}, e => { if (e.total) { const p = Math.round(e.loaded / e.total * 100); $('#vpct').textContent = p + '%'; $('#vprog').value = p; } },
() => { $('#vload div').textContent = 'The 3D view could not load.'; });

function setCut(mode) {
  // l2 = remove rooftop + upper walls (see the deck 2 room); l1 = also remove deck 2 (see the deck 1 room)
  const hideRoof = mode === 'l2' || mode === 'l1';
  zones.roof.forEach(o => o.visible = !hideRoof);
  zones.roofHide.forEach(o => o.visible = !hideRoof);
  zones.l2.forEach(o => o.visible = mode !== 'l1');
  zones.l1.forEach(o => o.visible = mode !== 'l1');
  beams.forEach(b => b.visible = !hideRoof);
}

/* camera moves */
let tween = null;
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
function flyTo(cam, instant) {
  const p1 = new THREE.Vector3(...cam.p), t1 = new THREE.Vector3(...cam.t);
  if (instant) { camera.position.copy(p1); controls.target.copy(t1); controls.update(); return; }
  tween = {p0: camera.position.clone(), t0: controls.target.clone(), p1, t1, s: performance.now(), d: 1400};
}
function go(id, instant) {
  current = id;
  const p = PLACES.find(x => x.id === id);
  document.querySelectorAll('#plist button').forEach(b => b.classList.toggle('on', b.dataset.id === id));
  renderDetail();
  setCut(p.cut || '');
  flyTo(p.cam, instant);
}
$('#zin').onclick = () => dolly(0.75); $('#zout').onclick = () => dolly(1.33);
$('#zreset').onclick = () => { setCut(''); flyTo(OVERVIEW); current = null; document.querySelectorAll('#plist button').forEach(b => b.classList.remove('on')); };
$('#zfull').onclick = () => { if (document.fullscreenElement) document.exitFullscreen(); else viewer.requestFullscreen?.(); };
function dolly(k) { const d = camera.position.clone().sub(controls.target); const L = THREE.MathUtils.clamp(d.length() * k, controls.minDistance, controls.maxDistance); tween = {p0: camera.position.clone(), t0: controls.target.clone(), p1: controls.target.clone().add(d.setLength(L)), t1: controls.target.clone(), s: performance.now(), d: 450}; }
controls.addEventListener('start', () => { tween = null; });

/* pins */
const pinV = new THREE.Vector3();
function placePins(w, h) {
  const placed = [];
  document.querySelectorAll('.pin').forEach(el => {
    const p = PLACES.find(x => x.id === el.dataset.id);
    pinV.set(...p.pin).project(camera);
    const vis = pinV.z < 1 && Math.abs(pinV.x) < 1.05 && Math.abs(pinV.y) < 1.05 && el.dataset.id !== current && !(current === 'l1' || current === 'l2' ? p.id !== 'l1' && p.id !== 'l2' : false);
    const x = (pinV.x + 1) / 2 * w, y = (1 - pinV.y) / 2 * h, bw = el.offsetWidth || 120;
    const clash = placed.some(q => Math.abs(q[0] - x) < (bw + q[2]) / 2 + 6 && Math.abs(q[1] - y) < 30);
    const show = vis && !clash && current === null;   // labels only on the overview; inside a zone the list + detail say where you are
    if (show) placed.push([x, y, bw]);
    el.classList.toggle('off', !show);
    el.style.left = x + 'px'; el.style.top = y + 'px';
  });
}

/* resize + loop */
function resize() {
  const w = viewer.clientWidth, h = viewer.clientHeight;
  renderer.setSize(w, h, false); composer.setSize(w, h); bloom.resolution.set(w / 2, h / 2);
  camera.aspect = w / h; camera.fov = w / h < 1 ? 58 : 42; camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(viewer); resize();
let visible = true;
new IntersectionObserver(es => { visible = es[0].isIntersecting; }, {rootMargin: '100px'}).observe(viewer);
const timer = new THREE.Timer();
renderer.setAnimationLoop(() => {
  if (!visible) return;
  timer.update(); const t = timer.getElapsed();
  if (tween) {
    const k = Math.min(1, (performance.now() - tween.s) / tween.d), e = ease(k);
    camera.position.lerpVectors(tween.p0, tween.p1, e); controls.target.lerpVectors(tween.t0, tween.t1, e);
    if (k >= 1) tween = null;
  }
  controls.update();
  water.material.uniforms.time.value = t;
  beams.forEach(b => { const k = b.userData.k; b.rotation.z = Math.sin(t * .45 + k * .8) * .38 * (k < 4 ? 1 : -1); b.rotation.x = Math.cos(t * .37 + k * 1.3) * .22; });
  composer.render();
  placePins(viewer.clientWidth, viewer.clientHeight);
  window.__READY__ = !$('#vload').classList.contains('done') ? false : true;
});
