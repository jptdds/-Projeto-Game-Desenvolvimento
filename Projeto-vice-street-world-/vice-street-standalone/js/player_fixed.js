// Sistema de jogador corrigido

class Player {
    constructor(camera, scene) {
        this.camera = camera;
        this.scene = scene;
        this.health = CONFIG.PLAYER.MAX_HEALTH;
        this.weapon = null;
        this.hasMagnum = false;
        this.hasMotorcycle = false;
        
        // Raycaster para detecção de interações
        this.raycaster = new THREE.Raycaster();
        // Definir a câmera para o raycaster (correção do erro)
        this.raycaster.camera = this.camera;
        this.interactionDistance = 3;
        
        // Inicializar jogador
        this.init();
    }
    
    init() {
        // Atualizar HUD
        this.updateHealthBar();
        
        // Adicionar evento de clique para disparar
        document.addEventListener('click', this.onMouseClick.bind(this));
    }
    
    onMouseClick(event) {
        // Verificar se o jogo está ativo
        if (!controlsManager || !controlsManager.isLocked) return;
        
        // Verificar se tem arma
        if (this.weapon) {
            this.weapon.fire();
        }
    }
    
    interact() {
        // Verificar se há objetos interativos próximos
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(this.camera.quaternion);
        
        this.raycaster.set(this.camera.position, direction);
        
        // Verificar colisões com objetos interativos
        if (worldManager && worldManager.getInteractableObjects) {
            // Obter objetos interativos e filtrar nulos
            const interactableObjects = worldManager.getInteractableObjects().filter(obj => obj !== null && obj !== undefined);
            
            // Verificar se há objetos para interagir
            if (interactableObjects.length === 0) return;
            
            try {
                const intersects = this.raycaster.intersectObjects(interactableObjects, true);
                
                if (intersects.length > 0 && intersects[0].distance < this.interactionDistance) {
                    const object = intersects[0].object;
                    
                    // Verificar tipo de objeto
                    if (object.parent && object.parent.userData && object.parent.userData.interactable) {
                        this.handleInteraction(object.parent);
                    } else if (object.userData && object.userData.interactable) {
                        this.handleInteraction(object);
                    }
                }
            } catch (error) {
                console.warn("Erro ao verificar interações:", error);
            }
        }
    }
    
    handleInteraction(object) {
        // Verificar se o objeto é válido
        if (!object || !object.userData) return;
        
        // Verificar tipo de objeto
        if (object.userData.type === 'weapon' && object.userData.weaponType === 'magnum') {
            // Pegar Magnum
            this.pickupMagnum();
            
            // Remover objeto da cena
            this.scene.remove(object);
            
            // Remover da lista de objetos interativos
            if (worldManager && worldManager.getInteractableObjects) {
                const index = worldManager.getInteractableObjects().indexOf(object);
                if (index > -1) {
                    worldManager.getInteractableObjects().splice(index, 1);
                }
            }
            
            // Mostrar mensagem
            this.showNotification('Magnum .357 adquirida!');
        } else if (object.userData.type === 'motorcycle') {
            // Pegar moto
            this.pickupMotorcycle();
            
            // Remover objeto da cena
            this.scene.remove(object);
            
            // Remover da lista de objetos interativos
            if (worldManager && worldManager.getInteractableObjects) {
                const index = worldManager.getInteractableObjects().indexOf(object);
                if (index > -1) {
                    worldManager.getInteractableObjects().splice(index, 1);
                }
            }
            
            // Mostrar mensagem
            this.showNotification('Moto de gangue adquirida!');
        } else if (object.userData.type === 'npc') {
            // Iniciar diálogo com NPC
            if (npcManager) {
                npcManager.startDialog(object);
            }
        }
    }
    
    pickupMagnum() {
        // Marcar que tem a Magnum
        this.hasMagnum = true;
        
        // Criar arma
        this.weapon = new Weapon(this.camera);
        
        // Mostrar arma
        this.weapon.show();
        
        // Reproduzir som de pegar arma
        if (audioManager) {
            audioManager.playSound('pickup');
        }
        
        // Atualizar HUD
        const ammoCount = document.querySelector('.ammo-count');
        if (ammoCount && this.weapon) {
            ammoCount.textContent = `${this.weapon.ammo}/${this.weapon.maxAmmo}`;
        }
        
        // Atualizar objetivo da missão
        const missionObjective = document.querySelector('.mission-objective');
        if (missionObjective) {
            if (this.hasMotorcycle) {
                missionObjective.textContent = 'Missão completa!';
            } else {
                missionObjective.textContent = 'Encontre a moto de gangue';
            }
        }
    }
    
