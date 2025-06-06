// Sistema de interface do utilizador

class UIManager {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.loadingBar = document.querySelector('.loading-bar');
        this.loadingText = document.querySelector('.loading-text');
        this.prologue = document.getElementById('prologue');
        this.gameContainer = document.getElementById('game-container');
        this.gameOver = document.getElementById('game-over');
        this.interactionPrompt = document.getElementById('interaction-prompt');
        this.dialogBox = document.getElementById('dialog-box');
        
        // Inicializar UI
        this.init();
    }
    
    init() {
        // Configurar eventos
        document.getElementById('start-game').addEventListener('click', this.startGame.bind(this));
        document.getElementById('restart-game').addEventListener('click', this.restartGame.bind(this));
        
        // Iniciar animação de carregamento
        this.startLoadingAnimation();
    }
    
    startLoadingAnimation() {
        // Simular progresso de carregamento
        let progress = 0;
        const interval = setInterval(() => {
            progress += 1;
            this.loadingBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                this.showPrologue();
            }
        }, 30);
    }
    
    showPrologue() {
        // Esconder tela de carregamento
        this.loadingScreen.classList.add('hidden');
        
        // Mostrar prólogo
        this.prologue.classList.remove('hidden');
        
        // Animar texto do prólogo
        const texts = document.querySelectorAll('.typewriter-text');
        let delay = 0;
        
        texts.forEach((text, index) => {
            setTimeout(() => {
                text.style.opacity = '1';
                this.animateTypewriter(text, () => {
                    // Mostrar botão de início após último texto
                    if (index === texts.length - 1) {
                        setTimeout(() => {
                            document.getElementById('start-game').style.display = 'block';
                        }, 500);
                    }
                });
            }, delay);
            
            delay += 2000; // Atraso entre textos
        });
    }
    
    animateTypewriter(element, callback) {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(interval);
                if (callback) callback();
            }
        }, 50);
    }
    
    startGame() {
        // Esconder prólogo
        this.prologue.classList.add('hidden');
        
        // Mostrar jogo
        this.gameContainer.classList.remove('hidden');
        
        // Iniciar música de fundo
        if (audioManager) {
            audioManager.playMusic('prologue', 0.3);
        }
    }
    
    restartGame() {
        // Recarregar página
        location.reload();
    }
    
    showInteractionPrompt(message) {
        this.interactionPrompt.textContent = message;
        this.interactionPrompt.classList.remove('hidden');
    }
    
    hideInteractionPrompt() {
        this.interactionPrompt.classList.add('hidden');
    }
    
    showDialog(name, text) {
        this.dialogBox.classList.remove('hidden');
        document.querySelector('.dialog-name').textContent = name;
        document.querySelector('.dialog-text').textContent = text;
    }
    
    hideDialog() {
        this.dialogBox.classList.add('hidden');
    }
    
    updateHealthBar(health) {
        const healthBar = document.querySelector('.health-bar-fill');
        if (healthBar) {
            healthBar.style.width = `${health}%`;
        }
    }
    
    updateAmmoCount(current, max) {
        const ammoCount = document.querySelector('.ammo-count');
        if (ammoCount) {
            ammoCount.textContent = `${current}/${max}`;
        }
    }
    
    updateMissionObjective(text) {
        const missionObjective = document.querySelector('.mission-objective');
        if (missionObjective) {
            missionObjective.textContent = text;
        }
    }
    
    updateRadioInfo(station, song) {
        const radioStation = document.querySelector('.radio-station');
        const radioSong = document.querySelector('.radio-song');
        
        if (radioStation && radioSong) {
            radioStation.textContent = station;
            radioSong.textContent = song;
        }
    }
    
    showGameOver() {
        this.gameOver.classList.remove('hidden');
    }
    
    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Definir cor com base no tipo
        let color = '#ffffff';
        switch (type) {
            case 'success':
                color = '#00ff00';
                break;
            case 'warning':
                color = '#ffff00';
                break;
            case 'error':
                color = '#ff0000';
                break;
            case 'info':
            default:
                color = '#00ffff';
                break;
        }
        
        // Estilizar notificação
        notification.style.position = 'fixed';
        notification.style.top = '100px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        notification.style.color = color;
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.border = `1px solid ${color}`;
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
}

// Instância global do gerenciador de UI
let uiManager;
