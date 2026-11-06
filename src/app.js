let S;try{S=JSON.parse(localStorage.getItem(K))}catch(e){S=null}
if(!S)S=JSON.parse(JSON.stringify(SEED));
let V='dash',leadFilter='All';
const API_BASE=window.INKPEN_API_BASE||'http://localhost:4000/api';
const save=()=>{
 try{localStorage.setItem(K,JSON.stringify(S))}catch(e){toast('Could not save in this browser. Storage is full.')}
 fetch(API_BASE+'/state',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(S)}).catch(()=>{});
};
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const cap=s=>s[0].toUpperCase()+s.slice(1);
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
let tt;const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2200)};

function fieldHTML([k,l,t,o],v={}){
 const val=esc(v[k]??'');
 if(t==='ta')return `<label class="wide">${l}<textarea data-f="${k}">${val}</textarea></label>`;
 if(t==='sel')return `<label>${l}<select data-f="${k}">${o.split(',').map(x=>`<option${x===v[k]?' selected':''}>${x}</option>`).join('')}</select></label>`;
 if(t==='cat')return `<label>${l}<select data-f="${k}">${S.cats.map(c=>`<option${c.name===v[k]?' selected':''}>${esc(c.name)}</option>`).join('')}</select></label>`;
 return `<label>${l}<input data-f="${k}" value="${val}"></label>`;
}
function openForm(key,id){
 const c=C[key],v=id?S[key].find(x=>x.id===id):{};
 $('#edslot').innerHTML=`<form id="ed" class="card form" data-col="${key}" data-id="${id||''}">${c.f.map(f=>fieldHTML(f,v)).join('')}
 <div class="wide row"><button class="btn p">${id?'Save changes':'Add '+c.t.toLowerCase()}</button><button type="button" class="btn" data-a="cancel">Cancel</button></div></form>`;
 $('#ed [data-f]')?.focus();
}
function submitForm(f){
 const key=f.dataset.col,id=f.dataset.id,data={};
 f.querySelectorAll('[data-f]').forEach(el=>data[el.dataset.f]=el.value.trim());
 if(!data[C[key].f[0][0]]){toast('Add a name before saving');return}
 if(id)Object.assign(S[key].find(x=>x.id===id),data);else S[key].push({id:uid(),...data});
 save();render();toast(id?'Changes saved':'Added');
}
function listView(key){
 const c=C[key],label=VIEWS.find(v=>v[0]===key)[1];
 const statusColor=(k,v)=>k==='status'?(v==='Open'||v==='Approved'||v==='Live'?`<td style="color:var(--g);font-weight:600">${esc(v)}</td>`:`<td style="color:var(--mute)">${esc(v)}</td>`):null;
const rows=S[key].map(r=>`<tr>${c.c.map(k=>statusColor(k,r[k])??`<td>${esc(r[k])}</td>`).join('')}<td class="row" style="justify-content:flex-end">${key==='reviews'?`<button class="btn sm" data-a="toggle" data-id="${r.id}">${r.status==='Approved'?'Hide':'Approve'}</button>`:''}<button class="btn sm" data-a="edit" data-id="${r.id}">Edit</button><button class="btn sm x" data-a="del" data-id="${r.id}">Delete</button></td></tr>`).join('');
 return `<div class="between"><h1>${label}</h1><button class="btn p" data-a="add">Add ${c.t.toLowerCase()}</button></div><div id="edslot"></div>
 ${S[key].length?`<div class="card" style="overflow-x:auto"><table><thead><tr>${c.c.map(k=>`<th>${cap(k)}</th>`).join('')}<th></th></tr></thead><tbody>${rows}</tbody></table></div>`:`<div class="empty">Nothing here yet. Use the button above to add the first one.</div>`}`;
}
function leadsTable(list){
 return list.length?`<div style="overflow-x:auto"><table><thead><tr><th>Name</th><th>Contact</th><th>Message</th><th>Date</th><th>Status</th></tr></thead><tbody>${list.map(l=>`<tr><td>${esc(l.name)}</td><td>${esc(l.email)}<br><span class="mute">${esc(l.phone)}</span></td><td style="max-width:280px">${esc(l.message)}</td><td>${esc(l.date)}</td><td><select data-st="${l.id}" aria-label="Status for ${esc(l.name)}" style="width:auto">${['New','Read','Replied'].map(s=>`<option${s===l.status?' selected':''}>${s}</option>`).join('')}</select></td></tr>`).join('')}</tbody></table></div>`:`<div class="empty">No inquiries yet. They appear here when someone uses the contact form.</div>`;
}
function leadsView(){
 const f=S.leads.filter(l=>leadFilter==='All'||l.status===leadFilter);
 return `<div class="between"><h1>Inquiries</h1><div class="row"><select id="lf2" style="width:auto" aria-label="Filter by status">${['All','New','Read','Replied'].map(s=>`<option${s===leadFilter?' selected':''}>${s}</option>`).join('')}</select><button class="btn p" data-a="csv">Export CSV</button></div></div><div class="card">${leadsTable(f)}</div>`;
}
function dash(){
 const r=S.range,vals=S.visits[r],total=vals.reduce((a,b)=>a+b,0),max=Math.max(1,...vals);
 const lab={day:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],week:['W1','W2','W3','W4','W5','W6','W7','W8'],month:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']}[r];
 const span={day:'last 7 days',week:'last 8 weeks',month:'last 12 months'}[r];
 return `<div class="between"><h1>Dashboard</h1><div class="seg" role="group" aria-label="Visit range">${[['day','Daily'],['week','Weekly'],['month','Monthly']].map(([x,l])=>`<button data-a="range" data-r="${x}" aria-pressed="${x===r}">${l}</button>`).join('')}</div></div>
 <div class="grid" style="margin-bottom:1.25rem">
  <div class="card stat"><b>${total.toLocaleString()}</b><span>Website visits, ${span}</span></div>
  <div class="card stat"><b>${S.projects.length}</b><span>Projects completed</span></div>
  <div class="card stat"><b>${S.services.filter(s=>s.status==='Live').length}</b><span>Live services</span></div>
  <div class="card stat"><b>${S.reviews.filter(x=>x.status==='Approved').length}</b><span>Approved reviews</span></div>
 </div>
 <div class="card"><h2>Visitors</h2><div class="bars" role="img" aria-label="Visits ${span}">${vals.map((v,i)=>`<div class="col"><div class="bar"><i style="height:${Math.round(v/max*100)}%" title="${v}"></i></div><small>${lab[i]}</small></div>`).join('')}</div></div>
 <div class="card" style="margin-top:1.25rem"><div class="between" style="margin-bottom:.5rem"><h2>Recent inquiries</h2><span class="mute">${S.leads.filter(l=>l.status==='New').length} new</span></div>${leadsTable(S.leads.slice(0,4))}<button class="btn sm" style="margin-top:.75rem" data-a="go" data-v="leads">View all inquiries</button></div>`;
}
function settings(){
 const s=S.site,so=s.social;
 return `<div class="between"><h1>Settings</h1></div>
 <div class="card form">
  <h2 class="wide">Site identity</h2>
  <div class="wide row"><div class="chip"><img src="${getLogo(s.logo)}" alt="Current logo"></div><label>Replace logo<input type="file" accept="image/*" id="logoin"></label></div>
  <label>Phone<input data-s="phone" value="${esc(s.phone)}"></label>
  <label>Email<input data-s="email" value="${esc(s.email)}"></label>
  <label class="wide">Address<input data-s="address" value="${esc(s.address)}"></label>
  <h2 class="wide" style="margin-top:.5rem">Social links</h2>
  ${['instagram','facebook','linkedin','x'].map(k=>`<label>${cap(k)}<input data-so="${k}" value="${esc(so[k])}" placeholder="https://"></label>`).join('')}
  <h2 class="wide" style="margin-top:.5rem">Security</h2>
  <div class="wide row"><input id="tf" type="checkbox" ${s.twofa?'checked':''} style="width:auto"><span>Require a 2-step code at sign-in</span></div>
  <label>New password<input type="password" id="np" autocomplete="new-password"></label>
  <p class="wide mute" style="margin:0">Passwords and 2-step codes are checked by your server. This preview saves contact details and social links in this browser only.</p>
  <div class="wide row"><button class="btn p" data-a="saveset">Save settings</button></div>
 </div>`;
}
function render(){
 $('#nav').innerHTML=VIEWS.map(([k,l])=>`<button data-v="${k}"${k===V?' aria-current="page"':''}>${l}</button>`).join('');
 const m=$('#main');
 m.innerHTML=V==='dash'?dash():V==='leads'?leadsView():V==='settings'?settings():listView(V);
 $('#sidelogo').src=getLogo(S.site.logo);
 if($('#loginlogo'))$('#loginlogo').src=getLogo(S.site.logo);
 $('#theme').textContent=document.documentElement.dataset.theme==='light'?'☾ Dark theme':'☀ Light theme';
}
function exportCSV(){
 const q=v=>{let s=String(v??'');if(/^[=+\-@]/.test(s))s="'"+s;return `"${s.replace(/"/g,'""')}"`};
 const rows=[['Name','Email','Phone','Date','Status','Message']].concat(S.leads.map(l=>[l.name,l.email,l.phone,l.date,l.status,l.message]));
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([rows.map(r=>r.map(q).join(',')).join('\n')],{type:'text/csv'}));a.download='inkpen-inquiries.csv';a.click();
 setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast('CSV downloaded');
}
function saveSettings(){
 document.querySelectorAll('[data-s]').forEach(i=>S.site[i.dataset.s]=i.value.trim());
 document.querySelectorAll('[data-so]').forEach(i=>S.site.social[i.dataset.so]=i.value.trim());
 S.site.twofa=$('#tf').checked;save();
 toast($('#np').value?'Password change needs a server connection. Not saved.':'Settings saved');
}
function setMenu(open){
 document.body.classList.toggle('menu-open',open);
 $('#side').classList.toggle('open',open);
 $('#burger').setAttribute('aria-expanded',String(open));
 $('#burger').textContent=open?'✕':'☰';
}
$('#burger').onclick=()=>setMenu(!document.body.classList.contains('menu-open'));
$('#scrim').onclick=()=>setMenu(false);
document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
document.addEventListener('click',e=>{
 const t=e.target.closest('[data-v],[data-a]');if(!t)return;
 if(t.dataset.v){V=t.dataset.v;render();setMenu(false);return}
 const a=t.dataset.a,id=t.dataset.id;
 if(a==='range'){S.range=t.dataset.r;save();render()}
 else if(a==='add')openForm(V);
 else if(a==='edit')openForm(V,id);
 else if(a==='cancel')$('#edslot')?.replaceChildren();
 else if(a==='del'){if(confirm('Delete this item? This cannot be undone.')){S[V]=S[V].filter(x=>x.id!==id);save();render();toast('Deleted')}}
 else if(a==='toggle'){const r=S.reviews.find(x=>x.id===id);r.status=r.status==='Approved'?'Hidden':'Approved';save();render();toast(r.status==='Approved'?'Testimonial is live on the site':'Testimonial hidden')}
 else if(a==='csv')exportCSV();
 else if(a==='saveset')saveSettings();
});
document.addEventListener('submit',e=>{if(e.target.id==='ed'){e.preventDefault();submitForm(e.target)}});
document.addEventListener('change',e=>{
 const t=e.target;
 if(t.dataset.st){const l=S.leads.find(x=>x.id===t.dataset.st);l.status=t.value;save();render();toast('Status updated')}
 else if(t.id==='lf2'){leadFilter=t.value;render()}
 else if(t.id==='logoin'){const f=t.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{if(r.result.length>300000){toast('Logo is too large. Use a file under 200 KB.');return}S.site.logo=r.result;save();render();toast('Logo updated')};r.readAsDataURL(f)}
});
$('#theme').onclick=()=>{const d=document.documentElement;d.dataset.theme=d.dataset.theme==='light'?'dark':'light';render()};

// Optional sync from Backend API if running
fetch(API_BASE+'/state').then(r=>r.ok?r.json():null).then(remote=>{
 if(remote&&remote.site&&Array.isArray(remote.jobs)){
  S=Object.assign({},SEED,remote);
  try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}
  if(!$('#app').hidden)render();
 }
}).catch(()=>{});

