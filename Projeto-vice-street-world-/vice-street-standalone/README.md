# Instruções de Uso - Vice Street World (Versão Autónoma)

## Requisitos
- Visual Studio Code
- Extensão Live Server para VS Code

## Como Executar
1. Descompacte o ficheiro `vice-street-standalone.zip`
2. Abra a pasta `vice-street-standalone` no Visual Studio Code
3. Clique com o botão direito no ficheiro `index.html`
4. Selecione "Open with Live Server" (Abrir com Live Server)
5. O jogo será aberto no seu navegador padrão

## Controlos
- **W, A, S, D** - Movimentação
- **Shift** - Correr
- **E** - Interagir com objetos/NPCs
- **Clique do rato** - Disparar (quando tiver a arma)
- **R** - Recarregar arma
- **Q** - Ligar/desligar rádio

## Missão 1 - Começo da Jornada
- Encontre a moto de gangue (Harley)
- Encontre a Magnum .357
- Fale com os NPCs para obter dicas

## Notas Importantes
- Esta versão é totalmente autónoma e não requer conexão à internet
- Todos os recursos (Three.js, PointerLockControls, etc.) estão incluídos localmente
- Os ficheiros de áudio são placeholders e não reproduzirão som real
- O sistema foi projetado para funcionar mesmo sem áudio

## Resolução de Problemas
- Se o jogo não iniciar, verifique se a extensão Live Server está instalada e ativa
- Se os controlos não funcionarem, clique na tela do jogo para ativar o bloqueio do ponteiro
- Se ocorrerem erros no console, verifique se todos os ficheiros foram extraídos corretamente

## Estrutura do Projeto
- `index.html` - Página principal do jogo
- `css/` - Estilos visuais
- `js/` - Scripts do jogo (lógica, mecânicas, etc.)
- `libs/` - Bibliotecas externas (Three.js, PointerLockControls)
- `assets/` - Recursos do jogo (áudio, texturas, modelos)

## Créditos
- Baseado no roteiro original "Vice Street World"
- Desenvolvido como protótipo para apresentação académica
- Inspirado em jogos de mundo aberto dos anos 80
