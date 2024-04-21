import { RawUser } from './rawUser';
import { XUserType } from './xUserType';

export interface XUserTypeDetails {
	objectType: XUserType;
	entries: RawUser[];
}
