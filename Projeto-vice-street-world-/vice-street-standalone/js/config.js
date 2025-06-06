// Configurações do jogo
const CONFIG = {
    PLAYER: {
        HEIGHT: 1.8,
        SPEED: 10,
        SPRINT_SPEED: 20,
        JUMP_HEIGHT: 10,
        MAX_HEALTH: 100
    },
    CONTROLS: {
        FORWARD_KEY: 'KeyW',
        BACKWARD_KEY: 'KeyS',
        LEFT_KEY: 'KeyA',
        RIGHT_KEY: 'KeyD',
        SPRINT_KEY: 'ShiftLeft',
        JUMP_KEY: 'Space',
        INTERACT_KEY: 'KeyE',
        RELOAD_KEY: 'KeyR',
        RADIO_KEY: 'KeyQ'
    },
    WEAPONS: {
        MAGNUM: {
            DAMAGE: 50,
            RANGE: 100,
            AMMO_MAX: 6,
            RELOAD_TIME: 2000,
            FIRE_RATE: 500
        }
    },
    WORLD: {
        GRAVITY: 9.8,
        TIME_SCALE: 1,
        WEATHER: 'clear', // 'clear', 'rain', 'fog'
        TIME_OF_DAY: 'night' // 'day', 'sunset', 'night'
    },
    AUDIO: {
        MASTER_VOLUME: 0.8,
        MUSIC_VOLUME: 0.5,
        SFX_VOLUME: 0.7,
        RADIO_STATIONS: [
            {
                name: "VICE FM",
                songs: ["Fortunate Song"]
            },
            {
                name: "ROCK CITY",
                songs: ["Highway Star"]
            },
            {
                name: "WAVE 103",
                songs: ["Neon Lights"]
            }
        ]
    }
};
