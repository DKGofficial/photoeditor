document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const upload = document.getElementById('upload');
    const downloadBtn = document.getElementById('download');
    const applyResizeBtn = document.getElementById('applyResize');

    const filters = {
        brightness: document.getElementById('brightness'),
        contrast: document.getElementById('contrast'),
        grayscale: document.getElementById('grayscale'),
        sepia: document.getElementById('sepia'),
        invert: document.getElementById('invert'),
        hueRotate: document.getElementById('hueRotate'),
        saturate: document.getElementById('saturate')
    };

    const resizeWidth = document.getElementById('resizeWidth');
    const resizeHeight = document.getElementById('resizeHeight');
    const resizeKB = document.getElementById('resizeKB');

    let img = new Image();

    upload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            img.src = event.target.result;
        };

        reader.readAsDataURL(file);
    });

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
    };

    Object.values(filters).forEach(filter => {
        filter.addEventListener('input', applyFilters);
    });

    function applyFilters() {
        const filterString = `
            brightness(${filters.brightness.value}%)
            contrast(${filters.contrast.value}%)
            grayscale(${filters.grayscale.value}%)
            sepia(${filters.sepia.value}%)
            invert(${filters.invert.value}%)
            hue-rotate(${filters.hueRotate.value}deg)
            saturate(${filters.saturate.value}%)
        `;

        ctx.filter = filterString;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    applyResizeBtn.addEventListener('click', () => {
        if (resizeWidth.value && resizeHeight.value) {
            resizeCanvas(parseInt(resizeWidth.value), parseInt(resizeHeight.value));
        } else if (resizeKB.value) {
            resizeToTargetSize(parseInt(resizeKB.value) * 1024);
        }
    });

    function resizeCanvas(newWidth, newHeight) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        tempCanvas.width = newWidth;
        tempCanvas.height = newHeight;

        tempCtx.drawImage(canvas, 0, 0, newWidth, newHeight);

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(tempCanvas, 0, 0);
    }

    function resizeToTargetSize(targetSize) {
        let minQuality = 0.05;
        let maxQuality = 1.0;
        let iterations = 15; // Increased iterations for better accuracy

        function attemptResize(currentQuality, attempt = 1) {
            canvas.toBlob(blob => {
                if (Math.abs(blob.size - targetSize) < 1024 || attempt >= iterations) {
                    downloadImage(blob);
                } else if (blob.size > targetSize) {
                    maxQuality = currentQuality;
                } else {
                    minQuality = currentQuality;
                }

                if (attempt < iterations) {
                    currentQuality = (minQuality + maxQuality) / 2;
                    attemptResize(currentQuality, attempt + 1);
                }
            }, 'image/jpeg', currentQuality);
        }

        attemptResize(0.75);
    }

    function downloadImage(blob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'edited-image.jpg';
        link.click();
    }

    downloadBtn.addEventListener('click', () => {
        if (resizeKB.value) {
            resizeToTargetSize(parseInt(resizeKB.value) * 1024);
        } else {
            canvas.toBlob(blob => {
                downloadImage(blob);
            }, 'image/jpeg');
        }
    });

    document.getElementById('reset').addEventListener('click', () => {
        Object.values(filters).forEach(filter => filter.value = filter.defaultValue);
        ctx.filter = 'none';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    });
});
