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
        let width = resizeWidth.value;
        let height = resizeHeight.value;

        if (width && height) {
            resizeCanvas(width, height);
        } else if (resizeKB.value) {
            resizeToTargetSize(resizeKB.value * 1024);
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
        let quality = 0.9;
        function compress() {
            canvas.toBlob(blob => {
                if (blob.size > targetSize && quality > 0.1) {
                    quality -= 0.05;
                    compress();
                } else {
                    const imgUrl = URL.createObjectURL(blob);
                    const tempImg = new Image();
                    tempImg.onload = () => {
                        canvas.width = tempImg.width;
                        canvas.height = tempImg.height;
                        ctx.drawImage(tempImg, 0, 0);
                    };
                    tempImg.src = imgUrl;
                }
            }, 'image/jpeg', quality);
        }
        compress();
    }

    downloadBtn.addEventListener('click', () => {
        canvas.toBlob(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'edited-image.jpg';
            link.click();
        }, 'image/jpeg');
    });

    document.getElementById('reset').addEventListener('click', () => {
        Object.values(filters).forEach(filter => filter.value = filter.defaultValue);
        ctx.filter = 'none';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    });
});
