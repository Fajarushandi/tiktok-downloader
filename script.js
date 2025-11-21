function showLoad(){
  document.getElementById("load").style.display="block"
  document.getElementById("thumb").innerHTML=""
  document.getElementById("result").innerHTML=""
  document.getElementById("processBtn").disabled=true
}

function hideLoad(){
  document.getElementById("load").style.display="none"
  document.getElementById("processBtn").disabled=false
}

async function paste(){
  let text = await navigator.clipboard.readText()
  document.getElementById("url").value = text.trim()
}

function cleanLink(u){
  return u.split("?")[0]
}

async function fetchData(u){
  let r = await fetch("https://www.tikwm.com/api/?url=" + encodeURIComponent(u))
  let j = await r.json()
  if(j.code !== 0) return null
  return j.data
}

function triggerDownload(url, filename){
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}

function preview(d){
  document.getElementById("thumb").innerHTML =
  `<img src="${d.cover}">` +
  `<div class="title">${d.title || "No Title"}</div>` +
  `<div class="duration">${d.duration}s</div>`

  let video = d.play
  let audio = d.music

  document.getElementById("result").innerHTML = `
    <a class="action-btn" onclick="triggerDownload('${video}','video.mp4')">
      Download Video (No WM)
    </a>
    <a class="action-btn" onclick="triggerDownload('${audio}','music.mp3')">
      Download MP3 (HQ)
    </a>
  `
}

async function process(){
  let url = document.getElementById("url").value.trim()
  if(!url) return

  showLoad()

  url = cleanLink(url)

  let data = await fetchData(url)

  hideLoad()

  if(!data){
    alert("Gagal memproses link!")
    return
  }

  preview(data)
}
