const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const ic=n=>`<svg class="i"><use href="/assets/icons.svg#${n}"/></svg>`;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe=u=>/^https?:\/\//i.test(u||'')?u:'#';
const DEFIMG='/assets/img/bot.jpg',DEFMUS='/assets/media/music.mp3';
const FACE='<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#fbc800" stroke="#1f2733" stroke-width="6"/><ellipse cx="35" cy="42" rx="8" ry="11" fill="#fff" stroke="#1f2733" stroke-width="3"/><ellipse cx="65" cy="42" rx="8" ry="11" fill="#fff" stroke="#1f2733" stroke-width="3"/><circle cx="37" cy="45" r="4" fill="#1f2733"/><circle cx="63" cy="45" r="4" fill="#1f2733"/><path d="M30 64q20 22 40 0" fill="none" stroke="#1f2733" stroke-width="6" stroke-linecap="round"/></svg>';
const DEF={botName:'Roxy AI',dev:'Yann',favicon:'',botImg:'',loadImg:'',music:'',musicOn:true,musicVol:.4,store:{label:'Website Terkait',url:'https://ys-digital.store'},api:{label:'Web REST API',url:'https://apiz2z.web.id'},channels:[{name:'Saluran Bot',url:'https://whatsapp.com/channel/0029VbCBj0N3LdQTosP3Hj0T'}],groups:[{name:'Grup Bot',url:'https://chat.whatsapp.com/Ge8JHVR49BR1ecpzqvg67x'}],owners:[{label:'WhatsApp 1',wa:'6285282426298'},{label:'WhatsApp 2',wa:'628135779643'}],telegram:'yannz2z',tiktok:'YannAjah'};
async function getConfig(){try{const r=await fetch('/data/config.json',{cache:'no-store'});if(r.ok)return Object.assign({},DEF,await r.json())}catch(e){}return DEF}
function say(t){let el=$('#toast');if(!el){el=document.createElement('div');el.id='toast';el.className='toast';document.body.appendChild(el)}el.textContent=t;el.classList.add('show');clearTimeout(say.t);say.t=setTimeout(()=>el.classList.remove('show'),2000)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-copy]');if(!b)return;
 try{navigator.clipboard.writeText(b.dataset.copy).catch(()=>{})}catch(_){const t=document.createElement('textarea');t.value=b.dataset.copy;document.body.appendChild(t);t.select();try{document.execCommand('copy')}catch(__){}t.remove()}
 say('Tersalin: '+b.dataset.copy)});
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const COLS=['blue','green','yellow','red','orange','purple','cyan'];
const swapBad=(i,txt)=>{const f=()=>{const d=document.createElement('div');d.className='ph '+i.className.replace('bot','').trim();d.innerHTML=FACE;i.replaceWith(d)};if(i.complete&&!i.naturalWidth&&i.src)f();else i.addEventListener('error',f,{once:true})};

function loader(){
 const ld=$('#ld');if(!ld)return;
 let done=false;
 const finish=()=>{if(done)return;done=true;document.body.classList.remove('lock');ld.classList.add('out');setTimeout(()=>ld.remove(),1000)};
 setTimeout(finish,7000); // pengaman: loading tidak pernah macet
 try{
  const lf=$('#lf'),ball=$('#lb'),bi=ball.firstElementChild,lp=$('#lp'),lm=$('#lm'),t=$('#ldt');
  t.innerHTML=[...t.textContent].map((c,i)=>`<span style="animation-delay:${i*.08}s">${c===' '?'&nbsp;':esc(c)}</span>`).join('');
  const D=matchMedia('(prefers-reduced-motion:reduce)').matches?500:2400;
  let ready=document.readyState==='complete';const t0=performance.now();
  addEventListener('load',()=>ready=true);setTimeout(()=>ready=true,3500);
  const M=[[0,'Menyapa server'],[.3,'Menyiapkan fitur'],[.6,'Merapikan menu'],[.9,'Hampir siap']];
  const tick=()=>{
   let p=Math.min(Math.max((performance.now()-t0)/D,0),1);p=1-Math.pow(1-p,2);if(!ready)p=Math.min(p,.92);
   lf.style.width=p*100+'%';ball.style.left=p*100+'%';bi.style.transform='rotate('+p*720+'deg)';
   lp.textContent=Math.round(p*100)+'%';lm.textContent=p>=1?'Siap!':M.filter(m=>p>=m[0]).pop()[1];
   if(p>=1){clearInterval(iv);setTimeout(finish,350)}
  };
  const iv=setInterval(tick,40);tick();
 }catch(e){finish()}
}

