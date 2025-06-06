// Sistema de NPCs melhorado

class NPCManager {
    constructor(scene) {
        this.scene = scene;
        this.npcs = [];
        
        // Inicializar NPCs
        this.init();
    }
    
    init() {
        // Adicionar NPCs para a Missão 1
        this.addNPC(-5, 0, 5, 'Informante', 'Ei, Vic! Ouvi dizer que há uma Magnum .357 perto daquele prédio ao norte. Pode ser útil nestes tempos difíceis.', 0x0000ff);
        this.addNPC(5, 0, -5, 'Mecânico', 'Procurando uma moto? Vi uma Harley abandonada perto do cruzamento leste. Parece em bom estado.', 0xff0000);
    }
    
    addNPC(x, y, z, name, dialogText, color) {
        // Criar NPC com mais detalhes
        const npcGroup = new THREE.Group();
        
        // Corpo do NPC
        const bodyGeometry = new THREE.BoxGeometry(0.8, 1.8, 0.5);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: color,
            roughness: 0.7,
            metalness: 0.3
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.9;
        body.castShadow = true;
        npcGroup.add(body);
        
        // Cabeça do NPC
        const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const headMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffdbac,
            roughness: 0.5,
            metalness: 0.1
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.0;
        head.castShadow = true;
        npcGroup.add(head);
        
        // Adicionar cabelo (simples)
        const hairGeometry = new THREE.SphereGeometry(0.42, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const hairMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x000000,
            roughness: 0.8,
            metalness: 0.1
        });
        const hair = new THREE.Mesh(hairGeometry, hairMaterial);
        hair.position.y = 2.0;
        hair.rotation.x = Math.PI;
        head.add(hair);
        
