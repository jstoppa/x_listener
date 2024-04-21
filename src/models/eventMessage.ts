import { ActionType } from './actionType';
import { SourceType } from './sourceType';

export interface EventMessage {
	source: SourceType;
	action: ActionType;
	data: any;
}
