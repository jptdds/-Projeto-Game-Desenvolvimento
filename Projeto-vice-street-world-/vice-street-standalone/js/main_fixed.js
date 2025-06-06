// Arquivo principal do jogo atualizado para versão autónoma e corrigida

// Variáveis globais
let scene, camera, renderer;
let clock;
let stats;

// Inicializar jogo
function init() {
    console.log("Inicializando jogo...");
    
    // Criar relógio para controle de tempo
    clock = new THREE.Clock();
    
    // Criar cena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000022); // Fundo escuro para ambiente noturno
    
    // Criar câmera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = CONFIG.PLAYER.HEIGHT;
    
    // Criar renderizador
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('game-container').appendChild(renderer.domElement);
    
    // Inicializar gerenciadores
    initManagers();
    
    // Configurar redimensionamento da janela
    window.addEventListener('resize', onWindowResize);
    
    // Iniciar loop de animação
    animate();
    
    console.log("Jogo inicializado com sucesso!");
}

// Inicializar gerenciadores
function initManagers() {
    console.log("Inicializando gerenciadores...");
    
    try {
        // Inicializar gerenciador de áudio
        audioManager = new AudioManager();
        console.log("AudioManager inicializado");
        
        // Inicializar gerenciador de controles
        controlsManager = new ControlsManager(camera, renderer.domElement);
        console.log("ControlsManager inicializado");
        
        // Inicializar gerenciador de mundo
        worldManager = new WorldManager(scene);
        console.log("WorldManager inicializado");
        
        // Inicializar jogador
        player = new Player(camera, scene);
        console.log("Player inicializado");
        
        // Inicializar gerenciador de UI
        uiManager = new UIManager();
        console.log("UIManager inicializado");
        
        // Inicializar integração de missões
        missionIntegration = new MissionIntegration();
        console.log("MissionIntegration inicializado");
        
        // Adicionar listener de áudio à câmera
        if (audioManager && audioManager.getListener) {
            camera.add(audioManager.getListener());
        }
    } catch (error) {
        console.error("Erro ao inicializar gerenciadores:", error);
    }
}

// Redimensionar janela
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Loop de animação
function animate() {
    requestAnimationFrame(animate);
    
    try {
        // Calcular delta time
        const delta = clock.getDelta();
        
        // Atualizar controles
        if (controlsManager) {
            controlsManager.update(delta);
        }
        
        // Atualizar jogador
        if (player) {
            player.update(delta);
        }
        
        // Atualizar mundo
        if (worldManager) {
            worldManager.update(delta);
        }
        
        // Atualizar integração de missões
        if (missionIntegration) {
            missionIntegration.update(delta);
        }
        
        // Atualizar arma
        if (player && player.weapon) {
            player.weapon.update(delta);
        }
        
        // Renderizar cena
        renderer.render(scene, camera);
    } catch (error) {
        console.error("Erro no loop de animação:", error);
    }
}

// Iniciar jogo quando a página carregar
window.addEventListener('load', function() {
    console.log("Página carregada, iniciando jogo...");
    setTimeout(init, 500); // Pequeno atraso para garantir que todos os elementos estão prontos
});

// Função para criar recursos de áudio temporários
function createTemporaryAudioResources() {
    console.log("Recursos de áudio temporários seriam criados aqui");
    
    // Em um ambiente real, estes arquivos seriam criados fisicamente
    // Para o protótipo, apenas simulamos sua existência
    console.log("Arquivos de áudio simulados");
}

// Chamar função para criar recursos temporários
createTemporaryAudioResources();
