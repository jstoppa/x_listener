import { dbOperations } from '../helpers/db/dbOperations';
import { modifyXMLHttpRequest } from '../helpers/messaging/apiListener';
import { ActionType } from '../models/actionType';
import { CustomEventType } from '../models/customEventType';
import { EventMessage } from '../models/eventMessage';
import { SourceType } from '../models/sourceType';
import { XUserType } from '../models/xUserType';

modifyXMLHttpRequest();

document.addEventListener(
	CustomEventType.MessageFromContentScript,
	(event: any) => {
		// Process the message and optionally respond
		if (event.detail) {
			const eventMessage = <EventMessage>event.detail;
			switch (eventMessage.action) {
				case ActionType.FetchFollowers:
					dbOperations
						.fetchUsers(XUserType.Followers)
						.then((data) => {
							const eventMessageResponse = <EventMessage>{
								source: SourceType.WebAccessible,
								data: data,
								action: eventMessage.action,
							};
							const responseEvent = new CustomEvent(
								CustomEventType.MessageFromWebAccessible,
								{ detail: eventMessageResponse }
							);
							document.dispatchEvent(responseEvent);
						});
					break;
				case ActionType.FetchFollowings:
					dbOperations
						.fetchUsers(XUserType.Following)
						.then((data) => {
							const eventMessageResponse = <EventMessage>{
								source: SourceType.WebAccessible,
								data: data,
								action: eventMessage.action,
							};
							const responseEvent = new CustomEvent(
								CustomEventType.MessageFromWebAccessible,
								{ detail: eventMessageResponse }
							);
							document.dispatchEvent(responseEvent);
						});
					break;
			}
		}
	}
);
