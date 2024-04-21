import { User } from '../../models/user';
import { XUserType } from '../../models/xUserType';

const dbName: string = 'XFollowerListDB';

// Open (or create) the database
const openDB = (): Promise<IDBDatabase> => {
	return new Promise((resolve, reject) => {
		const request: IDBOpenDBRequest = indexedDB.open(dbName, 1);
		request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
			const db: IDBDatabase = (e.target as IDBOpenDBRequest).result;
			for (let xUserType in XUserType) {
				let store;
				if (!db.objectStoreNames.contains(xUserType.toString())) {
					store = db.createObjectStore(xUserType.toString(), {
						keyPath: 'id',
						autoIncrement: true,
					});
				} else {
					store = request.transaction!.objectStore(
						xUserType.toString()
					);
				}

				if (!store.indexNames.contains('screen_name')) {
					store.createIndex('screen_name', 'screen_name', {
						unique: true,
					});
				}
			}
		};

		request.onsuccess = (e: Event) => {
			resolve((e.target as IDBOpenDBRequest).result);
		};

		request.onerror = (e: Event) => {
			reject(
				'Error opening database: ' +
					(e.target as IDBOpenDBRequest).error?.message
			);
		};
	});
};

// Add data
const addData = (user: User, xUserType: XUserType): Promise<IDBValidKey> => {
	return openDB().then((db: IDBDatabase) => {
		return new Promise((resolve, reject) => {
			const store = getStore(db, xUserType);
			const request: IDBRequest<IDBValidKey> = store.add(user);

			request.onsuccess = () => resolve(request.result);
			request.onerror = () =>
				reject('Error adding data: ' + request.error?.message);
		});
	});
};

// upsert batch by screen_name
const upsertBatchByScreenName = (records: User[], xUserType: XUserType) => {
	return openDB().then((db) => {
		const store = getStore(db, xUserType);
		const upsertPromises = [];

		for (const record of records) {
			const promise = new Promise((resolve, reject) => {
				// First, try to retrieve an existing record by screen_name
				const index = store.index('screen_name');
				const request = index.get(record?.screen_name as IDBValidKey);
				request.onsuccess = () => {
					// Use put to update the existing record or add a new one
					const putRequest = store.put(record);
					putRequest.onsuccess = () =>
						resolve({
							screenName: record.screen_name,
							updated: true,
						});
					putRequest.onerror = () => reject(putRequest.error);
				};
				request.onerror = () => {
					reject(request.error);
				};
			});
			upsertPromises.push(promise);
		}

		// Wait for all upsert operations to complete
		return Promise.all(upsertPromises);
	});
};

// fetch all users from the DB
const fetchUsers = (xUserType: XUserType): Promise<User[]> => {
	return openDB().then((db: IDBDatabase) => {
		return new Promise((resolve, reject) => {
			const store = getStore(db, xUserType);
			const request = store.getAll(); // This gets all records from the store

			request.onsuccess = () => {
				resolve(request.result as User[]);
			};

			request.onerror = () => {
				reject('Error fetching data: ' + request.error?.message);
			};
		});
	});
};

const getStore = (db: IDBDatabase, xUserType: XUserType) => {
	const storeName = xUserType?.toString();
	const transaction = db.transaction(storeName, 'readwrite');
	const store = transaction.objectStore(storeName);

	return store;
};

export const dbOperations = {
	openDB,
	addData,
	upsertBatchByScreenName,
	fetchUsers,
};
