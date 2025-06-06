// Sistema de mundo e ambiente urbano
class WorldManager {
    constructor(scene) {
        this.scene = scene;
        this.objects = [];
        this.interactableObjects = [];
        this.collidableObjects = [];
        this.lights = [];
        this.weather = CONFIG.WORLD.WEATHER;
        this.timeOfDay = CONFIG.WORLD.TIME_OF_DAY;
        
        // Inicializar mundo
        this.init();
    }
    
    init() {
        // Adicionar iluminação
        this.setupLighting();
        
        // Adicionar céu
        this.setupSky();
        
        // Adicionar chão
        this.setupGround();
        
        // Adicionar prédios
        this.setupBuildings();
        
        // Adicionar estradas
        this.setupRoads();
        
        // Adicionar objetos decorativos
        this.setupDecorations();
        
        // Adicionar objetos interativos para a Missão 1
        this.setupMission1Objects();
        
        // Configurar efeitos climáticos
        this.setupWeather();
    }
    
    setupLighting() {
        // Luz ambiente
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
        this.lights.push(ambientLight);
        
        // Luz direcional (sol/lua)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        
        // Configurar sombras
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        
        this.scene.add(directionalLight);
        this.lights.push(directionalLight);
        
        // Luzes de neon para ambiente anos 80
        this.addNeonLights();
    }
    
    addNeonLights() {
        // Cores de neon
        const neonColors = [
            0xff00ff, // Rosa
            0x00ffff, // Ciano
            0xff0066, // Magenta
            0x0066ff, // Azul
            0xff6600  // Laranja
        ];
        
        // Adicionar várias luzes pontuais com cores de neon
        for (let i = 0; i < 10; i++) {
            const color = neonColors[Math.floor(Math.random() * neonColors.length)];
            const intensity = 2;
            const distance = 15;
            const decay = 2;
            
            const light = new THREE.PointLight(color, intensity, distance, decay);
            
            // Posicionar aleatoriamente ao redor da área central
            const angle = Math.random() * Math.PI * 2;
            const radius = 10 + Math.random() * 20;
            light.position.set(
                Math.cos(angle) * radius,
                3 + Math.random() * 5,
                Math.sin(angle) * radius
            );
            
            this.scene.add(light);
            this.lights.push(light);
        }
    }
    
