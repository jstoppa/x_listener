import { ActionType } from '../../models/actionType';
import { EventMessage } from '../../models/eventMessage';
import { SourceType } from '../../models/sourceType';
import { XUserType } from '../../models/xUserType';

const sendMessageToContentScript = (xUserType: XUserType) => {
	chrome.tabs.query(
		{ active: true, currentWindow: true },
		function (tabs: any) {
			chrome.tabs.sendMessage(tabs[0].id, <EventMessage>{
				source: SourceType.Popup,
				action:
					xUserType === XUserType.Followers
						? ActionType.FetchFollowers
						: ActionType.FetchFollowings,
			});
		}
	);
};

export const uiMessagingHelper = {
	sendMessageToContentScript,
};
