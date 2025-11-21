async function paste(){
    try{
        let t = await navigator.clipboard.readText();
        document.getElementById("url").value = t.trim();
    }catch(e){
        alert("Gagal paste, izinkan clipboard.");
    }
}

function clean(u){
    return u.split("?")[0];
}

async function fetchData(u){
    let r = await fetch("https://www.tikwm.com/api/?url=" + encodeURIComponent(u));
    let j = await r.json();
    if(j.code !== 0) return null;
    return j.data;
}

function showLoad(){
    document.getElementById("result").innerHTML = "Processing...";
}

async function downloadFile(url, name){
    try{
        let r = await fetch(url);
        let b = await r.blob();
        let blobUrl = URL.createObjectURL(b);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(()=>URL.revokeObjectURL(blobUrl),4000);
    }catch(e){
        alert("Download gagal");
    }
}

function preview(d){
    document.getElementById("thumb").innerHTML =
    `<img src="${d.cover}">`;

    let video = d.play;      // no WM
    let audio = d.music;     // mp3 hq

    document.getElementById("result").innerHTML =
    `
    <button class="result-btn" onclick="downloadFile('${video}','video.mp4')">
        Download Video (No WM)
    </button>

    <button class="result-btn" onclick="downloadFile('${audio}','music.mp3')">
        Download MP3 (HQ)
    </button>
    `;
}

async function startProcess(){
    let u = document.getElementById("url").value.trim();
    if(!u) return alert("Masukkan link dulu");

    showLoad();

    u = clean(u);

    let d = await fetchData(u);
    if(!d){
        document.getElementById("result").innerHTML = "Gagal mengambil data.";
        return;
    }

    preview(d);
}