    setupSky() {
        // Criar céu estrelado para ambiente noturno anos 80
        const skyGeometry = new THREE.SphereGeometry(200, 32, 32);
        const skyMaterial = new THREE.MeshBasicMaterial({
            color: 0x000022,
            side: THREE.BackSide
        });
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(sky);
        
        // Adicionar estrelas
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5,
            transparent: true,
            opacity: 0.8
        });
        
        const starsVertices = [];
        for (let i = 0; i < 1000; i++) {
            const x = Math.random() * 400 - 200;
            const y = Math.random() * 200 - 50;
            const z = Math.random() * 400 - 200;
            starsVertices.push(x, y, z);
        }
        
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(stars);
        
        // Adicionar lua
        const moonGeometry = new THREE.SphereGeometry(10, 32, 32);
        const moonMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffcc
        });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.position.set(100, 80, -150);
        this.scene.add(moon);
        
        // Adicionar brilho à lua
        const moonLight = new THREE.PointLight(0xffffcc, 1, 200, 1);
        moonLight.position.copy(moon.position);
        this.scene.add(moonLight);
        this.lights.push(moonLight);
    }
    
    setupGround() {
        // Criar chão
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        this.objects.push(ground);
        this.collidableObjects.push(ground);
    }
    
    setupBuildings() {
        // Criar vários prédios com estilo anos 80
        const buildingCount = 20;
        const buildingColors = [
            0x333333, // Cinza escuro
            0x555555, // Cinza médio
            0x222222, // Quase preto
            0x444444  // Cinza
        ];
        
        for (let i = 0; i < buildingCount; i++) {
            // Posição aleatória
            const x = Math.random() * 160 - 80;
            const z = Math.random() * 160 - 80;
            
            // Evitar colocar prédios muito próximos ao centro
            if (Math.abs(x) < 15 && Math.abs(z) < 15) continue;
            
            // Dimensões aleatórias
            const width = 5 + Math.random() * 10;
            const height = 10 + Math.random() * 30;
            const depth = 5 + Math.random() * 10;
            
            // Criar prédio
            const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
            const buildingMaterial = new THREE.MeshStandardMaterial({
                color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
                roughness: 0.7,
                metalness: 0.3
            });
            const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
            
            // Posicionar prédio
            building.position.set(x, height / 2, z);
            building.castShadow = true;
            building.receiveShadow = true;
            
            this.scene.add(building);
            this.objects.push(building);
            this.collidableObjects.push(building);
            
            // Adicionar janelas com luzes de neon
            this.addBuildingWindows(building, width, height, depth);
        }
    }
    
    addBuildingWindows(building, width, height, depth) {
        // Número de janelas
        const windowsX = Math.floor(width / 2);
        const windowsY = Math.floor(height / 3);
        const windowsZ = Math.floor(depth / 2);
        
        // Tamanho das janelas
        const windowSize = 0.5;
        
        // Cores de neon para janelas
        const windowColors = [
            0xff00ff, // Rosa
            0x00ffff, // Ciano
            0xffff00, // Amarelo
            0xff6600  // Laranja
        ];
        
        // Criar janelas para cada lado do prédio
        const sides = [
            { dir: 'front', x: 0, z: depth / 2 + 0.01, rotY: 0 },
            { dir: 'back', x: 0, z: -depth / 2 - 0.01, rotY: Math.PI },
            { dir: 'left', x: -width / 2 - 0.01, z: 0, rotY: -Math.PI / 2 },
            { dir: 'right', x: width / 2 + 0.01, z: 0, rotY: Math.PI / 2 }
        ];
        
        sides.forEach(side => {
            // Determinar número de janelas para este lado
            const windowsHorizontal = side.dir === 'front' || side.dir === 'back' ? windowsX : windowsZ;
            
            // Criar janelas
            for (let y = 0; y < windowsY; y++) {
                for (let x = 0; x < windowsHorizontal; x++) {
                    // Apenas algumas janelas acesas
                    if (Math.random() > 0.3) continue;
                    
                    // Posição da janela
                    const windowX = side.dir === 'front' || side.dir === 'back'
                        ? (x - windowsHorizontal / 2 + 0.5) * (width / windowsHorizontal)
                        : 0;
                    const windowY = (y - windowsY / 2 + 0.5) * (height / windowsY) + height / 2;
                    const windowZ = side.dir === 'left' || side.dir === 'right'
                        ? (x - windowsHorizontal / 2 + 0.5) * (depth / windowsHorizontal)
                        : 0;
                    
                    // Criar geometria da janela
                    const windowGeometry = new THREE.PlaneGeometry(windowSize, windowSize);
                    const windowMaterial = new THREE.MeshBasicMaterial({
                        color: windowColors[Math.floor(Math.random() * windowColors.length)],
                        transparent: true,
                        opacity: 0.8
                    });
                    const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
                    
                    // Posicionar janela
                    windowMesh.position.set(
                        side.x + windowX,
                        windowY,
                        side.z + windowZ
                    );
                    windowMesh.rotation.y = side.rotY;
                    
                    // Adicionar à cena
                    building.add(windowMesh);
                    
                    // Adicionar luz pontual para algumas janelas (menos frequente)
                    if (Math.random() > 0.7) {
                        const windowLight = new THREE.PointLight(
                            windowMaterial.color,
                            0.5,
                            5,
                            2
                        );
                        windowLight.position.copy(windowMesh.position);
                        building.add(windowLight);
                        this.lights.push(windowLight);
                    }
                }
            }
        });
    }
    
    setupRoads() {
        // Criar estradas principais em formato de cruz
        const roadWidth = 10;
        const roadLength = 200;
        
        // Material da estrada
        const roadMaterial = new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.9,
            metalness: 0.1
        });
        
        // Estrada norte-sul
        const roadNSGeometry = new THREE.PlaneGeometry(roadWidth, roadLength);
        const roadNS = new THREE.Mesh(roadNSGeometry, roadMaterial);
        roadNS.rotation.x = -Math.PI / 2;
        roadNS.position.y = 0.01; // Ligeiramente acima do chão para evitar z-fighting
        this.scene.add(roadNS);
        
        // Estrada leste-oeste
        const roadEWGeometry = new THREE.PlaneGeometry(roadLength, roadWidth);
        const roadEW = new THREE.Mesh(roadEWGeometry, roadMaterial);
        roadEW.rotation.x = -Math.PI / 2;
        roadEW.position.y = 0.01;
        this.scene.add(roadEW);
        
        // Adicionar linhas na estrada
        this.addRoadLines();
    }
    
    addRoadLines() {
        // Material para as linhas da estrada
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        
        // Linhas na estrada norte-sul
        for (let z = -95; z < 100; z += 10) {
            const lineGeometry = new THREE.PlaneGeometry(0.5, 5);
            const line = new THREE.Mesh(lineGeometry, lineMaterial);
            line.rotation.x = -Math.PI / 2;
            line.position.set(0, 0.02, z);
            this.scene.add(line);
        }
        
        // Linhas na estrada leste-oeste
        for (let x = -95; x < 100; x += 10) {
            const lineGeometry = new THREE.PlaneGeometry(5, 0.5);
            const line = new THREE.Mesh(lineGeometry, lineMaterial);
            line.rotation.x = -Math.PI / 2;
            line.position.set(x, 0.02, 0);
            this.scene.add(line);
        }
    }
    
    setupDecorations() {
        // Adicionar postes de luz
        this.addLightPosts();
        
        // Adicionar placas de neon
        this.addNeonSigns();
    }
    
    addLightPosts() {
        // Posicionar postes de luz ao longo das estradas
        for (let i = -80; i <= 80; i += 40) {
            // Postes na estrada norte-sul
            this.createLightPost(6, 0, i);
            this.createLightPost(-6, 0, i);
            
            // Postes na estrada leste-oeste
            this.createLightPost(i, 0, 6);
            this.createLightPost(i, 0, -6);
        }
    }
    
    createLightPost(x, y, z) {
        // Criar poste
        const postGeometry = new THREE.CylinderGeometry(0.2, 0.2, 5, 8);
        const postMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.8,
            metalness: 0.5
        });
        const post = new THREE.Mesh(postGeometry, postMaterial);
        post.position.set(x, 2.5, z);
        post.castShadow = true;
        this.scene.add(post);
        
        // Criar braço do poste
        const armGeometry = new THREE.BoxGeometry(2, 0.2, 0.2);
        const arm = new THREE.Mesh(armGeometry, postMaterial);
        arm.position.set(x + 1, 5, z);
        this.scene.add(arm);
        
        // Criar luminária
        const lampGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const lampMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffcc,
            transparent: true,
            opacity: 0.8
        });
        const lamp = new THREE.Mesh(lampGeometry, lampMaterial);
        lamp.position.set(x + 2, 5, z);
        this.scene.add(lamp);
        
        // Adicionar luz
        const light = new THREE.PointLight(0xffffcc, 1, 15, 2);
        light.position.copy(lamp.position);
        this.scene.add(light);
        this.lights.push(light);
    }
    
    addNeonSigns() {
        // Adicionar algumas placas de neon aos prédios
        const neonSigns = [
            { text: "VICE", color: 0xff00ff },
            { text: "CLUB", color: 0x00ffff },
            { text: "HOTEL", color: 0xff6600 },
            { text: "BAR", color: 0xffff00 }
        ];
        
        // Posições para as placas
        const positions = [
            { x: 20, y: 10, z: 15, rotY: 0 },
            { x: -15, y: 8, z: -25, rotY: Math.PI / 4 },
            { x: 30, y: 15, z: -20, rotY: -Math.PI / 6 },
            { x: -25, y: 12, z: 30, rotY: Math.PI / 2 }
        ];
        
        // Criar placas
        for (let i = 0; i < positions.length; i++) {
            const sign = neonSigns[i % neonSigns.length];
            const pos = positions[i];
            
            // Criar placa de fundo
            const backGeometry = new THREE.PlaneGeometry(sign.text.length * 1.2, 2);
            const backMaterial = new THREE.MeshStandardMaterial({
                color: 0x111111,
                roughness: 0.9,
                metalness: 0.1
            });
            const back = new THREE.Mesh(backGeometry, backMaterial);
            back.position.set(pos.x, pos.y, pos.z);
            back.rotation.y = pos.rotY;
            this.scene.add(back);
            
            // Criar texto de neon (simplificado como uma caixa colorida)
            const textGeometry = new THREE.PlaneGeometry(sign.text.length, 1);
            const textMaterial = new THREE.MeshBasicMaterial({
                color: sign.color,
                transparent: true,
                opacity: 0.9
            });
            const text = new THREE.Mesh(textGeometry, textMaterial);
            text.position.set(pos.x, pos.y, pos.z + 0.1);
            text.rotation.y = pos.rotY;
            this.scene.add(text);
            
            // Adicionar luz de neon
            const neonLight = new THREE.PointLight(sign.color, 1, 10, 2);
            neonLight.position.copy(text.position);
            this.scene.add(neonLight);
            this.lights.push(neonLight);
        }
    }
    
    setupMission1Objects() {
        // Adicionar moto para a Missão 1
        this.createMotorcycle(15, 0, 15);
        
        // Adicionar arma Magnum para a Missão 1
        this.createMagnum(-15, 0, -15);
    }
    
    createMotorcycle(x, y, z) {
        // Grupo para a moto
        const motorcycle = new THREE.Group();
        
        // Corpo da moto (simplificado)
        const bodyGeometry = new THREE.BoxGeometry(2, 1, 4);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            roughness: 0.5,
            metalness: 0.8
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.5;
        motorcycle.add(body);
        
        // Rodas
        const wheelGeometry = new THREE.CylinderGeometry(0.7, 0.7, 0.3, 16);
        const wheelMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.8,
            metalness: 0.5
        });
        
        // Roda dianteira
        const frontWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        frontWheel.rotation.z = Math.PI / 2;
        frontWheel.position.set(0, 0.7, 1.5);
        motorcycle.add(frontWheel);
        
        // Roda traseira
        const backWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        backWheel.rotation.z = Math.PI / 2;
        backWheel.position.set(0, 0.7, -1.5);
        motorcycle.add(backWheel);
        
        // Guidão
        const handlebarGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
        const handlebarMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            roughness: 0.3,
            metalness: 0.9
        });
        const handlebar = new THREE.Mesh(handlebarGeometry, handlebarMaterial);
        handlebar.rotation.z = Math.PI / 2;
        handlebar.position.set(0, 1.2, 1.8);
        motorcycle.add(handlebar);
        
        // Assento
        const seatGeometry = new THREE.BoxGeometry(0.8, 0.3, 1.5);
        const seatMaterial = new THREE.MeshStandardMaterial({
            color: 0x663300,
            roughness: 0.9,
            metalness: 0.1
        });
        const seat = new THREE.Mesh(seatGeometry, seatMaterial);
        seat.position.set(0, 1.15, -0.5);
        motorcycle.add(seat);
        
        // Posicionar moto
        motorcycle.position.set(x, y, z);
        motorcycle.rotation.y = Math.PI / 4;
        motorcycle.castShadow = true;
        motorcycle.receiveShadow = true;
        
        // Adicionar dados da moto
        motorcycle.userData = {
            type: 'motorcycle',
            interactable: true,
            message: 'Pressione E para pegar a moto'
        };
        
        this.scene.add(motorcycle);
        this.objects.push(motorcycle);
        this.interactableObjects.push(motorcycle);
        
        // Adicionar luz pontual para destacar a moto
        const motorcycleLight = new THREE.PointLight(0xff6600, 1, 5, 2);
        motorcycleLight.position.set(x, y + 2, z);
        this.scene.add(motorcycleLight);
        this.lights.push(motorcycleLight);
    }
    
    createMagnum(x, y, z) {
        // Grupo para a arma
        const magnum = new THREE.Group();
        
        // Corpo da arma
        const bodyGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.8);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x696969,
            metalness: 0.8,
            roughness: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        magnum.add(body);
        
        // Cano
        const barrelGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8);
        const barrelMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x696969,
            metalness: 0.9,
            roughness: 0.1
        });
        const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
        barrel.rotation.x = Math.PI / 2;
        barrel.position.set(0, 0, 0.6);
        magnum.add(barrel);
        
        // Cabo
        const handleGeometry = new THREE.BoxGeometry(0.15, 0.4, 0.25);
        const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.position.set(0, -0.3, -0.1);
        magnum.add(handle);
        
        // Tambor
        const cylinderGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.2, 8);
        const cylinderMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x888888,
            metalness: 0.8,
            roughness: 0.2
        });
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinder.rotation.z = Math.PI / 2;
        cylinder.position.set(0, 0.05, 0.2);
        magnum.add(cylinder);
        
        // Gatilho
        const triggerGeometry = new THREE.BoxGeometry(0.05, 0.15, 0.05);
        const triggerMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
        const trigger = new THREE.Mesh(triggerGeometry, triggerMaterial);
        trigger.position.set(0, -0.1, 0.1);
        magnum.add(trigger);
        
        // Posicionar arma
        magnum.position.set(x, y + 0.5, z);
        magnum.rotation.y = Math.PI / 6;
        magnum.castShadow = true;
        
        // Adicionar dados da arma
        magnum.userData = {
            type: 'weapon',
            weaponType: 'magnum',
            interactable: true,
            message: 'Pressione E para pegar a Magnum .357'
        };
        
        this.scene.add(magnum);
        this.objects.push(magnum);
        this.interactableObjects.push(magnum);
        
        // Adicionar luz pontual para destacar a arma
        const magnumLight = new THREE.PointLight(0x00ffff, 1, 5, 2);
        magnumLight.position.set(x, y + 2, z);
        this.scene.add(magnumLight);
        this.lights.push(magnumLight);
    }
    
    setupWeather() {
        // Configurar efeitos climáticos com base na configuração
        switch (this.weather) {
            case 'rain':
                this.createRainEffect();
                break;
            case 'fog':
                this.createFogEffect();
                break;
            default:
                // Clima limpo, não fazer nada
                break;
        }
    }
    
    createRainEffect() {
        // Criar sistema de partículas para chuva
        const rainCount = 1000;
        const rainGeometry = new THREE.BufferGeometry();
        const rainPositions = new Float32Array(rainCount * 3);
        
        for (let i = 0; i < rainCount * 3; i += 3) {
            // Posições aleatórias em uma área grande
            rainPositions[i] = Math.random() * 200 - 100;
            rainPositions[i + 1] = Math.random() * 50 + 10;
            rainPositions[i + 2] = Math.random() * 200 - 100;
        }
        
        rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
        
        const rainMaterial = new THREE.PointsMaterial({
            color: 0x99ccff,
            size: 0.2,
            transparent: true,
            opacity: 0.6
        });
        
        this.rain = new THREE.Points(rainGeometry, rainMaterial);
        this.scene.add(this.rain);
        
        // Adicionar névoa leve para ambiente chuvoso
        this.scene.fog = new THREE.FogExp2(0x000033, 0.01);
    }
    
    createFogEffect() {
        // Adicionar névoa densa
        this.scene.fog = new THREE.FogExp2(0x000033, 0.03);
    }
    
    update(delta) {
        // Atualizar efeitos climáticos
        if (this.weather === 'rain' && this.rain) {
            const positions = this.rain.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Mover gotas de chuva para baixo
                positions[i + 1] -= 30 * delta;
                
                // Reposicionar gotas que chegaram ao chão
                if (positions[i + 1] < 0) {
                    positions[i] = Math.random() * 200 - 100;
                    positions[i + 1] = 50;
                    positions[i + 2] = Math.random() * 200 - 100;
                }
            }
            
            this.rain.geometry.attributes.position.needsUpdate = true;
        }
        
        // Atualizar luzes de neon (pulsação)
        this.lights.forEach(light => {
            if (light.color.r > 0.5 || light.color.g > 0.5 || light.color.b > 0.5) {
                light.intensity = 0.8 + Math.sin(Date.now() * 0.003) * 0.2;
            }
        });
    }
    
    getObjects() {
        return this.objects;
    }
    
    getInteractableObjects() {
        return this.interactableObjects;
    }
    
    getCollidableObjects() {
        return this.collidableObjects;
    }
}

// Instância global do gerenciador de mundo
let worldManager;
