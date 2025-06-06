// Integração final da Missão 1

class MissionIntegration {
    constructor() {
        this.initialized = false;
        
        // Inicializar integração
        this.init();
    }
    
    init() {
        // Verificar se todos os sistemas necessários estão disponíveis
        if (!worldManager || !player || !controlsManager || !audioManager) {
            console.warn('Sistemas necessários não estão disponíveis. A integração da missão será adiada.');
            
            // Tentar novamente após um curto período
            setTimeout(() => {
                this.init();
            }, 1000);
            
            return;
        }
        
        // Criar gerenciador de missões
        missionManager = new MissionManager();
        
        // Criar gerenciador de NPCs
        npcManager = new NPCManager(worldManager.scene);
        
        // Criar sistema de rádio
        radioSystem = new RadioSystem();
        
        // Marcar como inicializado
        this.initialized = true;
        
        console.log('Integração da Missão 1 concluída com sucesso.');
    }
    
    update(delta) {
        if (!this.initialized) return;
        
        // Atualizar gerenciador de missões
        if (missionManager) {
            missionManager.update();
        }
        
        // Atualizar NPCs
        if (npcManager) {
            npcManager.update(delta);
        }
    }
}

// Instância global da integração de missões
let missionIntegration;
