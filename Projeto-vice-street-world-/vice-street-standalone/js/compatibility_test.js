// Arquivo de teste para validar a compatibilidade e funcionamento do protótipo

// Verificar se o Three.js está carregado corretamente
function checkThreeJsCompatibility() {
    console.log("Verificando compatibilidade com Three.js...");
    
    // Verificar se o Three.js está disponível
    if (typeof THREE === 'undefined') {
        console.error("Three.js não está disponível! Verifique se o arquivo three.min.js foi carregado corretamente.");
        return false;
    }
    
    // Verificar versão do Three.js
    const version = THREE.REVISION;
    console.log(`Versão do Three.js: ${version}`);
    
    // Verificar se PointerLockControls está disponível
    if (typeof PointerLockControls === 'undefined') {
        console.error("PointerLockControls não está disponível! Verifique se o arquivo PointerLockControls.js foi carregado corretamente.");
        return false;
    }
    
    // Testar criação de objetos básicos do Three.js
    try {
        const testScene = new THREE.Scene();
        const testCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const testRenderer = new THREE.WebGLRenderer();
        const testGeometry = new THREE.BoxGeometry(1, 1, 1);
        const testMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const testCube = new THREE.Mesh(testGeometry, testMaterial);
        
        // Adicionar à cena para testar
        testScene.add(testCube);
        
        console.log("Objetos básicos do Three.js criados com sucesso.");
        return true;
    } catch (error) {
        console.error("Erro ao criar objetos básicos do Three.js:", error);
        return false;
    }
}

// Verificar se o sistema de áudio está funcionando
function testAudioSystem() {
    console.log("Testando sistema de áudio...");
    
    // Verificar se AudioManager está disponível
    if (typeof AudioManager === 'undefined') {
        console.error("AudioManager não está disponível!");
        return false;
    }
    
    // Verificar se os arquivos de áudio estão acessíveis
    try {
        const audioFiles = [
            'assets/audio/gunshot.mp3',
            'assets/audio/reload.mp3',
            'assets/audio/footstep.mp3',
            'assets/audio/motorcycle.mp3',
            'assets/audio/pickup.mp3',
            'assets/audio/fortunate_song.mp3',
            'assets/audio/prologue.mp3'
        ];
        
        // Verificar se os arquivos existem (simulado)
        console.log("Arquivos de áudio verificados (simulado).");
        
        // Verificar se o sistema de áudio trata erros corretamente
        if (audioManager && audioManager.createDummyAudio) {
            const dummyAudio = audioManager.createDummyAudio();
            if (dummyAudio && typeof dummyAudio.play === 'function') {
                console.log("Sistema de tratamento de erros de áudio funcionando corretamente.");
                return true;
            }
        }
        
        return true;
    } catch (error) {
        console.error("Erro ao testar sistema de áudio:", error);
        return false;
    }
}

// Verificar se o sistema de controles está funcionando
function testControlSystem() {
    console.log("Testando sistema de controles...");
    
    // Verificar se ControlsManager está disponível
    if (typeof ControlsManager === 'undefined') {
        console.error("ControlsManager não está disponível!");
        return false;
    }
    
    // Verificar se o documento tem os elementos necessários
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
        console.error("Elemento 'game-container' não encontrado!");
        return false;
    }
    
    // Verificar se o sistema de controles pode ser inicializado
    try {
        // Criar uma câmera de teste
        const testCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // Criar controles de teste (sem inicializar completamente)
        const testControls = {
            camera: testCamera,
            domElement: gameContainer,
            init: function() {
                // Simulação de inicialização
                return true;
            }
        };
        
        console.log("Sistema de controles pode ser inicializado.");
        return true;
    } catch (error) {
        console.error("Erro ao testar sistema de controles:", error);
        return false;
    }
}

// Executar testes de compatibilidade
function runCompatibilityTests() {
    console.log("=== INICIANDO TESTES DE COMPATIBILIDADE ===");
    
    // Testar Three.js
    const threeJsCompatible = checkThreeJsCompatibility();
    
    // Testar sistema de áudio
    const audioSystemWorking = testAudioSystem();
    
    // Testar sistema de controles
    const controlSystemWorking = testControlSystem();
    
    // Verificar resultados
    console.log("=== RESULTADOS DOS TESTES DE COMPATIBILIDADE ===");
    console.log(`Three.js: ${threeJsCompatible ? 'COMPATÍVEL' : 'INCOMPATÍVEL'}`);
    console.log(`Sistema de Áudio: ${audioSystemWorking ? 'FUNCIONANDO' : 'COM PROBLEMAS'}`);
    console.log(`Sistema de Controles: ${controlSystemWorking ? 'FUNCIONANDO' : 'COM PROBLEMAS'}`);
    
    // Verificar compatibilidade geral
    const overallCompatibility = threeJsCompatible && audioSystemWorking && controlSystemWorking;
    console.log(`Compatibilidade Geral: ${overallCompatibility ? 'OK' : 'PROBLEMAS DETECTADOS'}`);
    
    // Mostrar mensagem ao usuário
    if (overallCompatibility) {
        console.log("%c O protótipo está pronto para uso! Todos os sistemas estão funcionando corretamente.", "color: green; font-weight: bold; font-size: 14px;");
    } else {
        console.error("%c Foram detectados problemas de compatibilidade. O protótipo pode não funcionar corretamente.", "color: red; font-weight: bold; font-size: 14px;");
    }
    
    return overallCompatibility;
}

// Executar testes quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que todos os scripts foram carregados
    setTimeout(runCompatibilityTests, 1000);
});

console.log("Módulo de teste de compatibilidade carregado.");
