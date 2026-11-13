/** Tiny IndexedDB wrapper. Database is namespaced "tbtge" (shared github.io origin, docs/08). */
const DB_NAME = 'tbtge';
const VERSION = 1;
export const STORES = ['profiles', 'segments', 'settings', 'proofs'] as const;
export type Store = (typeof STORES)[number];

let dbp: Promise<IDBDatabase> | null = null;

function open(): Promise<IDBDatabase> {
  return (dbp ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const s of STORES) if (!db.objectStoreNames.contains(s)) db.createObjectStore(s);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }));
}

function tx<T>(store: Store, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return open().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(store, mode);
        const req = fn(t.objectStore(store));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      }),
  );
}

export const db = {
  get: <T>(store: Store, key: string) => tx<T | undefined>(store, 'readonly', (s) => s.get(key) as IDBRequest<T | undefined>),
  put: <T>(store: Store, key: string, value: T) => tx(store, 'readwrite', (s) => s.put(value, key)).then(() => undefined),
  del: (store: Store, key: string) => tx(store, 'readwrite', (s) => s.delete(key)).then(() => undefined),
  keys: (store: Store) => tx<IDBValidKey[]>(store, 'readonly', (s) => s.getAllKeys()).then((k) => k.map(String)),
  all: <T>(store: Store) => tx<T[]>(store, 'readonly', (s) => s.getAll() as IDBRequest<T[]>),
};
