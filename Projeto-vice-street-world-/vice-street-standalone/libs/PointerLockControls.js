// Versão adaptada do PointerLockControls.js para uso local
// Baseado no original do Three.js, mas modificado para funcionar sem módulos ES

// Classe PointerLockControls
class PointerLockControls {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement || document.body;
        
        // Estado
        this.isLocked = false;
        
        // Ângulos de Euler
        this.minPolarAngle = 0; // radianos
        this.maxPolarAngle = Math.PI; // radianos
        
        // Vetor para direção
        this._direction = new THREE.Vector3(0, 0, -1);
        this._vector = new THREE.Vector3();
        this._spherical = new THREE.Spherical();
        this._sphericalDelta = new THREE.Spherical();
        
        this._PI_2 = Math.PI / 2;
        this._euler = new THREE.Euler(0, 0, 0, 'YXZ');
        
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onPointerlockChange = this._onPointerlockChange.bind(this);
        this._onPointerlockError = this._onPointerlockError.bind(this);
        
        this.connect();
    }
    
    connect() {
        this.domElement.ownerDocument.addEventListener('mousemove', this._onMouseMove);
        this.domElement.ownerDocument.addEventListener('pointerlockchange', this._onPointerlockChange);
        this.domElement.ownerDocument.addEventListener('pointerlockerror', this._onPointerlockError);
    }
    
    disconnect() {
        this.domElement.ownerDocument.removeEventListener('mousemove', this._onMouseMove);
        this.domElement.ownerDocument.removeEventListener('pointerlockchange', this._onPointerlockChange);
        this.domElement.ownerDocument.removeEventListener('pointerlockerror', this._onPointerlockError);
    }
    
    dispose() {
        this.disconnect();
    }
    
    getObject() {
        return this.camera;
    }
    
    getDirection(v) {
        return v.copy(this._direction).applyQuaternion(this.camera.quaternion);
    }
    
    moveForward(distance) {
        this._vector.setFromMatrixColumn(this.camera.matrix, 0);
        this._vector.crossVectors(this.camera.up, this._vector);
        this.camera.position.addScaledVector(this._vector, distance);
    }
    
    moveRight(distance) {
        this._vector.setFromMatrixColumn(this.camera.matrix, 0);
        this.camera.position.addScaledVector(this._vector, distance);
    }
    
    lock() {
        this.domElement.requestPointerLock();
    }
    
    unlock() {
        this.domElement.ownerDocument.exitPointerLock();
    }
    
    _onMouseMove(event) {
        if (!this.isLocked) return;
        
        const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
        
        this._euler.setFromQuaternion(this.camera.quaternion);
        
        this._euler.y -= movementX * 0.002;
        this._euler.x -= movementY * 0.002;
        
        this._euler.x = Math.max(-this._PI_2, Math.min(this._PI_2, this._euler.x));
        
        this.camera.quaternion.setFromEuler(this._euler);
        
        this._dispatchEvent();
    }
    
    _onPointerlockChange() {
        const isLocked = this.domElement.ownerDocument.pointerLockElement === this.domElement;
        
        if (isLocked !== this.isLocked) {
            this.isLocked = isLocked;
            this._dispatchEvent();
        }
    }
    
    _onPointerlockError() {
        console.error('PointerLockControls: Erro ao tentar bloquear o ponteiro.');
    }
    
    _dispatchEvent() {
        const event = this.isLocked ? { type: 'lock' } : { type: 'unlock' };
        
        if (this.isLocked) {
            this.dispatchEvent(event);
        } else {
            this.dispatchEvent(event);
        }
    }
    
    // Sistema de eventos simplificado
    addEventListener(type, listener) {
        if (!this._listeners) this._listeners = {};
        if (!this._listeners[type]) this._listeners[type] = [];
        this._listeners[type].push(listener);
    }
    
    removeEventListener(type, listener) {
        if (!this._listeners) return;
        if (!this._listeners[type]) return;
        
        const index = this._listeners[type].indexOf(listener);
        if (index !== -1) {
            this._listeners[type].splice(index, 1);
        }
    }
    
    dispatchEvent(event) {
        if (!this._listeners) return;
        if (!this._listeners[event.type]) return;
        
        const listeners = this._listeners[event.type].slice(0);
        for (let i = 0; i < listeners.length; i++) {
            listeners[i].call(this, event);
        }
    }
}
