document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('c');
    const context = canvas.getContext('2d');
  
    let w = 1;
    let s = 0;
    let p = 0;
    let q = 0;
    let a = 0;
    let b = 0;
    let m = 190;
    let n = 190;
    let x = 300;
    let y = 235;
    let u = -5;
    let v = 3;
  
    function draw() {
      context.clearRect(0, 0, 640, 480);
  
      for (let i = 5; i < 480; i += 20) {
        context.fillRect(318, i, 4, 10);
      }
  
      context.fillStyle = "#FFF";
      context.font = "60px monospace";
      context.fillText(a + " " + b, 266, 60);
  
      context.fillRect(20, m, 20, 100);
      context.fillRect(600, n, 20, 100);
      context.fillRect(x, y, 10, 10);
    }
  
    function update() {
      if (w && !s) return;
      s = 0;
  
      m += p;
      n += q;
      m = m < 0 ? 0 : m;
      m = m > 380 ? 380 : m;
      n = n < 0 ? 0 : n;
      n = n > 380 ? 380 : n;
  
      x += u;
      y += v;
  
      if (y <= 0) {
        y = 0;
        v = -v;
      }
  
      if (y >= 470) {
        y = 470;
        v = -v;
      }
  
      if (x <= 40 && x >= 20 && y < m + 110 && y > m - 10) {
        u = -u + 0.2;
        v += (y - m - 45) / 20;
      }
  
      if (x <= 610 && x >= 590 && y < n + 110 && y > n - 10) {
        u = -u - 0.2;
        v += (y - n - 45) / 20;
      }
  
      if (x < -10) {
        b++;
        x = 360;
        y = 235;
        u = 5;
        w = 1;
      }
  
      if (x > 640) {
        a++;
        x = 280;
        y = 235;
        u = -5;
        w = 1;
      }
    }
  
    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }
  
    window.addEventListener('resize', function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  
    document.onkeydown = function (e) {
      k = (e || window.event).keyCode;
      w = w ? 0 : k == '27' ? 1 : 0;
      p = k == '65' ? 5 : k == '81' ? -5 : p;
      q = k == '40' ? 5 : k == '38' ? -5 : q;
    };
  
    document.onkeyup = function (e) {
      k = (e || window.event).keyCode;
      p = k == '65' || k == '81' ? 0 : p;
      q = k == '38' || k == '40' ? 0 : q;
    };
  
    gameLoop();
  });
  




  