// Audio Manager - Classic 80s Arcade Sound Effects
class AudioManager {
    constructor() {
        this.enabled = true;
        this.musicVolume = 0.3;
        this.sfxVolume = 0.4;
        
        // Audio context for generating sounds
        this.audioContext = null;
        this.initAudioContext();
        
        // Background music
        this.bgMusic = new Audio('assets/background.mp3');
        this.bgMusic.loop = true;
        this.bgMusic.volume = this.musicVolume;
        this.musicPlaying = false;
        this.musicEnabled = true;
        
        // Sound effect cooldowns to prevent overlap
        this.lastDigTime = 0;
        this.digCooldown = 80;
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }

    // Update music playback
    updateMusic(isMoving) {
        if (!this.enabled || !this.musicEnabled) {
            if (!this.bgMusic.paused) this.bgMusic.pause();
            return;
        }
        
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

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

    // Classic arcade beep
    playBeep(frequency = 440, duration = 0.1, type = 'square') {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(this.sfxVolume * 0.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Dig sound - Classic crunchy arcade sound
    playDigSound() {
        if (!this.enabled || !this.audioContext) return;
        
        const now = Date.now();
        if (now - this.lastDigTime < this.digCooldown) return;
        this.lastDigTime = now;

        // Create a crunchy dig sound
        const noise = this.createNoise(0.08);
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 800;
        filter.Q.value = 2;
        
        const gainNode = this.audioContext.createGain();
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.08);
        
        noise.start();
        noise.stop(this.audioContext.currentTime + 0.08);
    }
    
    // Create noise buffer for sound effects
    createNoise(duration) {
        const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        return noise;
    }

    // Pump sound - Classic arcade rising pitch squeak
    playPumpSound(stage = 1) {
        if (!this.enabled || !this.audioContext) return;

        const baseFreq = 200 + (stage * 150);
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 2, this.audioContext.currentTime + 0.15);
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(this.sfxVolume * 0.35, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.15);
    }

    // Monster defeat sound - Classic pop/explosion
    playMonsterDefeatSound() {
        if (!this.enabled || !this.audioContext) return;

        // Pop sound
        const osc1 = this.audioContext.createOscillator();
        const gain1 = this.audioContext.createGain();
        osc1.connect(gain1);
        gain1.connect(this.audioContext.destination);
        
        osc1.frequency.setValueAtTime(600, this.audioContext.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);
        osc1.type = 'square';
        
        gain1.gain.setValueAtTime(this.sfxVolume * 0.5, this.audioContext.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        osc1.start();
        osc1.stop(this.audioContext.currentTime + 0.2);

        // Add noise burst for explosion effect
        const noise = this.createNoise(0.15);
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;
        
        const noiseGain = this.audioContext.createGain();
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.audioContext.destination);
        
        noiseGain.gain.setValueAtTime(this.sfxVolume * 0.2, this.audioContext.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
        
        noise.start();
        noise.stop(this.audioContext.currentTime + 0.15);
    }

    // Rock fall sound - Deep rumble
    playRockFallSound() {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(120, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(40, this.audioContext.currentTime + 0.4);
        oscillator.type = 'triangle';

        gainNode.gain.setValueAtTime(this.sfxVolume * 0.6, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.4);
    }

    // Item collect sound - Classic arcade pickup jingle
    playCollectSound() {
        if (!this.enabled || !this.audioContext) return;

        const notes = [784, 988, 1175]; // G5, B5, D6 - cheerful arpeggio
        
        notes.forEach((freq, i) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            const startTime = this.audioContext.currentTime + (i * 0.06);
            oscillator.frequency.setValueAtTime(freq, startTime);
            oscillator.type = 'square';

            gainNode.gain.setValueAtTime(this.sfxVolume * 0.3, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.12);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.12);
        });
    }

    // Player damage sound - Classic arcade hit
    playDamageSound() {
        if (!this.enabled || !this.audioContext) return;

        // Descending tone
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(80, this.audioContext.currentTime + 0.4);
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(this.sfxVolume * 0.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.4);
    }

    // Level complete sound - Classic victory fanfare
    playLevelCompleteSound() {
        if (!this.enabled || !this.audioContext) return;

        const melody = [523, 659, 784, 1047]; // C5 E5 G5 C6
        
        melody.forEach((freq, i) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            const startTime = this.audioContext.currentTime + (i * 0.12);
            oscillator.frequency.setValueAtTime(freq, startTime);
            oscillator.type = 'square';

            gainNode.gain.setValueAtTime(this.sfxVolume * 0.4, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.2);
        });
    }

    // Game over sound - Classic descending melody
    playGameOverSound() {
        if (!this.enabled || !this.audioContext) return;

        const melody = [392, 349, 330, 262]; // G4 F4 E4 C4 - sad descending
        
        melody.forEach((freq, i) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            const startTime = this.audioContext.currentTime + (i * 0.2);
            oscillator.frequency.setValueAtTime(freq, startTime);
            oscillator.type = 'square';

            gainNode.gain.setValueAtTime(this.sfxVolume * 0.4, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.35);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.35);
        });
    }

    toggleAudio() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

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
