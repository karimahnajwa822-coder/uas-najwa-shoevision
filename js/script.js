let model;

const modelURL = "./model/model.json";
const metadataURL = "./model/metadata.json";

const upload = document.getElementById("imageUpload");
const preview = document.getElementById("preview");
const result = document.getElementById("result");

// Load model saat halaman dibuka
window.onload = async function () {
    try {
        result.innerHTML = "<h3>⏳ Memuat model AI...</h3>";

        model = await tmImage.load(modelURL, metadataURL);

        console.log("Model berhasil dimuat!");

        result.innerHTML = "<h3>✅ Model siap digunakan</h3>";

    }
    catch (error) {
    alert(error);
    console.error(error);

    result.innerHTML =
    "<h3 style='color:red;'>❌ Gagal memuat model</h3>";
}
};

// Preview gambar
upload.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    preview.src = URL.createObjectURL(file);

    preview.style.display = "block";
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

  const prediction = await model.predict(preview);

prediction.sort((a, b) => b.probability - a.probability);

let html = `
<h2>Hasil Deteksi</h2>
<h1>${prediction[0].className}</h1>
<h2>${(prediction[0].probability * 100).toFixed(2)}%</h2>
<hr>
`;

prediction.forEach(item => {
    html += `
    <p>
        <b>${item.className}</b> :
        ${(item.probability * 100).toFixed(2)}%
    </p>
    `;
});

result.innerHTML = html;
}