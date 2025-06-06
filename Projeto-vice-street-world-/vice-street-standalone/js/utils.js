// Funções utilitárias para o jogo

// Calcular distância entre dois objetos
function getDistance(obj1, obj2) {
    const dx = obj1.position.x - obj2.position.x;
    const dy = obj1.position.y - obj2.position.y;
    const dz = obj1.position.z - obj2.position.z;
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Gerar número aleatório dentro de um intervalo
function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Gerar número inteiro aleatório dentro de um intervalo
function getRandomIntInRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Converter graus para radianos
function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

// Converter radianos para graus
function radToDeg(radians) {
    return radians * (180 / Math.PI);
}

// Limitar um valor dentro de um intervalo
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Interpolar linearmente entre dois valores
function lerp(a, b, t) {
    return a + (b - a) * t;
}

// Verificar colisão entre dois objetos (simplificado para caixas delimitadoras)
function checkCollision(obj1, obj2) {
    // Obter dimensões dos objetos
    const box1 = new THREE.Box3().setFromObject(obj1);
    const box2 = new THREE.Box3().setFromObject(obj2);
    
    // Verificar interseção
    return box1.intersectsBox(box2);
}

// Criar texto 3D
function createText3D(text, options = {}) {
    const defaults = {
        size: 1,
        height: 0.2,
        curveSegments: 4,
        bevelEnabled: false,
        color: 0xffffff
    };
    
    const config = { ...defaults, ...options };
    
    const textGeometry = new THREE.TextGeometry(text, {
        font: config.font || null,
        size: config.size,
        height: config.height,
        curveSegments: config.curveSegments,
        bevelEnabled: config.bevelEnabled
    });
    
    const textMaterial = new THREE.MeshStandardMaterial({
        color: config.color,
        metalness: 0.3,
        roughness: 0.4
    });
    
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    
    // Centralizar texto
    textGeometry.computeBoundingBox();
    const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
    textMesh.position.x = -textWidth / 2;
    
    return textMesh;
}

// Criar sprite de texto
function createTextSprite(message, parameters) {
    if (parameters === undefined) parameters = {};
    
    const fontface = parameters.fontface || 'Arial';
    const fontsize = parameters.fontsize || 18;
    const borderThickness = parameters.borderThickness || 4;
    const borderColor = parameters.borderColor || { r:0, g:0, b:0, a:1.0 };
    const backgroundColor = parameters.backgroundColor || { r:255, g:255, b:255, a:1.0 };
    const textColor = parameters.textColor || { r:0, g:0, b:0, a:1.0 };
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;
    
    // Obter tamanho do texto
    const metrics = context.measureText(message);
    const textWidth = metrics.width;
    
    // Configurar background e borda
    context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";
    context.lineWidth = borderThickness;
    
    // Desenhar borda e background
    const roundRect = function(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x+r, y);
        ctx.lineTo(x+w-r, y);
        ctx.quadraticCurveTo(x+w, y, x+w, y+r);
        ctx.lineTo(x+w, y+h-r);
        ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
        ctx.lineTo(x+r, y+h);
        ctx.quadraticCurveTo(x, y+h, x, y+h-r);
        ctx.lineTo(x, y+r);
        ctx.quadraticCurveTo(x, y, x+r, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();   
    }
    
    roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
    
    // Desenhar texto
    context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
    context.fillText(message, borderThickness, fontsize + borderThickness);
    
    // Criar textura e sprite
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
    
    return sprite;
}

// Criar efeito de partículas
function createParticleEffect(options = {}) {
    const defaults = {
        count: 100,
        size: 0.1,
        color: 0xffffff,
        opacity: 0.8,
        lifetime: 2000,
        speed: 1,
        position: new THREE.Vector3(0, 0, 0)
    };
    
    const config = { ...defaults, ...options };
    
    // Criar geometria de partículas
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(config.count * 3);
    const particleSizes = new Float32Array(config.count);
    
    for (let i = 0; i < config.count; i++) {
        // Posição inicial no centro
        particlePositions[i * 3] = config.position.x;
        particlePositions[i * 3 + 1] = config.position.y;
        particlePositions[i * 3 + 2] = config.position.z;
        
        // Tamanho aleatório
        particleSizes[i] = Math.random() * config.size + config.size * 0.5;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    
    // Criar material de partículas
    const particleMaterial = new THREE.PointsMaterial({
        color: config.color,
        size: config.size,
        transparent: true,
        opacity: config.opacity,
        sizeAttenuation: true
    });
    
    // Criar sistema de partículas
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    
    // Criar velocidades aleatórias
    const velocities = [];
    for (let i = 0; i < config.count; i++) {
        velocities.push({
            x: (Math.random() - 0.5) * config.speed,
            y: (Math.random() - 0.5) * config.speed,
            z: (Math.random() - 0.5) * config.speed
        });
    }
    
    // Função de atualização
    const update = (delta) => {
        const positions = particles.geometry.attributes.position.array;
        
        for (let i = 0; i < config.count; i++) {
            positions[i * 3] += velocities[i].x * delta;
            positions[i * 3 + 1] += velocities[i].y * delta;
            positions[i * 3 + 2] += velocities[i].z * delta;
            
            // Aplicar gravidade
            velocities[i].y -= 0.01 * delta;
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
    };
    
    return {
        mesh: particles,
        update: update,
        lifetime: config.lifetime
    };
}
