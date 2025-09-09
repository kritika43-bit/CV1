(function() {
    console.log('Light rays background script starting...');
    
    // Check if container exists
    const container = document.getElementById('light-rays-bg');
    if (!container) {
        console.error('Light rays container not found!');
        return;
    }
    
    console.log('Light rays container found, setting up...');
    
    // Set container to cover entire viewport
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.zIndex = '-1';
    container.style.pointerEvents = 'none';
    container.style.overflow = 'hidden';
    container.style.background = 'linear-gradient(45deg, #000000, #1a1a2e, #16213e)';
    
    // Create a simple animated background as fallback
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create animated light rays effect
    const rays = [];
    const numRays = 15;
    
    // Initialize rays
    for (let i = 0; i < numRays; i++) {
        rays.push({
            x: Math.random() * canvas.width,
            y: -50,
            length: 100 + Math.random() * 200,
            speed: 1 + Math.random() * 2,
            opacity: 0.1 + Math.random() * 0.3,
            angle: Math.random() * Math.PI * 2,
            width: 2 + Math.random() * 4
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(0.5, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw rays
        rays.forEach((ray, index) => {
            ray.y += ray.speed;
            ray.x += Math.sin(ray.angle) * 0.5;
            
            // Reset ray if it goes off screen
            if (ray.y > canvas.height + ray.length) {
                ray.y = -ray.length;
                ray.x = Math.random() * canvas.width;
                ray.opacity = 0.1 + Math.random() * 0.3;
            }
            
            // Draw ray
            ctx.save();
            ctx.globalAlpha = ray.opacity;
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = ray.width;
            ctx.lineCap = 'round';
            
            ctx.beginPath();
            ctx.moveTo(ray.x, ray.y);
            ctx.lineTo(ray.x + Math.sin(ray.angle) * ray.length, ray.y + ray.length);
            ctx.stroke();
            
            // Add glow effect
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.restore();
        });
        
        // Add some floating particles
        for (let i = 0; i < 20; i++) {
            const x = (i * 100 + Date.now() * 0.01) % canvas.width;
            const y = (i * 50 + Date.now() * 0.005) % canvas.height;
            
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#00ffff';
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    console.log('Starting light rays animation...');
    animate();
    
    console.log('Light rays background setup complete!');
})(); 