const STORAGE_KEY="persistentTimer.v1";
const $=id=>document.getElementById(id);
const startAt=$("startAt"),endAt=$("endAt"),display=$("display"),progress=$("progress"),status=$("status"),startedText=$("startedText"),endsText=$("endsText"),startBtn=$("startBtn"),abortBtn=$("abortBtn");
let state=loadState(),intervalId=null;
function pad(n){return String(n).padStart(2,"0")}
function formatDuration(ms){const total=Math.max(0,Math.floor(ms/1000)),h=Math.floor(total/3600),m=Math.floor(total%3600/60),s=total%60;return [pad(h),pad(m),pad(s)].join(":")}
function toInputValue(date){const d=new Date(date),offset=d.getTimezoneOffset()*60000;return new Date(d.getTime()-offset).toISOString().slice(0,16)}
function formatDate(ms){return new Intl.DateTimeFormat(undefined,{dateStyle:"medium",timeStyle:"short"}).format(new Date(ms))}
function loadState(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||null}catch{return null}}
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
function setStatus(text,type){status.textContent=text;status.className="status "+type}
function render(){
 if(!state){setStatus("Ready","idle");display.textContent="00:00:00";progress.style.width="0%";startedText.textContent="—";endsText.textContent="—";startBtn.disabled=false;abortBtn.disabled=true;startAt.disabled=false;endAt.disabled=false;return}
 const now=Date.now(),duration=state.endAt-state.startAt,remaining=state.endAt-now,elapsed=now-state.startAt,ratio=duration>0?Math.min(100,Math.max(0,elapsed/duration*100)):100;
 startedText.textContent=formatDate(state.startAt);endsText.textContent=formatDate(state.endAt);
 if(state.aborted){setStatus("Aborted","aborted");display.textContent=formatDuration(state.abortedAt-state.startAt);progress.style.width=ratio+"%";startBtn.disabled=false;abortBtn.disabled=true;startAt.disabled=false;endAt.disabled=false;stopTick();return}
 if(remaining<=0){setStatus("Finished","finished");display.textContent="00:00:00";progress.style.width="100%";startBtn.disabled=false;abortBtn.disabled=true;startAt.disabled=false;endAt.disabled=false;stopTick();return}
 setStatus("Running","running");display.textContent=formatDuration(remaining);progress.style.width=ratio+"%";startBtn.disabled=true;abortBtn.disabled=false;startAt.disabled=true;endAt.disabled=true;
}
function stopTick(){if(intervalId){clearInterval(intervalId);intervalId=null}}
function startTick(){if(!intervalId)intervalId=setInterval(render,250)}
function startTimer(){
 const start=Date.now(),end=new Date(endAt.value).getTime();
 if(!Number.isFinite(end)){alert("Choose a valid end time.");return}
 if(end<=start){alert("End time must be in the future.");return}
 state={startAt:start,endAt:end,aborted:false,abortedAt:null};saveState();render();startTick()
}
function abortTimer(){
 if(!state||state.aborted||Date.now()>=state.endAt)return;
 if(!confirm("Abort this timer? The timer will stop permanently."))return;
 state.aborted=true;state.abortedAt=Date.now();saveState();render()
}
startBtn.addEventListener("click",startTimer);abortBtn.addEventListener("click",abortTimer);
const now=new Date();startAt.value=toInputValue(now);endAt.value=toInputValue(new Date(now.getTime()+3600000));
if(state&&!state.aborted&&Date.now()<state.endAt)startTick();
render();
window.addEventListener("pageshow",render);document.addEventListener("visibilitychange",render);