    pickupMotorcycle() {
        // Marcar que tem a moto
        this.hasMotorcycle = true;
        
        // Reproduzir som da moto
        if (audioManager) {
            audioManager.playSound('motorcycle');
        }
        
        // Atualizar objetivo da missão
        const missionObjective = document.querySelector('.mission-objective');
        if (missionObjective) {
            if (this.hasMagnum) {
                missionObjective.textContent = 'Missão completa!';
            } else {
                missionObjective.textContent = 'Encontre a Magnum .357';
            }
        }
    }
    
    takeDamage(amount) {
        // Reduzir vida
        this.health = Math.max(0, this.health - amount);
        
        // Atualizar HUD
        this.updateHealthBar();
        
        // Verificar se morreu
        if (this.health <= 0) {
            this.die();
        }
    }
    
    heal(amount) {
        // Aumentar vida
        this.health = Math.min(CONFIG.PLAYER.MAX_HEALTH, this.health + amount);
        
        // Atualizar HUD
        this.updateHealthBar();
    }
    
    die() {
        // Mostrar tela de game over
        const gameOver = document.getElementById('game-over');
        if (gameOver) {
            gameOver.classList.remove('hidden');
        }
        
        // Desbloquear controles
        if (controlsManager) {
            controlsManager.unlock();
        }
    }
    
    updateHealthBar() {
        // Atualizar barra de vida
        const healthBar = document.querySelector('.health-bar-fill');
        if (healthBar) {
            healthBar.style.width = `${this.health}%`;
        }
    }
    
    showNotification(message) {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Estilizar notificação
        notification.style.position = 'fixed';
        notification.style.top = '100px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        notification.style.color = '#ff00ff';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.border = '1px solid #ff00ff';
        notification.style.fontFamily = 'Arial, sans-serif';
        notification.style.fontSize = '16px';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease-in-out';
        
        // Adicionar ao corpo do documento
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Remover após alguns segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    update(delta) {
        // Verificar objetos interativos próximos
        try {
            this.checkInteractables();
        } catch (error) {
            console.warn("Erro ao verificar interações:", error);
        }
    }
    
    checkInteractables() {
        // Verificar se há objetos interativos próximos
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(this.camera.quaternion);
        
        // Garantir que o raycaster tem a câmera definida
        this.raycaster.camera = this.camera;
        this.raycaster.set(this.camera.position, direction);
        
        // Verificar colisões com objetos interativos
        if (worldManager && worldManager.getInteractableObjects) {
            // Obter objetos interativos e filtrar nulos
            const interactableObjects = worldManager.getInteractableObjects().filter(obj => obj !== null && obj !== undefined);
            
            // Verificar se há objetos para interagir
            if (interactableObjects.length === 0) {
                // Esconder prompt de interação
                const interactionPrompt = document.getElementById('interaction-prompt');
                if (interactionPrompt) {
                    interactionPrompt.classList.add('hidden');
                }
                return;
            }
            
            try {
                const intersects = this.raycaster.intersectObjects(interactableObjects, true);
                
                if (intersects.length > 0 && intersects[0].distance < this.interactionDistance) {
                    const object = intersects[0].object;
                    const interactionPrompt = document.getElementById('interaction-prompt');
                    
                    if (!interactionPrompt) return;
                    
                    // Mostrar prompt de interação
                    if (object.parent && object.parent.userData && object.parent.userData.interactable) {
                        interactionPrompt.textContent = object.parent.userData.message || 'Pressione E para interagir';
                        interactionPrompt.classList.remove('hidden');
                    } else if (object.userData && object.userData.interactable) {
                        interactionPrompt.textContent = object.userData.message || 'Pressione E para interagir';
                        interactionPrompt.classList.remove('hidden');
                    } else {
                        interactionPrompt.classList.add('hidden');
                    }
                } else {
                    // Esconder prompt de interação
                    const interactionPrompt = document.getElementById('interaction-prompt');
                    if (interactionPrompt) {
                        interactionPrompt.classList.add('hidden');
                    }
                }
            } catch (error) {
                console.warn("Erro ao verificar interações:", error);
                // Esconder prompt de interação em caso de erro
                const interactionPrompt = document.getElementById('interaction-prompt');
                if (interactionPrompt) {
                    interactionPrompt.classList.add('hidden');
                }
            }
        }
    }
}

// Instância global do jogador
let player;
