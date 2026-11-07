const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const ic=n=>`<svg class="i"><use href="/assets/icons.svg#${n}"/></svg>`;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe=u=>/^https?:\/\//i.test(u||'')?u:'#';
const LOGO='https://cdn.apiz2z.web.id/cdn/46adf244baa02448e7d6b8ba4d1d957f.jpg';
const DEF={botName:'Roxy AI',dev:'Yann',store:{label:'Website Terkait',url:'https://ys-digital.store'},api:{label:'Web REST API',url:'https://apiz2z.web.id'},channels:[{name:'Saluran Bot',url:'https://whatsapp.com/channel/0029VbCBj0N3LdQTosP3Hj0T'}],groups:[{name:'Grup Bot',url:'https://chat.whatsapp.com/Ge8JHVR49BR1ecpzqvg67x'}],owners:[{label:'WhatsApp 1',wa:'6285282426298'},{label:'WhatsApp 2',wa:'628135779643'}],telegram:'yannz2z',tiktok:'YannAjah'};
async function getConfig(){try{const r=await fetch('/data/config.json',{cache:'no-store'});if(r.ok)return Object.assign({},DEF,await r.json())}catch(e){}return DEF}
function say(t){let el=$('#toast');if(!el){el=document.createElement('div');el.id='toast';el.className='toast';document.body.appendChild(el)}el.textContent=t;el.classList.add('show');clearTimeout(say.t);say.t=setTimeout(()=>el.classList.remove('show'),2000)}

function buildHeader(c){
 const P=location.pathname.replace(/index\.html$/,'');
 const on=p=>(p==='/'?P==='/':P.indexOf(p)===0)?' on':'';
 const links=[[c.store.label,c.store.url,'Webstore','bag'],[c.api.label,c.api.url,'Web endpoint','code']]
  .concat(c.channels.map(x=>[x.name,x.url,'Saluran bot','bell']),c.groups.map(x=>[x.name,x.url,'Grup bot','users']));
 const fit=MENUS.map((m,i)=>`<a href="/fitur/?m=${i}">${esc(m[0])}</a>`).join('');
 const ln=links.map(l=>`<a href="${esc(safe(l[1]))}" target="_blank" rel="noopener">${ic(l[3])}<span>${esc(l[0])}<small>${l[2]}</small></span></a>`).join('');
 const w=String(c.botName).trim().split(/\s+/),first=w.shift(),rest=w.join(' ');
 $('#hdr').innerHTML=`<header><div class="wrap"><a href="/" class="brand"><img src="${LOGO}" alt="Logo ${esc(c.botName)}"><span>${esc(first)}${rest?` <b>${esc(rest)}</b>`:''}</span></a>
 <button class="burger" id="burger" aria-label="Buka menu" aria-expanded="false">${ic('menu')}</button>
 <nav id="nav">
  <div class="nl"><a href="/" class="${on('/').trim()}">${ic('home')}Home</a></div>
  <div class="nl"><button type="button" class="${on('/fitur').trim()}">${ic('grid')}Fitur${ic('down')}</button><div class="dd cartoon grid2"><a class="all" href="/fitur/">Semua fitur</a>${fit}</div></div>
  <div class="nl"><button type="button" class="${on('/terkait').trim()}">${ic('link')}Terkait${ic('down')}</button><div class="dd cartoon">${ln}<a href="/terkait/">${ic('arrow')}<span>Semua tautan</span></a></div></div>
  <div class="nl"><a href="/developer/" class="${on('/developer').trim()}">${ic('user')}Developer</a></div>
 </nav></div></header>`;
 const nav=$('#nav'),bg=$('#burger');
 bg.onclick=()=>{const o=nav.classList.toggle('open');bg.setAttribute('aria-expanded',o);bg.innerHTML=ic(o?'close':'menu')};
 $$('.nl>button').forEach(b=>b.onclick=e=>{e.stopPropagation();const p=b.parentElement,o=p.classList.contains('open');$$('.nl.open').forEach(n=>n.classList.remove('open'));if(!o)p.classList.add('open')});
 document.addEventListener('click',e=>{if(!e.target.closest('.nl'))$$('.nl.open').forEach(n=>n.classList.remove('open'))});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){$$('.nl.open').forEach(n=>n.classList.remove('open'));closeM()}});
}
function buildFooter(c){
 $('#ftr').innerHTML=`<footer><div class="wrap"><p>&copy; 2025-2026 <b>${esc(c.botName)}</b> by ${esc(c.dev)}. Semua hak dilindungi.</p><p style="font-size:.85rem;margin-top:4px">yannaimd.my.id</p></div></footer><button class="top" id="top" aria-label="Kembali ke atas">${ic('up')}</button>`;
 const t=$('#top');addEventListener('scroll',()=>t.classList.toggle('show',scrollY>500),{passive:true});t.onclick=()=>scrollTo({top:0});
}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-copy]');if(!b)return;
 try{await navigator.clipboard.writeText(b.dataset.copy)}catch(_){const t=document.createElement('textarea');t.value=b.dataset.copy;document.body.appendChild(t);t.select();try{document.execCommand('copy')}catch(__){}t.remove()}
 say('Tersalin: '+b.dataset.copy)});

let modal;
function openM(i,c){const m=MENUS[i];if(!m)return;$('#mT').textContent='Menu '+m[0];$('#mD').textContent=m[1];
 $('#mC').innerHTML=[m[2]].concat(m[3]).map(x=>'<span>.'+esc(x)+'</span>').join('');
 const wa=(c.owners[0]||{}).wa||'';$('#mB').href='https://wa.me/'+wa+'?text='+encodeURIComponent('.'+m[2]);
 modal.classList.add('open');document.body.style.overflow='hidden'}
