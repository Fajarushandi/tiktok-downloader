function showLoad(){
document.getElementById("error").innerHTML=""
document.getElementById("thumb").innerHTML='<div class="skeleton"></div>'
document.getElementById("result").innerHTML=""
document.getElementById("load").style.display="flex"
document.getElementById("processBtn").disabled=true
}

function hideLoad(){
document.getElementById("load").style.display="none"
document.getElementById("processBtn").disabled=false
}

function errorMsg(t){
document.getElementById("thumb").innerHTML=""
document.getElementById("result").innerHTML=""
document.getElementById("error").innerHTML=t
}

async function paste(){
let text=await navigator.clipboard.readText()
document.getElementById("url").value=text.trim()
}

function cleanLink(u){
return u.split("?")[0]
}

async function fetchData(u){
let r=await fetch("https://www.tikwm.com/api/?url="+encodeURIComponent(u))
let j=await r.json()
if(j.code!==0) return null
return j.data
}

function preview(d){
document.getElementById("thumb").innerHTML=
`<img src="${d.cover}">
 <div class="title">${d.title}</div>
 <div class="duration">${d.duration}s</div>

 <div class="share-btns">
 <a class="share-btn" href="https://wa.me/?text=${encodeURIComponent(d.play)}" target="_blank">WhatsApp</a>
 <a class="share-btn" href="https://t.me/share/url?url=${encodeURIComponent(d.play)}" target="_blank">Telegram</a>
 <a class="share-btn" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(d.play)}" target="_blank">X / Twitter</a>
 <a class="share-btn" onclick="downloadThumb('${d.cover}')">Thumbnail</a>
 </div>`
}

function downloadThumb(url){
downloadFile(url,"thumbnail.jpg")
}

function downloadFile(url, filename){
const a=document.createElement("a")
a.href=url
a.download=filename
document.body.appendChild(a)
a.click()
a.remove()
}

function saveHistory(link){
let h=JSON.parse(localStorage.getItem("history")||"[]")
h.unshift(link)
h=h.slice(0,5)
localStorage.setItem("history",JSON.stringify(h))
loadHistory()
}

function loadHistory(){
let h=JSON.parse(localStorage.getItem("history")||"[]")
let out=""
h.forEach(x=>{
out+=`<div class="history-item">${x}</div>`
})
document.getElementById("historyList").innerHTML=out
}

function smoothScrollToResults(){
setTimeout(()=>{
document.getElementById("result").scrollIntoView({behavior:"smooth"})
},200)
}

async function process(){
showLoad()

let u=document.getElementById("url").value.trim()
if(!u){ hideLoad(); return }

u=cleanLink(u)
let d=await fetchData(u)

hideLoad()

if(!d) return errorMsg("Link tidak valid atau video tidak ditemukan.")

preview(d)

let max=d.play.startsWith("http")?d.play:"https://www.tikwm.com"+d.play

document.getElementById("result").innerHTML=
`<button onclick="downloadFile('${max}','video.mp4')">Download Video Max Quality (No WM)</button>
 <button onclick="downloadFile('${d.music}','music.mp3')">Download MP3 (HQ)</button>`

saveHistory(u)
smoothScrollToResults()
}

loadHistory()
