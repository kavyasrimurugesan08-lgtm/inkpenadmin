/* ---- Admin login gate (reads credentials from .env) ---- */
const winEnv = (typeof window !== 'undefined' && window.__INKPEN_ENV__) ? window.__INKPEN_ENV__ : {};
const buildEnv = (typeof __INKPEN_BUILD_ENV__ !== 'undefined' && __INKPEN_BUILD_ENV__) ? __INKPEN_BUILD_ENV__ : {};
const metaEnv = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};

const AU = winEnv.ADMIN_USERNAME || buildEnv.ADMIN_USERNAME || metaEnv.ADMIN_USERNAME || metaEnv.VITE_ADMIN_USERNAME || 'jawaharkumar';
const AP = winEnv.ADMIN_PASSWORD || buildEnv.ADMIN_PASSWORD || metaEnv.ADMIN_PASSWORD || metaEnv.VITE_ADMIN_PASSWORD || 'admin123';
const AK = 'inkpen-admin-auth';

function showApp(){$('#login').hidden=true;$('#app').hidden=false;render()}
function showLogin(){$('#app').hidden=true;$('#login').hidden=false;$('#lgu').focus()}
$('#loginlogo').src=getLogo(S?.site?.logo);
$('#lgf').addEventListener('submit',e=>{
 e.preventDefault();
 if($('#lgu').value.trim().toLowerCase()===AU.trim().toLowerCase()&&$('#lgp').value===AP){
  try{sessionStorage.setItem(AK,'1')}catch(x){}
  $('#lgp').value='';$('#lgerr').textContent='';showApp();
 }else{$('#lgerr').textContent='Incorrect username or password.'}
});
$('#lgeye').onclick=()=>{const s=$('#lgp').type==='password';$('#lgp').type=s?'text':'password';$('#lgeye').setAttribute('aria-label',s?'Hide password':'Show password')};
$('#signout').onclick=()=>{try{sessionStorage.removeItem(AK)}catch(e){}setMenu(false);showLogin()};
let authed=false;try{authed=sessionStorage.getItem(AK)==='1'}catch(e){}
if(authed)showApp();else showLogin();


