// Audio Manager - Handles sound effects and music
class AudioManager {
    constructor() {
        this.enabled = true;
        this.musicVolume = 0.3;
        this.sfxVolume = 0.3; // Reduced from 0.5 to balance with music
        
        // Audio context for generating sounds
        this.audioContext = null;
        this.initAudioContext();
        
        // Background music
        this.bgMusic = new Audio('assets/background.mp3');
        this.bgMusic.loop = true;
        this.bgMusic.volume = this.musicVolume;
        this.musicPlaying = false;
        this.musicEnabled = true;
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
            // We can still play music via HTML5 Audio even if Web Audio API fails
        }
    }

    // Update music playback
    updateMusic(isMoving) {
        if (!this.enabled || !this.musicEnabled) {
            if (!this.bgMusic.paused) this.bgMusic.pause();
            return;
        }
        
        // Resume context if suspended (browser policy)
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        // Play continuously if enabled
        if (this.bgMusic.paused) {
            this.bgMusic.play().catch(e => console.log("Audio play failed:", e));
        }
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (!this.musicEnabled) {
            this.bgMusic.pause();
        }
        return this.musicEnabled;
    }

    // Play a simple beep sound effect using Web Audio API
    playBeep(frequency = 440, duration = 0.1, type = 'sine') {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(this.sfxVolume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Dig sound - low frequency sweep
    playDigSound() {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);
        oscillator.type = 'sawtooth';

        gainNode.gain.setValueAtTime(this.sfxVolume * 0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    // Pump sound - rising pitch
    playPumpSound(stage = 1) {
        if (!this.enabled || !this.audioContext) return;

        const baseFreq = 300 + (stage * 100);
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, this.audioContext.currentTime + 0.2);
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(this.sfxVolume * 0.4, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    // Monster defeat sound
    playMonsterDefeatSound() {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);
        oscillator.type = 'sawtooth';

        gainNode.gain.setValueAtTime(this.sfxVolume * 0.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    // Rock fall sound
    playRockFallSound() {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.4);
        oscillator.type = 'triangle';

        gainNode.gain.setValueAtTime(this.sfxVolume * 0.6, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.4);
    }

    // Item collect sound
    playCollectSound() {
        if (!this.enabled || !this.audioContext) return;

        const notes = [523.25, 659.25, 783.99]; // C, E, G
        
        notes.forEach((freq, i) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            const startTime = this.audioContext.currentTime + (i * 0.05);
            oscillator.frequency.setValueAtTime(freq, startTime);
            oscillator.type = 'square';

            gainNode.gain.setValueAtTime(this.sfxVolume * 0.3, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.15);
        });
    }

    // Player damage sound
    playDamageSound() {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
        oscillator.type = 'sawtooth';

        gainNode.gain.setValueAtTime(this.sfxVolume * 0.7, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }

    // Level complete sound
    playLevelCompleteSound() {
        if (!this.enabled || !this.audioContext) return;

        const melody = [523.25, 587.33, 659.25, 783.99, 880.00]; // C D E G A
        
        melody.forEach((freq, i) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            const startTime = this.audioContext.currentTime + (i * 0.1);
            oscillator.frequency.setValueAtTime(freq, startTime);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(this.sfxVolume * 0.4, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.2);
        });
    }

    // Game over sound
    playGameOverSound() {
        if (!this.enabled || !this.audioContext) return;

        const melody = [440, 415.30, 392, 349.23]; // A G# G F
        
        melody.forEach((freq, i) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            const startTime = this.audioContext.currentTime + (i * 0.15);
            oscillator.frequency.setValueAtTime(freq, startTime);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(this.sfxVolume * 0.5, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    }

    // Toggle audio
    toggleAudio() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // Set volumes
    setMusicVolume(volume) {
        this.musicVolume = Utils.clamp(volume, 0, 1);
        if (this.bgMusic) {
            this.bgMusic.volume = this.musicVolume;
        }
    }

    setSfxVolume(volume) {
        this.sfxVolume = Utils.clamp(volume, 0, 1);
    }
}
