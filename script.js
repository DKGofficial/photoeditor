const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const grayscale = document.getElementById('grayscale');
const sepia = document.getElementById('sepia');
const invert = document.getElementById('invert');
const hueRotate = document.getElementById('hueRotate');
const saturate = document.getElementById('saturate');

const resizeWidth = document.getElementById('resizeWidth');
const resizeHeight = document.getElementById('resizeHeight');
const applyResize = document.getElementById('applyResize');
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
    resizeWidth.value = canvas.width;
    resizeHeight.value = canvas.height;
};

function applyFilters() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = `brightness(${brightness.value}%) contrast(${contrast.value}%) grayscale(${grayscale.value}%) sepia(${sepia.value}%) invert(${invert.value}%) hue-rotate(${hueRotate.value}deg) saturate(${saturate.value}%)`;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}

[brightness, contrast, grayscale, sepia, invert, hueRotate, saturate].forEach(input => {
    input.addEventListener('input', applyFilters);
});

applyResize.addEventListener('click', () => {
    const width = parseInt(resizeWidth.value);
    const height = parseInt(resizeHeight.value);

    if (width > 0 && height > 0) {
        canvas.width = width;
        canvas.height = height;
        applyFilters();
    }
});

reset.addEventListener('click', () => {
    brightness.value = 100;
    contrast.value = 100;
    grayscale.value = 0;
    sepia.value = 0;
    invert.value = 0;
    hueRotate.value = 0;
    saturate.value = 100;

    image.src = originalSrc;
    image.onload();
});
