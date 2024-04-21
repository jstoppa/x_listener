import { XUserType } from '../../models/xUserType';
import { XUserTypeDetails } from '../../models/xUserTypeDetails';

export const getObjectType = (
	url: string,
	data: string
): XUserTypeDetails | undefined => {
	const lowerUrl = url?.toLowerCase();

	if (lowerUrl && data) {
		if (lowerUrl.indexOf('followers?') > -1) {
			let dataObj = parseData(data);
			const userList = getXUserTypeDetails(dataObj);
			if (userList) {
				userList.objectType = XUserType.Followers;
				return userList;
			}
		} else if (lowerUrl.indexOf('following?') > -1) {
			let dataObj = parseData(data);
			const userList = getXUserTypeDetails(dataObj);
			if (userList) {
				userList.objectType = XUserType.Following;
				return userList;
			}
		}
	}
	return undefined;
};

const getXUserTypeDetails = (dataObj: any): XUserTypeDetails | undefined => {
	const instructions =
		dataObj?.data?.user?.result?.timeline?.timeline?.instructions?.filter(
			(x: any) => x.type === 'TimelineAddEntries'
		);
	if (instructions && instructions.length > 0) {
		return {
			entries: instructions[0]?.entries?.map(
				(entry: any) =>
					entry?.content?.itemContent?.user_results?.result
			),
		} as XUserTypeDetails;
	} else {
		return undefined;
	}
};

const parseData = (data: any) => {
	try {
		return JSON.parse(data);
	} catch {
		return undefined;
	}
};