if(document.body.dataset.page==='home'){
 loader();
 // ---- menu kanan atas
 const mb=$('#mb'),dd=$('#dd');
 const NAV=[['home','Home','blue','<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>'],['rules','Rules','red','<path d="M7 3h8l4 4v14H7zM15 3v4h4M10 12h6M10 16h6"/>'],['fitur','Fitur','green','<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>'],['terkait','Terkait','orange','<path d="M10 14a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 10a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>'],['info','Info','cyan','<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>'],['saluran','Saluran','purple','<path d="M6 17V11a6 6 0 0112 0v6l2 2H4zM10 21h4"/>'],['grup','Grup','yellow','<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5M16 4.5a3.5 3.5 0 010 7M18 14.5c2.5.5 4 2.2 4 5.5"/>'],['owner','Owner','ink','<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>']];
 const item=n=>`<a href="#${n[0]}" data-v="${n[0]}"><i class="c-${n[2]}"><svg class="i" viewBox="0 0 24 24">${n[3]}</svg></i>${n[1]}</a>`;
 dd.innerHTML=NAV.map(n=>n[0]==='fitur'?`<div class="gr">${item(n).replace('<a ','<a data-keep ')}<button class="cr" id="cr" aria-label="Kategori fitur" aria-expanded="false"><svg class="i" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button></div><div class="sd" id="sd">${CATS.map(c=>`<a href="#fitur-${slug(c[0])}" data-c="${slug(c[0])}">${esc(c[0])}</a>`).join('')}</div>`:item(n)).join('');
 const tog=o=>{dd.classList.toggle('on',o);mb.setAttribute('aria-expanded',o)};
 const sub=o=>{$('#sd').classList.toggle('on',o);$('#cr').setAttribute('aria-expanded',o)};
 mb.addEventListener('click',e=>{e.stopPropagation();tog(!dd.classList.contains('on'))});
 $('#cr').addEventListener('click',e=>{e.stopPropagation();sub(!$('#sd').classList.contains('on'))});
 dd.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;if(a.hasAttribute('data-keep')){sub(true);return}tog(false)});
 document.addEventListener('click',e=>{if(!e.target.closest('.mw'))tog(false)});
 addEventListener('keydown',e=>{if(e.key==='Escape')tog(false)});
 $$('.face-slot').forEach(e=>e.innerHTML=FACE);
 $('#nCat').textContent=CATS.length;

 // ---- fitur
 const fb=$('#fbody'),q=$('#q');
 const cmd=(c,tag)=>{const p=c.endsWith('*'),n=p?c.slice(0,-1):c;return `<div class="fi"><span>${esc(n)}${p?'<em>PREMIUM</em>':''}${tag?`<small> ${esc(tag)}</small>`:''}</span><code>.${esc(n)}</code></div>`};
 function fitur(sel){
  const v=q.value.trim().toLowerCase();
  if(v){const r=[];CATS.forEach(c=>c[1].forEach(x=>{if(x.toLowerCase().includes(v)||c[0].toLowerCase()===v)r.push(cmd(x,c[0]))}));
   fb.innerHTML=r.length?`<div class="fg">${r.join('')}</div>`:'<div class="empty" style="display:block">Perintah tidak ditemukan.</div>';return}
  const c=CATS.find(x=>slug(x[0])===sel);
  if(c)fb.innerHTML=`<a class="btn alt sm back" href="#fitur">&larr; Semua kategori</a><div class="card"><div class="ch"><div class="ib c-${COLS[CATS.indexOf(c)%7]}"><b>${esc(c[0][0])}</b></div><h3>${esc(c[0])}</h3><span class="pill">${c[1].length} perintah</span></div><div class="fg">${c[1].map(x=>cmd(x)).join('')}</div></div>`;
  else fb.innerHTML=`<div class="cats">${CATS.map((c,i)=>`<a class="cat" href="#fitur-${slug(c[0])}"><i class="c-${COLS[i%7]}">${esc(c[0][0])}</i><b>${esc(c[0])}</b><small>${c[1].length} perintah</small></a>`).join('')}</div>`;
 }
 // ---- halaman (hash)
 const views=$$('.view');let cur='';
 function route(){
  const h=(location.hash||'#home').slice(1);let v=h,sel='';
  if(h.startsWith('fitur-')){v='fitur';sel=h.slice(6)}
  if(!$('#v-'+v)){v='home'}
  views.forEach(x=>{const on=x.id==='v-'+v;if(on&&x.hidden){x.hidden=false;x.style.animation='none';void x.offsetWidth;x.style.animation=''}else if(!on)x.hidden=true});
  if(v==='fitur'){if(sel)q.value='';fitur(sel)}
  $$('#dd a[data-v]').forEach(a=>a.classList.toggle('on',a.dataset.v===v));
  $$('#sd a').forEach(a=>a.classList.toggle('on',a.dataset.c===sel&&v==='fitur'));
  if(v!==cur)scrollTo(0,0);cur=v;
 }
 q.addEventListener('input',()=>fitur((location.hash.match(/^#fitur-(.+)/)||[])[1]||''));
 addEventListener('hashchange',route);route();

 (async()=>{
  const c=await getConfig();
  $$('[data-bind]').forEach(e=>e.textContent=c[e.dataset.bind]);
  const lt=$('#ldt');if(lt&&c.botName!==lt.textContent){lt.innerHTML=[...c.botName].map((x,i)=>`<span style="animation-delay:${i*.08}s">${x===' '?'&nbsp;':esc(x)}</span>`).join('')}
  document.title=c.botName+' - Bot WhatsApp';
  // gambar & favicon dari panel
  const bi=$('#botimg'),li=$('#ldimg');
  if(bi&&c.botImg)bi.src=c.botImg;if(li&&c.loadImg)li.src=c.loadImg;
  $('#fav').href=c.favicon||c.botImg||DEFIMG;
  $$('img.bot').forEach(i=>swapBad(i));
  const g=(c.groups[0]||{}).url;$$('[data-first]').forEach(e=>{if(g)e.href=safe(g);else e.style.display='none'});
  const lk=(t,s,u)=>`<a class="lk" href="${esc(safe(u))}" target="_blank" rel="noopener"><div><b>${esc(t)}</b><small>${esc(s)}</small></div><span>&rarr;</span></a>`;
  $('#lWeb').innerHTML=lk(c.store.label,c.store.url+' (webstore)',c.store.url)+lk(c.api.label,c.api.url+' (web endpoint)',c.api.url);
  $('#lCh').innerHTML=c.channels.map(x=>lk(x.name,'Saluran WhatsApp',x.url)).join('')||'<p class="sub">Belum ada saluran.</p>';
  $('#lGr').innerHTML=c.groups.map(x=>lk(x.name,'Grup WhatsApp',x.url)).join('')||'<p class="sub">Belum ada grup.</p>';
  const row=(l,v,a)=>`<div class="row"><span class="lb">${esc(l)}</span><span class="val">${esc(v)}</span><span class="acts"><button class="mini" data-copy="${esc(v)}">Salin</button><a class="mini" href="${esc(a)}" target="_blank" rel="noopener">Buka</a></span></div>`;
  let h=c.owners.map(o=>row(o.label,o.wa,'https://wa.me/'+encodeURIComponent(o.wa))).join('');
  if(c.telegram)h+=row('Telegram','@'+c.telegram,'https://t.me/'+encodeURIComponent(c.telegram));
  if(c.tiktok)h+=row('TikTok','@'+c.tiktok,'https://www.tiktok.com/@'+encodeURIComponent(c.tiktok));
  $('#devRows').innerHTML=h;$('#ftrName').textContent=c.botName;
  // ---- musik
  const mu=$('#mu');let au=null;
  const ui=o=>{mu.classList.toggle('on',o);mu.classList.toggle('off',!o)};
  try{au=new Audio(c.music||DEFMUS);au.loop=true;au.volume=Math.min(1,Math.max(0,+c.musicVol||.4));au.addEventListener('error',()=>{mu.style.display='none'})}catch(e){mu.style.display='none';return}
  const pref=store.get('roxy_music'),want=pref?pref==='on':c.musicOn!==false;
  const play=()=>au.play().then(()=>{ui(true);return true}).catch(()=>false);
  if(want){play().then(ok=>{if(ok)return;const first=()=>{removeEventListener('pointerdown',first);removeEventListener('keydown',first);if(store.get('roxy_music')!=='off')play()};addEventListener('pointerdown',first);addEventListener('keydown',first)})}
  mu.addEventListener('click',()=>{if(au.paused){store.set('roxy_music','on');play()}else{au.pause();store.set('roxy_music','off');ui(false)}});
 })();
}
