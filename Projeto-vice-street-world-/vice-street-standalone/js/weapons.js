// Sistema de armas aprimorado

class Weapon {
    constructor(camera) {
        this.camera = camera;
        this.ammo = CONFIG.WEAPONS.MAGNUM.AMMO_MAX;
        this.maxAmmo = CONFIG.WEAPONS.MAGNUM.AMMO_MAX;
        this.damage = CONFIG.WEAPONS.MAGNUM.DAMAGE;
        this.range = CONFIG.WEAPONS.MAGNUM.RANGE;
        this.reloadTime = CONFIG.WEAPONS.MAGNUM.RELOAD_TIME;
        this.fireRate = CONFIG.WEAPONS.MAGNUM.FIRE_RATE;
        this.lastFired = 0;
        this.isReloading = false;
        
        // Criar raycaster para detecção de tiros
        this.raycaster = new THREE.Raycaster();
        
        // Inicializar arma
        this.init();
    }
    
    init() {
        // Criar modelo da arma visível na tela
        this.createWeaponModel();
    }
    
    createWeaponModel() {
        // Criar grupo para o modelo da arma
        this.weaponModel = new THREE.Group();
        
        // Corpo da arma
        const bodyGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.8);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x696969,
            metalness: 0.8,
            roughness: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.weaponModel.add(body);
        
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
        this.weaponModel.add(barrel);
        
        // Cabo
        const handleGeometry = new THREE.BoxGeometry(0.15, 0.4, 0.25);
        const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.position.set(0, -0.3, -0.1);
        this.weaponModel.add(handle);
        
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
        this.weaponModel.add(cylinder);
        
        // Gatilho
        const triggerGeometry = new THREE.BoxGeometry(0.05, 0.15, 0.05);
        const triggerMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
        const trigger = new THREE.Mesh(triggerGeometry, triggerMaterial);
        trigger.position.set(0, -0.1, 0.1);
        this.weaponModel.add(trigger);
        
        // Posicionar arma na tela
        this.weaponModel.position.set(0.3, -0.3, -0.5);
        this.weaponModel.rotation.set(0, -Math.PI / 12, 0);
        this.weaponModel.visible = false; // Inicialmente invisível até ser coletada
        
