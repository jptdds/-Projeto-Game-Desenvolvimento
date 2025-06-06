// Sistema de controles do jogador corrigido para Three.js moderno

class ControlsManager {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;
        
        // Estado dos controles
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.sprint = false;
        this.canJump = false;
        this.isLocked = false;
        
        // Velocidade e direção
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        
        // Inicializar controles
        this.init();
    }
    
    init() {
        // Configurar PointerLockControls
        this.controls = new PointerLockControls(this.camera, this.domElement);
        
        // Adicionar eventos de teclado
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
        
        // Adicionar evento de clique para bloqueio do ponteiro
        document.getElementById('start-game').addEventListener('click', () => {
            this.controls.lock();
        });
        
        // Adicionar eventos de bloqueio/desbloqueio
        this.controls.addEventListener('lock', this.onLock.bind(this));
        this.controls.addEventListener('unlock', this.onUnlock.bind(this));
    }
    
    onKeyDown(event) {
        if (!this.isLocked) return;
        
        switch (event.code) {
            case CONFIG.CONTROLS.FORWARD_KEY:
                this.moveForward = true;
                break;
            case CONFIG.CONTROLS.BACKWARD_KEY:
                this.moveBackward = true;
                break;
            case CONFIG.CONTROLS.LEFT_KEY:
                this.moveLeft = true;
                break;
            case CONFIG.CONTROLS.RIGHT_KEY:
                this.moveRight = true;
                break;
            case CONFIG.CONTROLS.SPRINT_KEY:
                this.sprint = true;
                break;
            case CONFIG.CONTROLS.JUMP_KEY:
                if (this.canJump) {
                    this.velocity.y += CONFIG.PLAYER.JUMP_HEIGHT;
                    this.canJump = false;
                }
                break;
            case CONFIG.CONTROLS.INTERACT_KEY:
                // Interação será implementada no sistema de jogador
                if (typeof player !== 'undefined') {
                    player.interact();
                }
                break;
            case CONFIG.CONTROLS.RELOAD_KEY:
                // Recarregar será implementado no sistema de armas
                if (typeof player !== 'undefined' && player.weapon) {
                    player.weapon.reload();
                }
                break;
            case CONFIG.CONTROLS.RADIO_KEY:
                // Rádio será implementado no sistema de áudio
                if (typeof audioManager !== 'undefined') {
                    const radioActive = audioManager.toggleRadio();
                    console.log(`Rádio ${radioActive ? 'ligado' : 'desligado'}`);
                } else if (typeof radioSystem !== 'undefined') {
                    radioSystem.toggle();
                }
                break;
        }
    }
    
    onKeyUp(event) {
        if (!this.isLocked) return;
        
        switch (event.code) {
            case CONFIG.CONTROLS.FORWARD_KEY:
                this.moveForward = false;
                break;
            case CONFIG.CONTROLS.BACKWARD_KEY:
                this.moveBackward = false;
                break;
            case CONFIG.CONTROLS.LEFT_KEY:
                this.moveLeft = false;
                break;
            case CONFIG.CONTROLS.RIGHT_KEY:
                this.moveRight = false;
                break;
            case CONFIG.CONTROLS.SPRINT_KEY:
                this.sprint = false;
                break;
        }
    }
    
    onLock() {
        this.isLocked = true;
        document.getElementById('prologue').classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');
    }
    
    onUnlock() {
        this.isLocked = false;
    }
    
    update(delta) {
        if (!this.isLocked) return;
        
        // Aplicar gravidade
        this.velocity.y -= 9.8 * delta;
        
        // Calcular direção com base nas teclas pressionadas
        this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
        this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
        this.direction.normalize();
        
        // Determinar velocidade (normal ou sprint)
        const speed = this.sprint ? CONFIG.PLAYER.SPRINT_SPEED : CONFIG.PLAYER.SPEED;
        
        // Aplicar movimento (CORRIGIDO: removidos os sinais negativos para corrigir a inversão)
        if (this.moveForward || this.moveBackward) {
            this.velocity.z = this.direction.z * speed * delta;
        } else {
            this.velocity.z = 0;
        }
        
        if (this.moveLeft || this.moveRight) {
            this.velocity.x = this.direction.x * speed * delta;
        } else {
            this.velocity.x = 0;
        }
        
        // Mover controles (CORRIGIDO: direção correta)
        this.controls.moveRight(this.velocity.x);
        this.controls.moveForward(this.velocity.z);
        
        // Aplicar gravidade (simplificado para o protótipo)
        if (this.camera.position.y > CONFIG.PLAYER.HEIGHT) {
            this.camera.position.y += this.velocity.y * delta;
        } else {
            this.camera.position.y = CONFIG.PLAYER.HEIGHT;
            this.velocity.y = 0;
            this.canJump = true;
        }
    }
    
    getObject() {
        return this.controls.getObject();
    }
    
    getDirection() {
        return this.controls.getDirection(new THREE.Vector3());
    }
    
    lock() {
        this.controls.lock();
    }
    
    unlock() {
        this.controls.unlock();
    }
}

// Instância global do gerenciador de controles
let controlsManager;
