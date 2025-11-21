function showLoad(){
document.getElementById("error").innerHTML=""
document.getElementById("thumb").innerHTML='<div class="skeleton"></div>'
document.getElementById("result").innerHTML=""
document.getElementById("shareBox").innerHTML=""
document.getElementById("load").style.display="flex"
document.getElementById("processBtn").disabled=true
}

function hideLoad(){
document.getElementById("load").style.display="none"
document.getElementById("processBtn").disabled=false
}

function errorMsg(msg){
document.getElementById("thumb").innerHTML=""
document.getElementById("result").innerHTML=""
document.getElementById("shareBox").innerHTML=""
document.getElementById("error").innerHTML=msg
}

async function paste(){
let txt=await navigator.clipboard.readText()
document.getElementById("url").value=txt.trim()
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
 <div class="duration">${d.duration}s</div>`
}

function downloadFile(url, fname){
const a=document.createElement("a")
a.href=url
a.download=fname
document.body.appendChild(a)
a.click()
a.remove()
}

function downloadThumb(url){
downloadFile(url,"thumbnail.jpg")
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

function smoothScroll(){
setTimeout(()=>{
document.getElementById("result").scrollIntoView({behavior:"smooth"})
},200)
}

async function shareData(d){
try{
if(navigator.share){
await navigator.share({
title:d.title,
text:d.title,
url:d.play
})
}else{
alert("Perangkat kamu tidak mendukung fitur Share bawaan.")
}
}catch(e){
console.log("Share dibatalkan.")
}
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

let linkVideo = d.play.startsWith("http") ? d.play : "https://www.tikwm.com" + d.play

document.getElementById("result").innerHTML=
`<button onclick="downloadFile('${linkVideo}','video.mp4')">Download Video (No WM)</button>
 <button onclick="downloadFile('${d.music}','music.mp3')">Download MP3 (HQ)</button>`

document.getElementById("shareBox").innerHTML=
`<button class="share-btn" onclick='shareData(${JSON.stringify(d)})'>Share</button>`

saveHistory(u)

smoothScroll()
}

loadHistory()