        // Adicionar olhos
        const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const pupilGeometry = new THREE.SphereGeometry(0.04, 8, 8);
        const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        
        // Olho esquerdo
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.15, 2.05, 0.35);
        npcGroup.add(leftEye);
        
        const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        leftPupil.position.set(0, 0, 0.05);
        leftEye.add(leftPupil);
        
        // Olho direito
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.15, 2.05, 0.35);
        npcGroup.add(rightEye);
        
        const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        rightPupil.position.set(0, 0, 0.05);
        rightEye.add(rightPupil);
        
        // Adicionar boca
        const mouthGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.05);
        const mouthMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        mouth.position.set(0, 1.8, 0.35);
        npcGroup.add(mouth);
        
        // Adicionar braços
        const armGeometry = new THREE.BoxGeometry(0.25, 1.2, 0.25);
        
        // Braço esquerdo
        const leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
        leftArm.position.set(-0.5, 0.6, 0);
        leftArm.castShadow = true;
        npcGroup.add(leftArm);
        
        // Braço direito
        const rightArm = new THREE.Mesh(armGeometry, bodyMaterial);
        rightArm.position.set(0.5, 0.6, 0);
        rightArm.castShadow = true;
        npcGroup.add(rightArm);
        
        // Adicionar pernas
        const legGeometry = new THREE.BoxGeometry(0.35, 1.0, 0.35);
        
        // Perna esquerda
        const leftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
        leftLeg.position.set(-0.2, -0.5, 0);
        leftLeg.castShadow = true;
        npcGroup.add(leftLeg);
        
        // Perna direita
        const rightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
        rightLeg.position.set(0.2, -0.5, 0);
        rightLeg.castShadow = true;
        npcGroup.add(rightLeg);
        
        // Adicionar balão de diálogo flutuante
        const speechBubble = this.createSpeechBubble(name);
        speechBubble.position.set(0, 2.8, 0);
        speechBubble.visible = false;
        npcGroup.add(speechBubble);
        
        // Posicionar NPC
        npcGroup.position.set(x, y, z);
        npcGroup.castShadow = true;
        npcGroup.receiveShadow = true;
        
        // Adicionar dados do NPC
        npcGroup.userData = {
            type: 'npc',
            interactable: true,
            name: name,
            dialog: dialogText,
            message: `Pressione E para falar com ${name}`,
            speechBubble: speechBubble
        };
        
        // Adicionar à cena
        this.scene.add(npcGroup);
        
        // Adicionar à lista de NPCs
        this.npcs.push(npcGroup);
        
        // Adicionar à lista de interativos do mundo
        if (worldManager) {
            worldManager.getInteractableObjects().push(npcGroup);
        }
        
        return npcGroup;
    }
    
    createSpeechBubble(name) {
        const group = new THREE.Group();
        
        // Criar balão de fala
        const bubbleGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const bubbleMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
        group.add(bubble);
        
        // Adicionar ponta do balão
        const tipGeometry = new THREE.ConeGeometry(0.2, 0.4, 8);
        const tipMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        const tip = new THREE.Mesh(tipGeometry, tipMaterial);
        tip.position.set(0, -0.6, 0);
        tip.rotation.z = Math.PI;
        group.add(tip);
        
        // Adicionar nome do NPC
        const nameSprite = this.createTextSprite(name, {
            fontsize: 24,
            textColor: { r: 0, g: 0, b: 0, a: 1.0 },
            backgroundColor: { r: 255, g: 255, b: 255, a: 0.0 }
        });
        nameSprite.position.set(0, 0, 0.51);
        nameSprite.scale.set(0.5, 0.5, 0.5);
        group.add(nameSprite);
        
        return group;
    }
    
    createTextSprite(message, parameters) {
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
    
    startDialog(npc) {
        // Mostrar caixa de diálogo
        const dialogBox = document.getElementById('dialog-box');
        dialogBox.classList.remove('hidden');
        
        // Definir nome e texto
        document.querySelector('.dialog-name').textContent = npc.userData.name;
        document.querySelector('.dialog-text').textContent = npc.userData.dialog;
        
        // Mostrar balão de fala 3D
        if (npc.userData.speechBubble) {
            npc.userData.speechBubble.visible = true;
        }
        
        // Adicionar evento para fechar diálogo
        const closeDialog = (event) => {
            if (event.code === CONFIG.CONTROLS.INTERACT_KEY) {
                dialogBox.classList.add('hidden');
                
                // Esconder balão de fala 3D
                if (npc.userData.speechBubble) {
                    npc.userData.speechBubble.visible = false;
                }
                
                document.removeEventListener('keydown', closeDialog);
            }
        };
        
        document.addEventListener('keydown', closeDialog);
    }
    
    update(delta) {
        // Animar NPCs
        this.npcs.forEach(npc => {
            // Rotação lenta para simular movimento
            npc.rotation.y += 0.01 * delta;
            
            // Pequena oscilação vertical para simular respiração
            const bodyMesh = npc.children[0];
            if (bodyMesh) {
                bodyMesh.position.y = 0.9 + Math.sin(Date.now() * 0.002) * 0.02;
            }
            
            // Animar braços
            const leftArm = npc.children[5];
            const rightArm = npc.children[6];
            
            if (leftArm && rightArm) {
                leftArm.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
                rightArm.rotation.x = Math.sin(Date.now() * 0.001 + Math.PI) * 0.1;
            }
            
            // Fazer NPC olhar para o jogador se estiver próximo
            if (player && controlsManager) {
                const playerPosition = controlsManager.getObject().position;
                const distance = getDistance(npc, { position: playerPosition });
                
                if (distance < 5) {
                    // Calcular direção para o jogador (apenas no plano xz)
                    const direction = new THREE.Vector3();
                    direction.subVectors(playerPosition, npc.position);
                    direction.y = 0; // Ignorar diferença de altura
                    
                    // Calcular ângulo para o jogador
                    const angle = Math.atan2(direction.x, direction.z);
                    
                    // Suavizar rotação
                    const currentRotation = npc.rotation.y;
                    const targetRotation = angle;
                    npc.rotation.y = currentRotation + (targetRotation - currentRotation) * 0.05;
                    
                    // Animar olhos (pupilas) para olhar para o jogador
                    const leftEye = npc.children[2];
                    const rightEye = npc.children[4];
                    
                    if (leftEye && leftEye.children[0] && rightEye && rightEye.children[0]) {
                        const leftPupil = leftEye.children[0];
                        const rightPupil = rightEye.children[0];
                        
                        // Calcular direção normalizada
                        direction.normalize();
                        
                        // Limitar movimento das pupilas
                        const maxOffset = 0.03;
                        leftPupil.position.x = direction.x * maxOffset;
                        leftPupil.position.y = direction.y * maxOffset;
                        
                        rightPupil.position.x = direction.x * maxOffset;
                        rightPupil.position.y = direction.y * maxOffset;
                    }
                }
            }
        });
    }
}

// Instância global do gerenciador de NPCs
let npcManager;
