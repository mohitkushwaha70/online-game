const API=window.location.origin;
let currentUser=null;let allGames=[];let currentGame=null;

// Colors
const C=['#FF6B35','#4ECDC4','#9B5DE5','#00BBF9','#F15BB5','#FEE440','#00F5D4','#7B2FF7','#FF006E','#3A86FF','#FF9F1C','#2EC4B6','#E71D36','#FF4365','#70D6FF','#C77DFF'];
function gc(s){let h=0;for(let i=0;i<s.length;i++)h=s.charCodeAt(i)+((h<<5)-h);return C[Math.abs(h)%C.length]}
function ac(h,a){let r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);r=Math.max(0,Math.min(255,r+a));g=Math.max(0,Math.min(255,g+a));b=Math.max(0,Math.min(255,b+a));return`#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`}
function thumb(n,c,w=273,h=153){const i=n.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();return`data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${c}"/><stop offset="100%" style="stop-color:${ac(c,-40)}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)" rx="8"/><text x="50%" y="40%" text-anchor="middle" dominant-baseline="middle" font-family="Nunito,Arial" font-size="34" font-weight="900" fill="rgba(255,255,255,.3)">${i}</text><text x="50%" y="68%" text-anchor="middle" dominant-baseline="middle" font-family="Nunito,Arial" font-size="12" font-weight="700" fill="rgba(255,255,255,.8)">${n.length>18?n.slice(0,16)+'...':n}</text></svg>`)}`}
function thumbP(n,c){return thumb(n,c,155,232)}

// Fetch helper
async function api(url){try{const r=await fetch(url);if(!r.ok)throw new Error();return await r.json()}catch{return null}}

// Auth
async function doLogin(email,password){const r=await fetch(`${API}/api/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});const d=await r.json();if(!r.ok)throw new Error(d.error);return d}
async function doSignup(name,email,password){const r=await fetch(`${API}/api/auth/register`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:name,email,password})});const d=await r.json();if(!r.ok)throw new Error(d.error);return d}
async function doGoogleLogin(){showToast('Google login simulated!','info');const r=await fetch(`${API}/api/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'admin@onlinegame.com',password:'admin123'})});const d=await r.json();setUser(d);closeAuth();return d}
function setUser(d){localStorage.setItem('ogToken',d.token);currentUser=d.user;updateUI()}
function logout(){localStorage.removeItem('ogToken');currentUser=null;updateUI();showToast('Logged out','info')}
async function checkAuth(){const t=localStorage.getItem('ogToken');if(!t)return;try{const r=await fetch(`${API}/api/auth/me`,{headers:{Authorization:`Bearer ${t}`}});if(!r.ok)throw new Error();const d=await r.json();currentUser=d.user;updateUI()}catch{localStorage.removeItem('ogToken')}}
function updateUI(){
  const btn=document.getElementById('userBtn');const label=document.getElementById('userBtnLabel');const dd=document.getElementById('userDropdown');const hdr=document.getElementById('userDropdownHeader');const admin=document.getElementById('dropdownAdmin');
  if(currentUser){label.textContent=currentUser.displayName||currentUser.username;hdr.textContent=`${currentUser.displayName||currentUser.username}\n${currentUser.email}`;admin.style.display=['admin','superadmin'].includes(currentUser.role)?'flex':'none'}
  else{label.textContent='Login';hdr.textContent='Guest';admin.style.display='none'}
  dd.classList.remove('open');
}

// Auth Modal
let authMode='login';
function openAuth(mode='login'){authMode=mode;const m=document.getElementById('authModal');m.classList.add('open');document.getElementById('authError').style.display='none';document.getElementById('authForm').reset();setAuthMode(mode)}
function closeAuth(){document.getElementById('authModal').classList.remove('open')}
function setAuthMode(mode){authMode=mode;const isLogin=mode==='login';document.getElementById('authTitle').textContent=isLogin?'Welcome Back':'Create Account';document.getElementById('authSubtitle').textContent=isLogin?'Sign in to continue playing':'Join the fun!';document.getElementById('tabLogin').classList.toggle('active',isLogin);document.getElementById('tabSignup').classList.toggle('active',!isLogin);document.getElementById('nameField').style.display=isLogin?'none':'block';document.getElementById('authSubmit').textContent=isLogin?'Login':'Sign Up'}
document.getElementById('tabLogin').onclick=()=>setAuthMode('login');
document.getElementById('tabSignup').onclick=()=>setAuthMode('signup');
document.getElementById('authClose').onclick=closeAuth;
document.getElementById('authBackdrop').onclick=closeAuth;
document.getElementById('googleBtn').onclick=doGoogleLogin;
document.getElementById('pwToggle').onclick=()=>{const i=document.getElementById('authPassword');i.type=i.type==='password'?'text':'password'};
document.getElementById('authForm').onsubmit=async e=>{
  e.preventDefault();const err=document.getElementById('authError');err.style.display='none';
  try{
    if(authMode==='login'){const d=await doLogin(document.getElementById('authEmail').value,document.getElementById('authPassword').value);setUser(d);showToast('Welcome back, '+d.user.username+'!')}
    else{const d=await doSignup(document.getElementById('authName').value,document.getElementById('authEmail').value,document.getElementById('authPassword').value);setUser(d);showToast('Account created! Welcome, '+d.user.username+'!')}
    closeAuth();
  }catch(ex){err.textContent=ex.message;err.style.display='block'}
};
document.getElementById('userBtn').onclick=()=>{if(!currentUser){openAuth();return}document.getElementById('userDropdown').classList.toggle('open')};
document.onclick=e=>{if(!e.target.closest('.header-right'))document.getElementById('userDropdown').classList.remove('open')};
document.getElementById('dropdownLogout').onclick=logout;

// Search
function openSearch(){document.getElementById('searchModal').classList.add('open');setTimeout(()=>document.getElementById('searchModalInput').focus(),100)}
function closeSearch(){document.getElementById('searchModal').classList.remove('open');document.getElementById('searchModalInput').value='';document.getElementById('searchResults').innerHTML=''}
document.getElementById('searchBar').onclick=openSearch;
document.getElementById('searchEsc').onclick=closeSearch;
document.getElementById('searchBackdrop').onclick=closeSearch;
document.onkeydown=e=>{if(e.key==='Escape'){closeSearch();closeAuth();closeGamePlay()}if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();openSearch()}};
document.getElementById('searchModalInput').oninput=e=>{
  const q=e.target.value.toLowerCase().trim();const r=document.getElementById('searchResults');
  if(!q){r.innerHTML='';return}
  const found=allGames.filter(g=>g.name.toLowerCase().includes(q)||g.category?.name?.toLowerCase().includes(q)).slice(0,8);
  if(!found.length){r.innerHTML='<div class="search-empty">No games found</div>';return}
  r.innerHTML=found.map(g=>{const c=g.color||gc(g.name);return`<div class="search-item" onclick="playGame('${g.slug}')"><img class="search-item-thumb" src="${thumb(g.name,c,56,32)}" alt="${g.name}"><div><div class="search-item-name">${g.name}</div><div class="search-item-cat">${g.category?.name||''}</div></div></div>`}).join('')
};

// Sidebar
document.getElementById('hamburgerBtn').onclick=()=>{document.getElementById('sidebar').classList.toggle('open');document.getElementById('sidebarOverlay').classList.toggle('active')};
document.getElementById('sidebarOverlay').onclick=()=>{document.getElementById('sidebar').classList.remove('open');document.getElementById('sidebarOverlay').classList.remove('active')};
document.querySelectorAll('.sidebar-link[data-nav]').forEach(l=>l.onclick=e=>{e.preventDefault();document.querySelectorAll('.sidebar-link').forEach(x=>x.classList.remove('active'));l.classList.add('active');document.getElementById('sidebar').classList.remove('open');document.getElementById('sidebarOverlay').classList.remove('active')});

// Game Play
function openGamePlay(game){
  currentGame=game;const m=document.getElementById('gameModal');m.classList.add('open');
  document.getElementById('gamePlayTitle').textContent=game.name;
  document.getElementById('gamePlayCategory').textContent=game.category?.name||'';
  document.getElementById('gamePlayPlays').textContent=fmtN(game.totalPlays)+' plays';
  document.getElementById('likeCount').textContent=fmtN(game.totalLikes);
  document.getElementById('gamePlaceholder').style.display='flex';
  document.getElementById('gameIframe').style.display='none';
  document.getElementById('gamePlaceholder').onclick=()=>{
    if(game.embedUrl){document.getElementById('gameIframe').src=game.embedUrl}
    document.getElementById('gamePlaceholder').style.display='none';
    document.getElementById('gameIframe').style.display='block';
  };
  fetch(`${API}/api/games/${game.slug}/play`,{method:'POST'}).catch(()=>{});
}
function closeGamePlay(){document.getElementById('gameModal').classList.remove('open');document.getElementById('gameIframe').src='';currentGame=null}
document.getElementById('gameClose').onclick=closeGamePlay;
document.getElementById('gameBackdrop').onclick=closeGamePlay;
window.playGame=async slug=>{
  closeSearch();
  const d=await api(`${API}/api/games/${slug}`);
  if(d?.game)openGamePlay(d.game);
};
document.getElementById('likeBtn').onclick=async()=>{
  if(!currentUser){openAuth();return}
  if(!currentGame)return;
  try{const r=await fetch(`${API}/api/games/${currentGame.slug}/like`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${localStorage.getItem('ogToken')}`}});const d=await r.json();if(d.totalLikes){document.getElementById('likeCount').textContent=fmtN(d.totalLikes);showToast('Liked!','success')}}catch{showToast('Already liked','info')}
};
document.getElementById('shareBtn').onclick=()=>{
  if(navigator.share)navigator.share({title:currentGame?.name||'Online Game',url:window.location.href});
  else{navigator.clipboard.writeText(window.location.href);showToast('Link copied!','success')}
};
document.getElementById('fullscreenBtn').onclick=()=>{
  const f=document.getElementById('gameIframe');if(f.requestFullscreen)f.requestFullscreen();else if(f.webkitRequestFullscreen)f.webkitRequestFullscreen();
};

