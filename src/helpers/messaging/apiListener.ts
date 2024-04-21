import { User } from '../../models/user';
import { XUserTypeDetails } from '../../models/xUserTypeDetails';
import { dbOperations } from '../db/dbOperations';
import { getObjectType } from '../db/xObjectClassifier';

// this code intercept APIs from X and analyse its content
export const modifyXMLHttpRequest = (): void => {
	const XHR = XMLHttpRequest.prototype;

	const open = XHR.open;
	const send = XHR.send;
	const setRequestHeader = XHR.setRequestHeader;

	XHR.open = function (method, url: string | URL): void {
		this._method = method;
		this._url = url.toString();
		this._requestHeaders = {};
		this._startTime = new Date().toISOString();

		return open.apply(this, arguments as any);
	};

	XHR.setRequestHeader = function (header: string, value: string): void {
		if (!this._requestHeaders) this._requestHeaders = {};
		this._requestHeaders[header] = value;
		return setRequestHeader.apply(this, arguments as any);
	};

	XHR.send = function (postData?: Document | BodyInit | null): void {
		this.addEventListener('load', function (): void {
			const endTime: string = new Date().toISOString();

			const myUrl: string | undefined = this._url?.toString()
				? this._url.toLowerCase()
				: this._url;
			if (myUrl) {
				if (this.responseType === '' || this.responseType === 'text') {
					try {
						if (this.responseText) {
							const xUserTypeDetails = getObjectType(
								myUrl,
								this.responseText
							) as XUserTypeDetails;
							const users: User[] = [];
							if (
								xUserTypeDetails?.entries?.length > 0 &&
								xUserTypeDetails?.objectType
							) {
								for (let rawUser of xUserTypeDetails?.entries) {
									const user = rawUser?.legacy as User;
									if (user) {
										user.is_blue_verified =
											rawUser?.is_blue_verified;
										users.push(user);
									}
								}
								dbOperations
									.upsertBatchByScreenName(
										users,
										xUserTypeDetails?.objectType
									)
									.then((results: any) => {
										results.forEach((result: User) => {
											console.log(
												`Record for ${result?.screen_name} was updated.`
											);
										});
									})
									.catch((error) => {
										const a = 0;

										(window as any).a = 0;
										console.log(
											'Error upserting batch:',
											error
										);
									});
							}
						}
					} catch (err) {
						console.log('Error in responseType try catch', err);
					}
				}
			}
		});
		return send.apply(this, arguments as any);
	};
};
