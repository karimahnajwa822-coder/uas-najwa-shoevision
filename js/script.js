let model;

const modelURL = "./model/model.json";
const metadataURL = "./model/metadata.json";

const upload = document.getElementById("imageUpload");
const preview = document.getElementById("preview");
const result = document.getElementById("result");

// Load model saat halaman dibuka
window.onload = async function () {
    try {
        result.innerHTML = "<p class='status-loading'>⏳ Memuat model AI...</p>";

        model = await tmImage.load(modelURL, metadataURL);

        console.log("Model berhasil dimuat!");

        result.innerHTML = "<p class='status-ready'>✅ Model siap digunakan</p>";

    }
    catch (error) {
        alert(error);
        console.error(error);

        result.innerHTML = "<p class='status-error'>❌ Gagal memuat model</p>";
    }
};

// Preview gambar
upload.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";

    const label = document.querySelector(".upload-text");
    if (label) label.textContent = file.name;

    result.innerHTML = "";
});

// Prediksi
async function predict() {

    if (!model) {
        alert("Model belum selesai dimuat.");
        return;
    }

    if (!preview.src) {
        alert("Silakan pilih gambar terlebih dahulu.");
        return;
    }

    result.innerHTML = "<p class='status-loading'>⏳ Menganalisis gambar...</p>";

    const prediction = await model.predict(preview);

    prediction.sort((a, b) => b.probability - a.probability);

    const topScore = (prediction[0].probability * 100).toFixed(2);

    let html = `
    <div class="result-head">
        <span class="result-eyebrow">Hasil Deteksi</span>
        <h1 class="result-class">${prediction[0].className}</h1>
        <span class="result-score">${topScore}% keyakinan</span>
    </div>
    <hr>
    <div class="result-list">
    `;

    prediction.forEach(item => {
        const pct = (item.probability * 100).toFixed(2);
        html += `
        <div class="result-row">
            <div class="result-row-top">
                <b>${item.className}</b>
                <span>${pct}%</span>
            </div>
            <div class="result-bar"><div class="result-bar-fill" style="width:0%"></div></div>
        </div>
        `;
    });

    html += `</div>`;

    result.innerHTML = html;

    // animasi bar mengisi setelah elemen ada di DOM
    requestAnimationFrame(() => {
        const bars = result.querySelectorAll(".result-bar-fill");
        prediction.forEach((item, i) => {
            const pct = (item.probability * 100).toFixed(2);
            if (bars[i]) bars[i].style.width = pct + "%";
        });
    });
}