function closeM(){if(modal){modal.classList.remove('open');document.body.style.overflow=''}}

const PAGES={
 home(c){
  const vc=$('#vchips');for(let i=1;i<=13;i++)vc.insertAdjacentHTML('beforeend',`<button class="chip" data-v="${i}">V${i}</button>`);
  vc.addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;$$('.chip',vc).forEach(x=>x.classList.remove('on'));b.classList.add('on');
   $('#vinfo').textContent='Menu V'+b.dataset.v+': '+VN[b.dataset.v-1]+' Ganti dengan perintah .setmenu v'+b.dataset.v});
 },
 fitur(c){
  const g=$('#fgrid');
  g.innerHTML=MENUS.map((m,i)=>`<button class="fc cartoon" data-i="${i}" data-n="${esc((m[0]+' '+m[1]).toLowerCase())}"><span class="ic">${ic(m[4])}</span><h4>Menu ${esc(m[0])}</h4><p>${esc(m[1])}</p><code>.${esc(m[2])}</code></button>`).join('');
  document.body.insertAdjacentHTML('beforeend',`<div class="modal" id="modal"><div class="box cartoon"><h3><span id="mT"></span><button class="x" id="mX" aria-label="Tutup">${ic('close')}</button></h3><p id="mD" style="color:var(--mute)"></p><div class="cmds" id="mC"></div><a class="btn sm" id="mB" href="#" target="_blank" rel="noopener">${ic('chat')}Coba di WhatsApp</a></div></div>`);
  modal=$('#modal');$('#mX').onclick=closeM;modal.addEventListener('click',e=>{if(e.target===modal)closeM()});
  g.addEventListener('click',e=>{const b=e.target.closest('.fc');if(b)openM(+b.dataset.i,c)});
  $('#q').addEventListener('input',e=>{const v=e.target.value.trim().toLowerCase();let n=0;$$('.fc').forEach(b=>{const s=b.dataset.n.includes(v);b.style.display=s?'':'none';if(s)n++});$('#empty').style.display=n?'none':'block'});
  const m=new URLSearchParams(location.search).get('m');if(m!==null&&MENUS[+m])setTimeout(()=>openM(+m,c),250);
 },
 terkait(c){
  const card=(i,t,d,u,go)=>`<a class="lc cartoon" href="${esc(safe(u))}" target="_blank" rel="noopener"><div class="ic">${ic(i)}</div><h4>${esc(t)}</h4><p>${esc(d)}</p><span class="go">${go}${ic('arrow')}</span></a>`;
  $('#lSite').innerHTML=card('bag',c.store.label,c.store.url+' (webstore)',c.store.url,'Kunjungi')+card('code',c.api.label,c.api.url+' (web endpoint)',c.api.url,'Kunjungi');
  $('#lCh').innerHTML=c.channels.length?c.channels.map(x=>card('bell',x.name,'Info update dan pengumuman terbaru.',x.url,'Ikuti saluran')).join(''):'<p class="sub">Belum ada saluran.</p>';
  $('#lGr').innerHTML=c.groups.length?c.groups.map(x=>card('users',x.name,'Ngobrol, tanya, dan main bareng member lain.',x.url,'Gabung grup')).join(''):'<p class="sub">Belum ada grup.</p>';
 },
 developer(c){
  const row=(i,l,v,a)=>`<div class="row"><span class="lab">${ic(i)}${esc(l)}</span><span class="val">${esc(v)}</span><span class="acts"><button class="mini" data-copy="${esc(v)}">${ic('copy')}Salin</button><a class="mini" href="${esc(a)}" target="_blank" rel="noopener">${ic('arrow')}Buka</a></span></div>`;
  let h=c.owners.map(o=>row('phone',o.label,o.wa,'https://wa.me/'+encodeURIComponent(o.wa))).join('');
  if(c.telegram)h+=row('send','Telegram','@'+c.telegram,'https://t.me/'+encodeURIComponent(c.telegram));
  if(c.tiktok)h+=row('video','TikTok','@'+c.tiktok,'https://www.tiktok.com/@'+encodeURIComponent(c.tiktok));
  $('#devRows').innerHTML=h;
 }
};
(async()=>{
 const c=await getConfig(),pg=document.body.dataset.page;
 buildHeader(c);buildFooter(c);
 $$('[data-bind]').forEach(e=>e.textContent=c[e.dataset.bind]);
 $$('[data-first]').forEach(e=>{const l=(c[e.dataset.first]||[])[0];if(l)e.href=safe(l.url);else e.style.display='none'});
 if(PAGES[pg])PAGES[pg](c);
 window.dispatchEvent(new CustomEvent('roxy-ready',{detail:c}));
 const io=new IntersectionObserver(es=>es.forEach(x=>{if(!x.isIntersecting)return;x.target.classList.add('in');
  $$('.n[data-to]',x.target).forEach(n=>{if(n.dataset.d)return;n.dataset.d=1;const to=+n.dataset.to,pre=n.dataset.pre||'',suf=n.dataset.suf||'',t0=performance.now();
   (function f(t){const p=Math.min((t-t0)/1200,1);n.textContent=pre+Math.round(to*(1-Math.pow(1-p,3)))+suf;if(p<1)requestAnimationFrame(f)})(t0)});
  io.unobserve(x.target)}),{threshold:.12});
 $$('.rv').forEach(e=>io.observe(e));
})();
