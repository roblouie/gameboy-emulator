export class SaveManager {
  private databaseName = "typescript-gameboy-emulator";
  private databaseVersion = 1;
  private store = "saves";

  private db: IDBDatabase | undefined;

  initialize() {
    return new Promise<void>((resolve, reject) => {
      const req = indexedDB.open(this.databaseName, this.databaseVersion);

      req.onupgradeneeded = () => {
        this.db = req.result;

        if (!this.db.objectStoreNames.contains(this.store)) {
          this.db.createObjectStore(this.store);
        }
      };

      req.onsuccess = () => {
        this.db = req.result;
        resolve();
      }
      req.onerror = () => reject(req.error);
    });
  }

  getSave(saveKey: string): Promise<ArrayBuffer | undefined> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const tx = this.db.transaction(this.store, "readonly");
      const store = tx.objectStore(this.store);

      const req = store.get(saveKey);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  setSave(saveKey: string, save: ArrayBuffer | undefined) {
    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const tx = this.db.transaction(this.store, "readwrite");
      const store = tx.objectStore(this.store);

      const req = store.put(save, saveKey);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}

