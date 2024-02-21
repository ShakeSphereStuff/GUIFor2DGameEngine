document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const clearBtn = document.getElementById('clearBtn');
    const colorPicker = document.getElementById('colorPicker');
    const brushSizeSelector = document.getElementById('brushSize');

    let drawing = false;
    let brushColor = '#000000';
    let brushSize = 10;

    // Set canvas size
    canvas.width = window.innerWidth - 40;
    canvas.height = window.innerHeight - 100;

    // Start drawing
    canvas.addEventListener('mousedown', (e) => {
        drawing = true;
        draw(e); // To draw a dot on click without moving the mouse
    });

    // Draw
    canvas.addEventListener('mousemove', draw);

    // Stop drawing
    canvas.addEventListener('mouseup', () => drawing = false);
    canvas.addEventListener('mouseout', () => drawing = false);

    // Clear canvas
    clearBtn.addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height));

    // Color change
    colorPicker.addEventListener('change', (e) => brushColor = e.target.value);

    // Brush size change
    brushSizeSelector.addEventListener('change', (e) => brushSize = e.target.value);

    function draw(e) {
        if (!drawing) return;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = brushColor;

        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    }
});
