/* ---- front-end-only login gate ----
   Checked in this browser only; no real server. Change these two values to set your own login. */
const AU='jawaharkumar', AP='admin123', AK='inkpen-admin-auth';
function showApp(){$('#login').hidden=true;$('#app').hidden=false;render()}
function showLogin(){$('#app').hidden=true;$('#login').hidden=false;$('#lgu').focus()}
$('#loginlogo').src=getLogo(S?.site?.logo);
$('#lgf').addEventListener('submit',e=>{
 e.preventDefault();
 if($('#lgu').value.trim()===AU&&$('#lgp').value===AP){
  try{sessionStorage.setItem(AK,'1')}catch(x){}
  $('#lgp').value='';$('#lgerr').textContent='';showApp();
 }else{$('#lgerr').textContent='Incorrect username or password.'}
});
$('#lgeye').onclick=()=>{const s=$('#lgp').type==='password';$('#lgp').type=s?'text':'password';$('#lgeye').setAttribute('aria-label',s?'Hide password':'Show password')};
$('#signout').onclick=()=>{try{sessionStorage.removeItem(AK)}catch(e){}setMenu(false);showLogin()};
let authed=false;try{authed=sessionStorage.getItem(AK)==='1'}catch(e){}
if(authed)showApp();else showLogin();

