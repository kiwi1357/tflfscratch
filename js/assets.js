// =================================================================================
// --- ASSET LOADER MODULE ---
// Handles loading and storing of game assets like images.
// =================================================================================

const assetLoader = {
    images: {},
    _promises: [],

    loadImage(key, src) {
        const promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.images[key] = img;
                resolve(img);
            };
            img.onerror = (err) => {
                console.error(`Failed to load image ${key} from ${src}`);
                reject(err);
            };
            img.src = src;
        });
        this._promises.push(promise);
    },

    loadAll() {
        return Promise.all(this._promises);
    }
};
