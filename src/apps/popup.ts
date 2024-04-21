import { uiMessagingHelper } from '../helpers/messaging/popUpMessaging';
import { uiTableHelper } from '../helpers/ui/uiTableHelper';
import { ActionType } from '../models/actionType';
import { EventMessage } from '../models/eventMessage';
import { XUserType } from '../models/xUserType';

document.addEventListener('DOMContentLoaded', () => {
	// Assuming you have buttons with a common class 'tabButton'
	const tabButtons = document.querySelectorAll('.tabLinks');

	tabButtons.forEach((button) => {
		button.addEventListener('click', function (event) {
			const tableName = (event.currentTarget as HTMLElement).getAttribute(
				'data-tableName'
			);
			if (tableName) {
				uiTableHelper.openTable(event, tableName);
			}
		});
	});

	// set first tab to be active
	const firstTab = document.querySelector('.tabLinks') as HTMLElement;
	firstTab.click();
	firstTab.className += ' active';

	// initialise sorting
	for (let key in XUserType) {
		const xUserType = XUserType[key as keyof typeof XUserType];
		const table = uiTableHelper.createTableComponent(key);
		const div = document.getElementById(key);
		(div as HTMLElement).appendChild(table);

		for (let i = 0; i < 3; i++) {
			const column = document.getElementById(
				`${key}Column${i.toString()}`
			) as HTMLElement;
			column.addEventListener('click', () =>
				uiTableHelper.sortTable(`${key}Table`, i)
			);
		}
		uiMessagingHelper.sendMessageToContentScript(xUserType);
	}
});

// Hook button to UI
for (let key in XUserType) {
	const xUserType = XUserType[key as keyof typeof XUserType];
	const button = document.querySelector(`#Load${key}Button`);
	if (button) {
		button.addEventListener('click', () => {
			uiMessagingHelper.sendMessageToContentScript(xUserType);
		});
	}
}

// listen to events from Content Script
chrome.runtime.onMessage.addListener(
	(eventMessage: EventMessage, sender, sendResponse) => {
		const b = 0;
		if (
			eventMessage.action === ActionType.FetchFollowers ||
			eventMessage.action === ActionType.FetchFollowings
		) {
			if (eventMessage.data) {
				uiTableHelper.populateTableWithData(
					eventMessage.data,
					eventMessage.action
				);
			}
		}
	}
);
