// master-processor.js
// Neemt op wat er uit de uitgang komt, in stereo, en stuurt de blokken naar de
// hoofddraad. Geen container, geen codec, gewoon Float32 per kanaal.

class MasterProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.actief = false;
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
        if (!this.actief || !input || input.length === 0) return true;

        const links = input[0];
        const rechts = input.length > 1 ? input[1] : input[0];
        if (!links) return true;

        this.port.postMessage({
            type: 'blok',
            l: new Float32Array(links),
            r: new Float32Array(rechts)
        });
        return true;
    }
}

registerProcessor('master-processor', MasterProcessor);
