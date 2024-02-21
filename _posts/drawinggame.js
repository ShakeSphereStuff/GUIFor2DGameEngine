document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth - 40;
    canvas.height = window.innerHeight - 100;
    ctx.fillStyle = "#FFFFFF"; // Default canvas background color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill canvas with default color

    const clearBtn = document.getElementById('clearBtn');
    const colorPicker = document.getElementById('colorPicker');
    const bgColorPicker = document.getElementById('bgColorPicker');
    const brushSizeSelector = document.getElementById('brushSize');
    const opacitySlider = document.getElementById('opacity');
    const saveBtn = document.getElementById('saveBtn');

    let drawing = false;
    let brushColor = '#000000';
    let brushSize = 10;
    let brushOpacity = 1;

    function startDrawing(e) {
        drawing = true;
        draw(e); // Draw a dot at click position
    }

    function draw(e) {
        if (!drawing) return;
        ctx.globalAlpha = brushOpacity; // Set the opacity of the brush
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = brushColor;

        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    }

    function stopDrawing() {
        drawing = false;
        ctx.beginPath(); // Start a new path to prevent dragging from the last point
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Reapply the background color after clearing.
        ctx.fillStyle = bgColorPicker.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function changeBrushColor() {
        brushColor = colorPicker.value;
    }

    function changeBgColor() {
        ctx.fillStyle = bgColorPicker.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function changeBrushSize() {
        brushSize = brushSizeSelector.value;
    }

    function changeOpacity() {
        brushOpacity = opacitySlider.value / 100;
    }

    function saveDrawing() {
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'my-drawing.png';
        link.href = dataURL;
        link.click();
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    clearBtn.addEventListener('click', clearCanvas);
    colorPicker.addEventListener('change', changeBrushColor);
    bgColorPicker.addEventListener('change', changeBgColor);
    brushSizeSelector.addEventListener('change', changeBrushSize);
    opacitySlider.addEventListener('input', changeOpacity);
    saveBtn.addEventListener('click', saveDrawing);
});
