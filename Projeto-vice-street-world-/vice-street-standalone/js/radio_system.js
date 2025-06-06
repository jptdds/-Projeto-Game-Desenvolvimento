// Sistema de rádio aprimorado

class RadioSystem {
    constructor() {
        this.active = false;
        this.stations = CONFIG.AUDIO.RADIO_STATIONS;
        this.currentStationIndex = 0;
        this.currentSong = null;
        
        // Inicializar sistema de rádio
        this.init();
    }
    
    init() {
        // Configurar elementos da UI
        this.radioStation = document.querySelector('.radio-station');
        this.radioSong = document.querySelector('.radio-song');
        
        // Definir estação inicial
        this.updateDisplay();
    }
    
    toggle() {
        this.active = !this.active;
        
        if (this.active) {
            this.turnOn();
        } else {
            this.turnOff();
        }
        
        return this.active;
    }
    
    turnOn() {
        // Ativar rádio
        this.active = true;
        
        // Atualizar UI
        this.radioStation.textContent = this.stations[this.currentStationIndex].name;
        this.radioSong.textContent = this.getCurrentSong();
        this.radioStation.parentElement.classList.add('radio-active');
        
        // Reproduzir música
        if (audioManager) {
            audioManager.playMusic('fortunate_song', CONFIG.AUDIO.MUSIC_VOLUME);
        }
    }
    
    turnOff() {
        // Desativar rádio
        this.active = false;
        
        // Atualizar UI
        this.radioStation.textContent = "DESLIGADO";
        this.radioSong.textContent = "";
        this.radioStation.parentElement.classList.remove('radio-active');
        
        // Parar música
        if (audioManager) {
            audioManager.stopAllMusic();
        }
    }
    
    nextStation() {
        if (!this.active) return;
        
        // Avançar para próxima estação
        this.currentStationIndex = (this.currentStationIndex + 1) % this.stations.length;
        
        // Atualizar UI e música
        this.updateDisplay();
        
        // Reproduzir som de mudança de estação
        if (audioManager) {
            audioManager.playSound('radio_static', 0.3);
            
            // Pequeno atraso para simular sintonização
            setTimeout(() => {
                audioManager.playMusic('fortunate_song', CONFIG.AUDIO.MUSIC_VOLUME);
            }, 300);
        }
    }
    
    previousStation() {
        if (!this.active) return;
        
        // Voltar para estação anterior
        this.currentStationIndex = (this.currentStationIndex - 1 + this.stations.length) % this.stations.length;
        
        // Atualizar UI e música
        this.updateDisplay();
        
        // Reproduzir som de mudança de estação
        if (audioManager) {
            audioManager.playSound('radio_static', 0.3);
            
            // Pequeno atraso para simular sintonização
            setTimeout(() => {
                audioManager.playMusic('fortunate_song', CONFIG.AUDIO.MUSIC_VOLUME);
            }, 300);
        }
    }
    
    getCurrentSong() {
        const station = this.stations[this.currentStationIndex];
        const songIndex = 0; // Para simplificar, apenas uma música por estação
        return station.songs[songIndex];
    }
    
    updateDisplay() {
        if (this.active) {
            this.radioStation.textContent = this.stations[this.currentStationIndex].name;
            this.radioSong.textContent = this.getCurrentSong();
        }
    }
}

// Instância global do sistema de rádio
let radioSystem;
