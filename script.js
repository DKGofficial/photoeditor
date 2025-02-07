const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const grayscale = document.getElementById('grayscale');
const reset = document.getElementById('reset');

let image = new Image();
let originalSrc = "";

upload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            image.src = e.target.result;
            originalSrc = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

image.onload = function() {
    canvas.width = image.width / 2;
    canvas.height = image.height / 2;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
};

function applyFilters() {
    ctx.filter = `brightness(${brightness.value}%) contrast(${contrast.value}%) grayscale(${grayscale.value}%)`;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}

brightness.addEventListener('input', applyFilters);
contrast.addEventListener('input', applyFilters);
grayscale.addEventListener('input', applyFilters);

reset.addEventListener('click', () => {
    brightness.value = 100;
    contrast.value = 100;
    grayscale.value = 0;
    image.src = originalSrc;
});
