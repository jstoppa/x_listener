import { CustomEventType } from '../models/customEventType';
import { SourceType } from '../models/sourceType';

const application = document.createElement('script');
application.src = chrome.runtime.getURL('web_accessible.js');
application.onload = function () {
	application.remove();
};
(document.head || document.documentElement).appendChild(application);

// initialise listener to proxy messages from Popup to Web Accessible
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request) {
		if (request.source === SourceType.Popup) {
			const event = new CustomEvent(
				CustomEventType.MessageFromContentScript,
				{ detail: request }
			);
			document.dispatchEvent(event);
		}
	} else {
		throw 'Message from Popup is empty';
	}
});

// initialise listener to proxy messages from Web Accessible to Popup
document.addEventListener(
	CustomEventType.MessageFromWebAccessible,
	(responseData: any) => {
		if (responseData?.detail) {
			chrome.runtime.sendMessage(responseData?.detail);
		} else {
			throw 'MessageFromWebAccessible response is empty';
		}
	}
);