        // Adicionar à câmera
        this.camera.add(this.weaponModel);
    }
    
    fire() {
        // Verificar se pode disparar
        const now = Date.now();
        if (this.isReloading) return;
        if (now - this.lastFired < this.fireRate) return;
        if (this.ammo <= 0) {
            this.reload();
            return;
        }
        
        // Atualizar último disparo
        this.lastFired = now;
        
        // Reduzir munição
        this.ammo--;
        
        // Atualizar HUD
        document.querySelector('.ammo-count').textContent = `${this.ammo}/${this.maxAmmo}`;
        
        // Reproduzir som de tiro
        if (audioManager) {
            audioManager.playSound('gunshot');
        }
        
        // Criar efeito de flash
        this.createMuzzleFlash();
        
        // Animar recuo da arma
        this.animateRecoil();
        
        // Detectar colisões do tiro
        this.detectHit();
    }
    
    reload() {
        if (this.isReloading || this.ammo === this.maxAmmo) return;
        
        // Iniciar recarga
        this.isReloading = true;
        
        // Reproduzir som de recarga
        if (audioManager) {
            audioManager.playSound('reload');
        }
        
        // Atualizar HUD
        document.querySelector('.ammo-count').textContent = 'Recarregando...';
        
        // Animar recarga
        this.animateReload();
        
        // Definir timeout para concluir recarga
        setTimeout(() => {
            this.ammo = this.maxAmmo;
            this.isReloading = false;
            
            // Atualizar HUD
            document.querySelector('.ammo-count').textContent = `${this.ammo}/${this.maxAmmo}`;
        }, this.reloadTime);
    }
    
    animateRecoil() {
        if (!this.weaponModel) return;
        
        // Posição e rotação originais
        const originalPosition = new THREE.Vector3(0.3, -0.3, -0.5);
        const originalRotation = new THREE.Euler(0, -Math.PI / 12, 0);
        
        // Posição e rotação de recuo
        this.weaponModel.position.z += 0.1;
        this.weaponModel.rotation.x -= 0.2;
        
        // Retornar à posição original
        setTimeout(() => {
            // Animar suavemente de volta
            const duration = 100; // ms
            const startTime = Date.now();
            
            const animate = () => {
                const now = Date.now();
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Interpolação linear
                this.weaponModel.position.z = originalPosition.z + 0.1 * (1 - progress);
                this.weaponModel.rotation.x = originalRotation.x - 0.2 * (1 - progress);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            animate();
        }, 50);
    }
    
    animateReload() {
        if (!this.weaponModel) return;
        
        // Posição e rotação originais
        const originalPosition = new THREE.Vector3(0.3, -0.3, -0.5);
        const originalRotation = new THREE.Euler(0, -Math.PI / 12, 0);
        
        // Animação de recarga (rotação do tambor)
        const cylinder = this.weaponModel.children[3];
        if (cylinder) {
            // Salvar rotação original
            const originalCylinderRotation = cylinder.rotation.z;
            
            // Animar rotação do tambor
            const duration = this.reloadTime;
            const startTime = Date.now();
            const rotations = 2; // Número de rotações completas
            
            const animate = () => {
                const now = Date.now();
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Rotação do tambor
                cylinder.rotation.z = originalCylinderRotation + progress * Math.PI * 2 * rotations;
                
                // Movimento da arma
                if (progress < 0.5) {
                    // Primeira metade: mover para baixo e girar
                    const halfProgress = progress * 2; // 0 a 1 na primeira metade
                    this.weaponModel.position.y = originalPosition.y - 0.2 * Math.sin(halfProgress * Math.PI);
                    this.weaponModel.rotation.x = originalRotation.x + 0.3 * Math.sin(halfProgress * Math.PI);
                } else {
                    // Segunda metade: retornar à posição original
                    const halfProgress = (progress - 0.5) * 2; // 0 a 1 na segunda metade
                    this.weaponModel.position.y = originalPosition.y - 0.2 * Math.sin((1 - halfProgress) * Math.PI);
                    this.weaponModel.rotation.x = originalRotation.x + 0.3 * Math.sin((1 - halfProgress) * Math.PI);
                }
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Garantir que voltou à posição original
                    this.weaponModel.position.copy(originalPosition);
                    this.weaponModel.rotation.copy(originalRotation);
                }
            };
            
            animate();
        }
    }
    
    createMuzzleFlash() {
        // Criar geometria do flash
        const flashGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const flashMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            transparent: true,
            opacity: 0.8
        });
        
        // Criar malha do flash
        const flash = new THREE.Mesh(flashGeometry, flashMaterial);
        
        // Posicionar na frente da arma
        flash.position.set(0, 0, 1.1);
        this.weaponModel.add(flash);
        
        // Adicionar luz pontual para iluminação dinâmica
        const flashLight = new THREE.PointLight(0xffff00, 2, 3, 2);
        flashLight.position.copy(flash.position);
        this.weaponModel.add(flashLight);
        
        // Remover após um curto período
        setTimeout(() => {
            this.weaponModel.remove(flash);
            this.weaponModel.remove(flashLight);
        }, 50);
    }
    
    detectHit() {
        // Configurar raycaster na direção da câmera
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(this.camera.quaternion);
        
        this.raycaster.set(this.camera.position, direction);
        
        // Verificar colisões com objetos
        if (worldManager) {
            const intersects = this.raycaster.intersectObjects(worldManager.getCollidableObjects(), true);
            
            if (intersects.length > 0 && intersects[0].distance < this.range) {
                // Criar efeito de impacto
                this.createImpactEffect(intersects[0].point, intersects[0].face.normal);
            }
        }
    }
    
    createImpactEffect(position, normal) {
        // Criar grupo para o efeito de impacto
        const impactGroup = new THREE.Group();
        impactGroup.position.copy(position);
        
        // Orientar o grupo para a normal da superfície
        const normalMatrix = new THREE.Matrix4();
        normalMatrix.lookAt(new THREE.Vector3(0, 0, 0), normal, new THREE.Vector3(0, 1, 0));
        impactGroup.setRotationFromMatrix(normalMatrix);
        
        // Criar marca de impacto (círculo)
        const impactGeometry = new THREE.CircleGeometry(0.1, 16);
        const impactMaterial = new THREE.MeshBasicMaterial({
            color: 0x333333,
            side: THREE.DoubleSide
        });
        const impact = new THREE.Mesh(impactGeometry, impactMaterial);
        impact.position.set(0, 0, 0.01); // Ligeiramente acima da superfície
        impactGroup.add(impact);
        
        // Criar partículas de impacto
        const particleCount = 10;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleSizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            // Posição inicial no centro
            particlePositions[i * 3] = 0;
            particlePositions[i * 3 + 1] = 0;
            particlePositions[i * 3 + 2] = 0;
            
            // Tamanho aleatório
            particleSizes[i] = Math.random() * 0.03 + 0.01;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xff0000,
            size: 0.05,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        impactGroup.add(particles);
        
        // Adicionar à cena
        this.camera.parent.add(impactGroup);
        
        // Animar partículas
        const velocities = [];
        for (let i = 0; i < particleCount; i++) {
            velocities.push({
                x: (Math.random() - 0.5) * 0.1,
                y: (Math.random() - 0.5) * 0.1,
                z: (Math.random() - 0.5) * 0.1 + 0.05 // Tendência para frente
            });
        }
        
        const startTime = Date.now();
        const duration = 300; // ms
        
        const animateParticles = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Atualizar posições das partículas
            const positions = particles.geometry.attributes.position.array;
            
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] += velocities[i].x;
                positions[i * 3 + 1] += velocities[i].y;
                positions[i * 3 + 2] += velocities[i].z;
                
                // Aplicar gravidade
                velocities[i].y -= 0.001;
            }
            
            particles.geometry.attributes.position.needsUpdate = true;
            
            // Diminuir opacidade gradualmente
            particleMaterial.opacity = 0.8 * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animateParticles);
            } else {
                // Remover da cena
                this.camera.parent.remove(impactGroup);
            }
        };
        
        animateParticles();
    }
    
    show() {
        if (this.weaponModel) {
            this.weaponModel.visible = true;
        }
    }
    
    hide() {
        if (this.weaponModel) {
            this.weaponModel.visible = false;
        }
    }
    
    update(delta) {
        // Animação suave de movimento da arma ao caminhar
        if (this.weaponModel && this.weaponModel.visible && controlsManager) {
            if (controlsManager.moveForward || controlsManager.moveBackward || 
                controlsManager.moveLeft || controlsManager.moveRight) {
                
                // Movimento de balanço ao caminhar
                const walkingOffset = Math.sin(Date.now() * 0.01) * 0.02;
                this.weaponModel.position.y = -0.3 + walkingOffset;
                this.weaponModel.position.x = 0.3 + Math.cos(Date.now() * 0.01) * 0.01;
            }
        }
    }
}
