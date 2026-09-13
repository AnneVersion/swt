// recorder-processor.js
// Neemt ruwe mono audio op en stuurt blokken naar de hoofddraad.
// Geen container, geen codec, direct Float32 zodat er niets gedecodeerd hoeft te worden.

class RecorderProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.actief = false;
        this.piek = 0;
        this.tellerVoorMeter = 0;

        this.port.onmessage = (e) => {
            if (e.data === 'start') {
                this.actief = true;
            } else if (e.data === 'stop') {
                this.actief = false;
                this.port.postMessage({ type: 'klaar' });
            }
        };
    }

    process(inputs) {
        const input = inputs[0];
        if (!input || input.length === 0) return true;

        const kanaal = input[0];
        if (!kanaal) return true;

        // Niveaumeter loopt altijd, ook als er niet wordt opgenomen.
        for (let i = 0; i < kanaal.length; i++) {
            const a = Math.abs(kanaal[i]);
            if (a > this.piek) this.piek = a;
        }
        this.tellerVoorMeter += kanaal.length;
        if (this.tellerVoorMeter >= 1024) {
            this.port.postMessage({ type: 'niveau', piek: this.piek });
            this.piek = 0;
            this.tellerVoorMeter = 0;
        }

        if (this.actief) {
            // Kopie meesturen: het originele blok wordt hergebruikt door de engine.
            this.port.postMessage({ type: 'blok', data: new Float32Array(kanaal) });
        }

        return true;
    }
}

registerProcessor('recorder-processor', RecorderProcessor);
