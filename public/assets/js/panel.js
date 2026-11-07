(()=>{
const root=$('#panelRoot');let token=sessionStorage.getItem('roxy_t')||'',mode='static',cfg;
const RF={owners:[['label','Label'],['wa','Nomor (628...)']],channels:[['name','Nama saluran'],['url','Tautan https://']],groups:[['name','Nama grup'],['url','Tautan https://']]};
const rowH=(k,v)=>`<div class="rr">${RF[k].map(f=>`<input class="inp" data-f="${f[0]}" placeholder="${f[1]}" value="${esc(v[f[0]]||'')}">`).join('')}<button type="button" class="mini" data-rm aria-label="Hapus">${ic('close')}</button></div>`;
const rep=(k,t,i)=>`<h3>${ic(i)}${t}</h3><div class="rep" data-k="${k}">${(cfg[k]||[]).map(v=>rowH(k,v)).join('')}</div><button type="button" class="btn alt sm" data-add="${k}">${ic('plus')}Tambah</button>`;
const fld=(id,l,v,p)=>`<div class="fld"><label for="${id}">${l}</label><input class="inp" id="${id}" value="${esc(v||'')}" placeholder="${p||''}"></div>`;
const ACC={image:'image/png,image/jpeg,image/webp,image/gif,image/x-icon',audio:'audio/mpeg,audio/ogg,audio/wav,audio/mp4'};
const asset=(id,l,v,kind,ph)=>`<div class="fld"><label for="${id}">${l}</label><div class="ar">${kind==='image'?`<img class="pv" id="${id}P" alt="" src="${esc(v||DEFIMG)}">`:`<audio class="pa" id="${id}P" controls preload="none" src="${esc(v||DEFMUS)}"></audio>`}
 <div class="ai"><input class="inp" id="${id}" value="${esc(v||'')}" placeholder="${ph}"><div class="bar2"><label class="btn alt sm up">Upload<input type="file" hidden data-up="${id}" data-kind="${kind}" accept="${ACC[kind]}"></label><button type="button" class="btn alt sm" data-reset="${id}">Pakai bawaan</button></div></div></div></div>`;
function preview(id){const i=$('#'+id),p=$('#'+id+'P');if(p)p.src=i.value.trim()||(p.tagName==='AUDIO'?DEFMUS:DEFIMG)}
function login(msg){
 root.innerHTML=`<h2>Panel Developer</h2><p class="sub" style="margin:6px 0 18px">Masuk untuk mengatur data website.</p>${msg?`<div class="note warn">${esc(msg)}</div>`:''}
 <div class="fld"><label for="un">Username</label><input class="inp" id="un" autocomplete="username" autocapitalize="none"></div>
 <div class="fld"><label for="pw">Password</label><input class="inp" id="pw" type="password" autocomplete="current-password"></div>
 <button class="btn" id="go">${ic('user')}Masuk</button>`;
 const go=async()=>{try{const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:$('#un').value.trim(),password:$('#pw').value})});const d=await r.json();
  if(!r.ok)return login(d.error||'Gagal masuk');token=d.token;sessionStorage.setItem('roxy_t',token);editor()}catch(e){login('Server tidak merespons')}};
 $('#go').onclick=go;$('#pw').onkeydown=e=>{if(e.key==='Enter')go()};
}
function editor(){
 root.innerHTML=`<h2>Panel Developer</h2>
 <div class="note">${mode==='server'?'Terhubung ke server. Tombol Simpan langsung mengubah website.':'Mode statis: server panel tidak terdeteksi. Isi kolom dengan URL, lalu klik Unduh config.json dan upload ke folder data/ di hosting. Tombol Upload hanya jalan lewat server.'}</div>
 ${fld('botName','Nama bot',cfg.botName)}${fld('dev','Nama developer',cfg.dev)}
 <div class="g2">${fld('tg','Telegram (tanpa @)',cfg.telegram)}${fld('tt','TikTok (tanpa @)',cfg.tiktok)}</div>
 <h3>${ic('bag')}Tampilan</h3>
 ${asset('favicon','Favicon (ikon tab browser)',cfg.favicon,'image','Kosong = pakai foto bot')}
 ${asset('botImg','Foto bot (di Home)',cfg.botImg,'image','Kosong = foto bawaan')}
 ${asset('loadImg','Foto di loading bar',cfg.loadImg,'image','Kosong = foto bawaan')}
 <h3>${ic('bell')}Musik website</h3>
 ${asset('music','File musik (mp3, ogg, wav, m4a)',cfg.music,'audio','Kosong = musik bawaan')}
 <div class="fld"><label class="chk"><input type="checkbox" id="musicOn" ${cfg.musicOn!==false?'checked':''}>Putar otomatis saat pengunjung pertama kali menyentuh layar</label></div>
 <div class="fld"><label for="musicVol">Volume: <span id="vv">${Math.round((cfg.musicVol==null?.4:cfg.musicVol)*100)}</span>%</label><input type="range" id="musicVol" min="0" max="100" value="${Math.round((cfg.musicVol==null?.4:cfg.musicVol)*100)}"></div>
 <h3>${ic('bag')}Website terkait</h3>
 <div class="g2">${fld('stL','Label webstore',cfg.store.label)}${fld('stU','URL webstore',cfg.store.url,'https://')}${fld('apL','Label REST API',cfg.api.label)}${fld('apU','URL REST API',cfg.api.url,'https://')}</div>
 ${rep('owners','Owner / Developer (WhatsApp)','phone')}${rep('channels','Saluran bot','bell')}${rep('groups','Grup bot','users')}
 <div class="bar"><button class="btn" id="save">${ic('save')}Simpan</button><button class="btn alt" id="dl">${ic('dl')}Unduh config.json</button><a class="btn alt" href="/" target="_blank">${ic('arrow')}Lihat website</a>${mode==='server'?`<button class="btn alt" id="out">${ic('close')}Keluar</button>`:''}</div>`;
}
function collect(){
 const g=id=>$('#'+id).value.trim(),out={botName:g('botName'),dev:g('dev'),telegram:g('tg').replace(/^@/,''),tiktok:g('tt').replace(/^@/,''),
  favicon:g('favicon'),botImg:g('botImg'),loadImg:g('loadImg'),music:g('music'),musicOn:$('#musicOn').checked,musicVol:(+$('#musicVol').value)/100,
  store:{label:g('stL'),url:g('stU')},api:{label:g('apL'),url:g('apU')}};
 for(const k in RF)out[k]=$$(`.rep[data-k="${k}"] .rr`).map(r=>{const o={};$$('[data-f]',r).forEach(i=>o[i.dataset.f]=i.value.trim());if(k==='owners')o.wa=o.wa.replace(/\D/g,'');return o}).filter(o=>Object.values(o).some(Boolean));
 return out;
}
function check(o){
 if(!o.botName)return'Nama bot wajib diisi';
 for(const u of [o.store.url,o.api.url])if(!/^https?:\/\//i.test(u))return'URL website harus diawali http:// atau https://';
 for(const k of['favicon','botImg','loadImg','music'])if(o[k]&&!/^(https?:\/\/|\/(assets|uploads)\/)/i.test(o[k]))return'Kolom '+k+' harus berupa URL https:// atau hasil Upload';
 for(const k of['channels','groups'])for(const x of o[k])if(!x.name||!/^https?:\/\//i.test(x.url))return'Nama dan tautan '+k+' harus lengkap (https://)';
 for(const x of o.owners)if(!x.label||x.wa.length<8)return'Owner: label dan nomor (angka, minimal 8 digit) wajib diisi';
 return'';
}
root.addEventListener('input',e=>{if(e.target.id==='musicVol')$('#vv').textContent=e.target.value;else if($('#'+e.target.id+'P'))preview(e.target.id)});
root.addEventListener('change',async e=>{
 const f=e.target.closest('[data-up]');if(!f||!f.files[0])return;const file=f.files[0],kind=f.dataset.kind,id=f.dataset.up;
 if(mode!=='server'){f.value='';return say('Upload butuh server panel. Isi URL saja.')}
 if(file.size>(kind==='image'?3:10)*1048576){f.value='';return say('File terlalu besar (maks '+(kind==='image'?3:10)+' MB)')}
 say('Mengunggah...');
 const data=await new Promise(ok=>{const r=new FileReader();r.onload=()=>ok(String(r.result).split(',')[1]);r.readAsDataURL(file)});
 try{const r=await fetch('/api/upload',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({type:kind,name:file.name,data})});
  if(r.status===401){sessionStorage.removeItem('roxy_t');token='';return login('Sesi habis, masuk lagi')}
  const d=await r.json();if(!r.ok)return say(d.error||'Gagal upload');
  $('#'+id).value=d.path;preview(id);say('Terunggah. Klik Simpan untuk menerapkan.')}catch(x){say('Server tidak merespons')}
 f.value='';
});
root.addEventListener('click',async e=>{
 const a=e.target.closest('[data-add]'),r=e.target.closest('[data-rm]'),rs=e.target.closest('[data-reset]');
 if(rs){const i=$('#'+rs.dataset.reset);i.value='';preview(i.id)}
 else if(a){$(`.rep[data-k="${a.dataset.add}"]`).insertAdjacentHTML('beforeend',rowH(a.dataset.add,{}))}
 else if(r)r.closest('.rr').remove();
 else if(e.target.closest('#dl')){const o=collect(),er=check(o);if(er)return say(er);
  const l=document.createElement('a');l.href=URL.createObjectURL(new Blob([JSON.stringify(o,null,2)],{type:'application/json'}));l.download='config.json';l.click();URL.revokeObjectURL(l.href)}
 else if(e.target.closest('#out')){sessionStorage.removeItem('roxy_t');token='';login()}
 else if(e.target.closest('#save')){const o=collect(),er=check(o);if(er)return say(er);
  if(mode!=='server')return say('Mode statis: gunakan Unduh config.json');
  try{const r=await fetch('/api/config',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify(o)});
   if(r.status===401){sessionStorage.removeItem('roxy_t');token='';return login('Sesi habis, masuk lagi')}
   const d=await r.json();if(!r.ok)return say(d.error||'Gagal menyimpan');say('Tersimpan, website sudah diperbarui')}catch(x){say('Server tidak merespons')}}
});
(async()=>{
 cfg=await getConfig();
 try{const r=await fetch('/api/ping',{cache:'no-store'}),d=await r.json();if(r.ok&&d.ok){mode='server';if(!d.enabled)return root.innerHTML='<h2>Panel Developer</h2><div class="note warn">Panel dikunci. Atur variabel PANEL_USER (min. 3 karakter, bukan \"admin\") dan PANEL_PASSWORD (min. 8 karakter) di server, lalu jalankan ulang.</div>'}}catch(e){}
 if(mode==='server'&&!token)login();else editor();
})();
})();
