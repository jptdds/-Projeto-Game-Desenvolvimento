// Sistema de áudio do jogo com tratamento robusto para placeholders

class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = {};
        this.radioStations = CONFIG.AUDIO.RADIO_STATIONS;
        this.currentStation = 0;
        this.currentSong = null;
        this.radioActive = false;
        
        // Flag para indicar se o áudio está disponível
        this.audioAvailable = true;
        
        // Inicializar sistema de áudio
        this.init();
    }
    
    init() {
        try {
            // Criar listener de áudio global
            this.listener = new THREE.AudioListener();
            
            // Verificar se o contexto de áudio pode ser iniciado
            if (this.listener.context.state === 'suspended') {
                console.warn('Contexto de áudio suspenso. O áudio será ativado após interação do utilizador.');
                
                // Adicionar evento para ativar áudio após interação
                document.addEventListener('click', () => {
                    this.listener.context.resume().then(() => {
                        console.log('Contexto de áudio resumido após interação do utilizador.');
                    }).catch(error => {
                        console.error('Erro ao resumir contexto de áudio:', error);
                        this.audioAvailable = false;
                    });
                }, { once: true });
            }
            
            // Pré-carregar sons comuns com tratamento de erros
            this.loadSoundSafely('gunshot', 'assets/audio/gunshot.mp3');
            this.loadSoundSafely('reload', 'assets/audio/reload.mp3');
            this.loadSoundSafely('footstep', 'assets/audio/footstep.mp3');
            this.loadSoundSafely('motorcycle', 'assets/audio/motorcycle.mp3');
            this.loadSoundSafely('pickup', 'assets/audio/pickup.mp3');
            
            // Pré-carregar músicas com tratamento de erros
            this.loadMusicSafely('fortunate_song', 'assets/audio/fortunate_song.mp3');
            this.loadMusicSafely('prologue', 'assets/audio/prologue.mp3');
            
            console.log('Sistema de áudio inicializado com tratamento de erros.');
        } catch (error) {
            console.error('Erro ao inicializar sistema de áudio:', error);
            this.audioAvailable = false;
            
            // Criar objetos vazios para evitar erros
            this.sounds = {};
            this.music = {};
            this.listener = {
                context: { state: 'unavailable' }
            };
        }
    }
    
    // Carregar efeito sonoro com tratamento de erros
    loadSoundSafely(name, url) {
        if (!this.audioAvailable) {
            console.warn(`Áudio não disponível. Som '${name}' não será carregado.`);
            this.sounds[name] = this.createDummyAudio();
            return;
        }
        
        try {
            const sound = new THREE.Audio(this.listener);
            const audioLoader = new THREE.AudioLoader();
            
            audioLoader.load(url, (buffer) => {
                try {
                    sound.setBuffer(buffer);
                    sound.setVolume(CONFIG.AUDIO.SFX_VOLUME);
                    this.sounds[name] = sound;
                    console.log(`Som '${name}' carregado com sucesso.`);
                } catch (error) {
                    console.warn(`Erro ao configurar som '${name}':`, error);
                    this.sounds[name] = this.createDummyAudio();
                }
            }, 
            // Progresso
            (xhr) => {
                // console.log(`${name}: ${(xhr.loaded / xhr.total * 100).toFixed(2)}% carregado`);
            }, 
            // Erro
            (error) => {
                console.warn(`Erro ao carregar som '${name}':`, error);
                this.sounds[name] = this.createDummyAudio();
            });
        } catch (error) {
            console.error(`Erro ao criar objeto de áudio para '${name}':`, error);
            this.sounds[name] = this.createDummyAudio();
        }
    }
    
    // Carregar música com tratamento de erros
    loadMusicSafely(name, url) {
        if (!this.audioAvailable) {
            console.warn(`Áudio não disponível. Música '${name}' não será carregada.`);
            this.music[name] = this.createDummyAudio();
            return;
        }
        
        try {
            const sound = new THREE.Audio(this.listener);
            const audioLoader = new THREE.AudioLoader();
            
            audioLoader.load(url, (buffer) => {
                try {
                    sound.setBuffer(buffer);
                    sound.setVolume(CONFIG.AUDIO.MUSIC_VOLUME);
                    sound.setLoop(true);
                    this.music[name] = sound;
                    console.log(`Música '${name}' carregada com sucesso.`);
                } catch (error) {
                    console.warn(`Erro ao configurar música '${name}':`, error);
                    this.music[name] = this.createDummyAudio();
                }
            }, 
            // Progresso
            (xhr) => {
                // console.log(`${name}: ${(xhr.loaded / xhr.total * 100).toFixed(2)}% carregado`);
            }, 
            // Erro
            (error) => {
                console.warn(`Erro ao carregar música '${name}':`, error);
                this.music[name] = this.createDummyAudio();
            });
        } catch (error) {
            console.error(`Erro ao criar objeto de áudio para música '${name}':`, error);
            this.music[name] = this.createDummyAudio();
        }
    }
    
    // Criar objeto de áudio dummy para evitar erros
    createDummyAudio() {
        return {
            isPlaying: false,
            play: function() { 
                console.log('Reprodução de áudio simulada (áudio não disponível)');
                this.isPlaying = true;
                return this;
            },
            pause: function() { 
                this.isPlaying = false;
                return this;
            },
            stop: function() { 
                this.isPlaying = false;
                return this;
            },
            setVolume: function() { return this; },
            setLoop: function() { return this; },
            setBuffer: function() { return this; }
        };
    }
    
    // Reproduzir efeito sonoro com tratamento de erros
    playSound(name, volume = CONFIG.AUDIO.SFX_VOLUME) {
        if (!this.audioAvailable) {
            console.log(`Reprodução de som '${name}' simulada (áudio não disponível)`);
            return;
        }
        
        if (this.sounds[name]) {
            try {
                if (!this.sounds[name].isPlaying) {
                    this.sounds[name].setVolume(volume);
                    this.sounds[name].play();
                }
            } catch (error) {
                console.warn(`Erro ao reproduzir som '${name}':`, error);
            }
        } else {
            console.warn(`Som '${name}' não encontrado`);
        }
    }
    
    // Reproduzir música com tratamento de erros
    playMusic(name, volume = CONFIG.AUDIO.MUSIC_VOLUME) {
        if (!this.audioAvailable) {
            console.log(`Reprodução de música '${name}' simulada (áudio não disponível)`);
            return;
        }
        
        // Parar qualquer música atual
        this.stopAllMusic();
        
        if (this.music[name]) {
            try {
                this.music[name].setVolume(volume);
                this.music[name].play();
            } catch (error) {
                console.warn(`Erro ao reproduzir música '${name}':`, error);
            }
        } else {
            console.warn(`Música '${name}' não encontrada`);
        }
    }
    
    // Parar toda a música com tratamento de erros
    stopAllMusic() {
        if (!this.audioAvailable) return;
        
        try {
            Object.values(this.music).forEach(music => {
                if (music && music.isPlaying) {
                    music.stop();
                }
            });
        } catch (error) {
            console.warn('Erro ao parar músicas:', error);
        }
    }
    
    // Ligar/desligar rádio
    toggleRadio() {
        if (this.radioActive) {
            this.stopRadio();
        } else {
            this.startRadio();
        }
        
        return this.radioActive;
    }
    
    // Iniciar rádio
    startRadio() {
        this.radioActive = true;
        const station = this.radioStations[this.currentStation];
        this.currentSong = station.songs[0]; // Para simplificar, apenas uma música por estação
        
        // Reproduzir música
        this.playMusic('fortunate_song', CONFIG.AUDIO.MUSIC_VOLUME); // Hardcoded para o protótipo
        
        // Atualizar UI
        try {
            document.querySelector('.radio-station').textContent = station.name;
            document.querySelector('.radio-song').textContent = this.currentSong;
        } catch (error) {
            console.warn('Erro ao atualizar UI do rádio:', error);
        }
    }
    
    // Parar rádio
    stopRadio() {
        this.radioActive = false;
        this.stopAllMusic();
        
        // Atualizar UI
        try {
            document.querySelector('.radio-station').textContent = "DESLIGADO";
            document.querySelector('.radio-song').textContent = "";
        } catch (error) {
            console.warn('Erro ao atualizar UI do rádio:', error);
        }
    }
    
    // Obter listener para anexar à câmera
    getListener() {
        return this.listener;
    }
}

// Instância global do gerenciador de áudio
let audioManager;