// Helpers
function fmtN(n){if(n>=1e6)return(n/1e6).toFixed(1)+'M';if(n>=1e3)return(n/1e3).toFixed(1)+'K';return n.toString()}
function showToast(msg,type='success'){const t=document.createElement('div');t.className=`toast toast-${type}`;t.textContent=msg;document.getElementById('toastContainer').appendChild(t);setTimeout(()=>t.remove(),3000)}
function badgeHTML(labels){if(!labels?.length)return'';const m={hot:'🔥 Hot',new:'✨ New',top:'⭐ Top',originals:'⭐ OG',updated:'🔄 Up'};if(labels.length===1)return`<div class="game-badge badge-${labels[0]}">${m[labels[0]]||''}</div>`;return`<div class="game-badges">${labels.map(l=>`<div class="game-badge badge-${l}">${m[l]||''}</div>`).join('')}</div>`}

// Build page
async function buildPage(){
  const w=document.getElementById('contentWrapper');
  const sections=[
    {id:'featured',title:'Featured games',api:'/api/games/featured'},
    {id:'originals',title:'Online Game Originals',api:'/api/games/originals',portrait:true},
    {id:'premium',title:"Can't stop playing",api:'/api/games?isPremium=true&sort=-totalPlays&limit=12'},
    {id:'leaderboard',title:'Leaderboards',api:'/api/games/trending',lb:true},
    {id:'driving',title:'Driving Games',api:'/api/games?category=driving&limit=10'},
    {id:'shooting',title:'Shooting Games',api:'/api/games?category=shooting&limit=10'},
    {id:'sports',title:'Sports Games',api:'/api/games?category=sports&limit=10'},
    {id:'simulation',title:'Simulation Games',api:'/api/games?category=simulation&limit=10'},
    {id:'arcade',title:'Arcade Games',api:'/api/games?category=arcade&limit=10'},
    {id:'puzzle',title:'Puzzle Games',api:'/api/games?category=puzzle&limit=10'},
    {id:'action',title:'Action Games',api:'/api/games?category=action&limit=10'},
    {id:'io',title:'.io Games',api:'/api/games?category=io&limit=10'},
  ];
  let html='';
  for(const s of sections){
    if(s.lb){
      html+=`<section class="carousel"><div class="carousel-head"><div class="lb-header" style="width:100%"><div class="lb-info"><div class="lb-icon"><svg width="44" height="44" viewBox="0 0 24 24" fill="none"><rect x="2" y="10" width="4" height="12" rx="1" fill="#FFD700"/><rect x="10" y="4" width="4" height="18" rx="1" fill="#C0C0C0"/><rect x="18" y="8" width="4" height="14" rx="1" fill="#CD7F32"/></svg></div><div><h2 class="carousel-title">${s.title}</h2><div class="lb-meta"><span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>1,234 participants</span><span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Ends in 3d 12h</span></div></div></div></div></div><div class="carousel-wrap"><ul class="carousel-track" id="c-${s.id}"></ul><button class="carousel-arrow r" data-c="c-${s.id}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F9FAFF" stroke-width="2.5" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg></button></div></section>`;
    } else {
      html+=`<section class="carousel${s.portrait?' originals-section':''}"><div class="carousel-head"><h2 class="carousel-title">${s.title}</h2><a href="#" class="carousel-more">View more</a></div><div class="carousel-wrap"><ul class="carousel-track${s.portrait?' originals-track':''}" id="c-${s.id}"></ul><button class="carousel-arrow r" data-c="c-${s.id}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F9FAFF" stroke-width="2.5" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg></button></div></section>`;
    }
  }
  html+=`<section class="seo-grid" id="seoGrid"></section>`;
  html+=`<div class="seo-content"><h1>Free Online Games</h1><p>Welcome to the best source for free online games. On Online Game, you can play the best free online games directly in your browser. No downloads, no ads. We have a huge selection of games including action, adventure, puzzle, racing, shooting, sports, strategy, and more.</p><h2>Play Instantly</h2><p>All of our games load instantly in your browser and work on desktop, tablet, and mobile devices. Simply choose a game and start playing right away. No registration required.</p><h2>New Games Added Daily</h2><p>We add new games every day so there is always something fresh to play. Our team curates the best games from developers around the world, ensuring quality and fun for everyone.</p></div>`;
  w.innerHTML=html;

  // Populate carousels
  for(const s of sections){
    const d=await api(`${API}${s.api}`);const games=d?.games||[];
    games.forEach(g=>allGames.find(x=>x.slug===g.slug)||allGames.push(g));
    const track=document.getElementById(`c-${s.id}`);if(!track)continue;
    games.forEach(g=>{
      const c=g.color||gc(g.name);const li=document.createElement('li');li.className='game-card'+(s.portrait?' originals-card':'');
      li.innerHTML=`<a onclick="playGame('${g.slug}')">${badgeHTML(g.labels)}<img class="game-card-img" src="${s.portrait?thumbP(g.name,c):thumb(g.name,c)}" alt="${g.name}" loading="lazy"><div class="game-card-title">${g.name}</div><div class="game-card-overlay"></div></a>`;
      track.appendChild(li);
    });
  }

  // SEO grid
  const cd=await api(`${API}/api/categories`);
  const sg=document.getElementById('seoGrid');
  if(cd?.categories&&sg){cd.categories.forEach(c=>{const d=document.createElement('div');d.className='seo-card';d.innerHTML=`<img class="seo-card-icon" src="${thumb(c.name,c.color,35,35)}" alt="${c.name}"><div class="seo-card-label">${c.name}</div>`;d.onclick=()=>showToast(`${c.name} category`);sg.appendChild(d)})}

  // Category sidebar
  const cn=document.getElementById('categoryNav');
  if(cd?.categories&&cn){
    cn.innerHTML=cd.categories.slice(0,16).map(c=>`<a href="#" class="sidebar-link" data-nav="${c.slug}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg><span>${c.name}</span></a>`).join('');
    cn.querySelectorAll('.sidebar-link').forEach(l=>l.onclick=e=>{e.preventDefault();document.querySelectorAll('.sidebar-link').forEach(x=>x.classList.remove('active'));l.classList.add('active')});
  }

  // Carousel arrows
  document.querySelectorAll('.carousel-arrow').forEach(b=>b.onclick=()=>{const t=document.getElementById(b.dataset.c);if(t)t.scrollBy({left:320,behavior:'smooth'})});
}

// Init
document.addEventListener('DOMContentLoaded',async()=>{
  checkAuth();
  await buildPage();
  window.addEventListener('scroll',()=>{const h=document.getElementById('header');h.style.borderBottomColor=window.scrollY>50?'rgba(47,49,72,.6)':'rgba(47,49,72,.5)'});
});
