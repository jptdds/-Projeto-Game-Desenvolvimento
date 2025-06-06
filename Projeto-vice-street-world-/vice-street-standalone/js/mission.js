// Sistema de missões

class MissionManager {
    constructor() {
        this.missions = [];
        this.currentMission = null;
        
        // Inicializar missões
        this.init();
    }
    
    init() {
        // Criar Missão 1
        const mission1 = {
            id: 'mission1',
            title: 'Começo da Jornada',
            description: 'Encontre a moto de gangue e a Magnum .357',
            objectives: [
                {
                    id: 'find_motorcycle',
                    description: 'Encontre a moto de gangue',
                    completed: false,
                    checkCompletion: () => {
                        return player && player.hasMotorcycle;
                    }
                },
                {
                    id: 'find_magnum',
                    description: 'Encontre a Magnum .357',
                    completed: false,
                    checkCompletion: () => {
                        return player && player.hasMagnum;
                    }
                }
            ],
            rewards: {
                xp: 100,
                items: ['Moto de gangue', 'Magnum .357']
            },
            completed: false
        };
        
        // Adicionar missão à lista
        this.missions.push(mission1);
        
        // Definir como missão atual
        this.currentMission = mission1;
    }
    
    update() {
        // Verificar objetivos da missão atual
        if (this.currentMission) {
            let allCompleted = true;
            
            this.currentMission.objectives.forEach(objective => {
                // Verificar se o objetivo foi concluído
                if (!objective.completed && objective.checkCompletion()) {
                    objective.completed = true;
                    this.showObjectiveCompleted(objective.description);
                }
                
                // Verificar se todos os objetivos foram concluídos
                if (!objective.completed) {
                    allCompleted = false;
                }
            });
            
            // Verificar se a missão foi concluída
            if (allCompleted && !this.currentMission.completed) {
                this.currentMission.completed = true;
                this.showMissionCompleted(this.currentMission.title);
            }
        }
    }
    
    showObjectiveCompleted(description) {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = 'objective-notification';
        notification.innerHTML = `
            <div class="objective-icon">✓</div>
            <div class="objective-text">Objetivo concluído: ${description}</div>
        `;
        
        // Estilizar notificação
        notification.style.position = 'fixed';
        notification.style.top = '150px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        notification.style.color = '#00ff00';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.border = '1px solid #00ff00';
        notification.style.fontFamily = 'Arial, sans-serif';
        notification.style.fontSize = '16px';
        notification.style.zIndex = '1000';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease-in-out';
        
        // Estilizar ícone
        const icon = notification.querySelector('.objective-icon');
        icon.style.marginRight = '10px';
        icon.style.fontSize = '20px';
        icon.style.color = '#00ff00';
        
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
    
    showMissionCompleted(title) {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = 'mission-notification';
        notification.innerHTML = `
            <div class="mission-title">MISSÃO COMPLETA</div>
            <div class="mission-name">${title}</div>
        `;
        
        // Estilizar notificação
        notification.style.position = 'fixed';
        notification.style.top = '50%';
        notification.style.left = '50%';
        notification.style.transform = 'translate(-50%, -50%)';
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        notification.style.color = '#ff00ff';
        notification.style.padding = '20px 40px';
        notification.style.borderRadius = '10px';
        notification.style.border = '2px solid #ff00ff';
        notification.style.fontFamily = 'Arial, sans-serif';
        notification.style.textAlign = 'center';
        notification.style.zIndex = '1000';
        notification.style.boxShadow = '0 0 20px rgba(255, 0, 255, 0.5)';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease-in-out';
        
        // Estilizar título
        const missionTitle = notification.querySelector('.mission-title');
        missionTitle.style.fontSize = '24px';
        missionTitle.style.fontWeight = 'bold';
        missionTitle.style.marginBottom = '10px';
        
        // Estilizar nome da missão
        const missionName = notification.querySelector('.mission-name');
        missionName.style.fontSize = '18px';
        
        // Adicionar ao corpo do documento
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Reproduzir som de conclusão de missão
        if (audioManager) {
            audioManager.playSound('pickup', 0.8);
        }
        
        // Remover após alguns segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 5000);
    }
    
    getCurrentMission() {
        return this.currentMission;
    }
    
    isMissionComplete() {
        return this.currentMission && this.currentMission.completed;
    }
}

// Instância global do gerenciador de missões
let missionManager;
