
import { MenuItem } from './types';

const DB_NAME = 'PawonSalamDB';
const DB_VERSION = 1;
const ASSET_STORE_NAME = 'assets';
const DATA_STORE_NAME = 'data';

let db: IDBDatabase;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("IndexedDB error:", request.error);
      reject("IndexedDB error");
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(ASSET_STORE_NAME)) {
        dbInstance.createObjectStore(ASSET_STORE_NAME);
      }
      if (!dbInstance.objectStoreNames.contains(DATA_STORE_NAME)) {
        dbInstance.createObjectStore(DATA_STORE_NAME);
      }
    };
  });
};

// --- Asset (Blob) Functions ---

export const setAsset = async (key: string, value: Blob): Promise<void> => {
  const dbInstance = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = dbInstance.transaction(ASSET_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(ASSET_STORE_NAME);
    const request = store.put(value, key);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getAsset = async (key: string): Promise<Blob | null> => {
  const dbInstance = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = dbInstance.transaction(ASSET_STORE_NAME, 'readonly');
    const store = transaction.objectStore(ASSET_STORE_NAME);
    const request = store.get(key);

    request.onsuccess = () => {
        resolve(request.result ? (request.result as Blob) : null);
    };
    request.onerror = () => reject(request.error);
  });
};

export const deleteAsset = async (key: string): Promise<void> => {
    const dbInstance = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = dbInstance.transaction(ASSET_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(ASSET_STORE_NAME);
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

// --- Menu Data Functions ---

export const saveMenuItems = async (items: MenuItem[]): Promise<void> => {
  const dbInstance = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = dbInstance.transaction(DATA_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(DATA_STORE_NAME);
    const request = store.put(items, 'menu_items_data');
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getMenuItems = async (): Promise<MenuItem[] | null> => {
  const dbInstance = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = dbInstance.transaction(DATA_STORE_NAME, 'readonly');
    const store = transaction.objectStore(DATA_STORE_NAME);
    const request = store.get('menu_items_data');

    request.onsuccess = () => {
        resolve(request.result ? (request.result as MenuItem[]) : null);
    };
    request.onerror = () => reject(request.error);
  });
};

export const deleteMenuItems = async (): Promise<void> => {
  const dbInstance = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = dbInstance.transaction(DATA_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(DATA_STORE_NAME);
    const request = store.delete('menu_items_data');

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};


// Helper to convert base64 to Blob
export const base64ToBlob = (base64: string): Blob => {
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
};
