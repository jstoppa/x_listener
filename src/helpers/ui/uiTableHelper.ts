import { ActionType } from '../../models/actionType';
import { User } from '../../models/user';
import { XUserType } from '../../models/xUserType';

const sortDirections: { [key: string]: 'asc' | 'desc' } = {};

const openTable = (evt: Event, tableName: string) => {
	// Declare all variables
	var i, tabContent, tabLinks;

	// Get all elements with class="tabContent" and hide them
	tabContent = document.getElementsByClassName('tabContent');
	for (i = 0; i < tabContent.length; i++) {
		const content = tabContent[i] as HTMLElement; // Type assertion to HTMLElement
		content.style.display = 'none';
	}

	// Get all elements with class="tabLinks" and remove the class "active"
	tabLinks = document.getElementsByClassName('tabLinks');
	for (i = 0; i < tabLinks.length; i++) {
		tabLinks[i].className = tabLinks[i].className.replace(' active', '');
	}

	// Show the current tab, and add an "active" class to the button that opened the tab
	const tab = document.getElementById(tableName);
	if (tab) {
		tab.style.display = 'block';
	}
	// Use currentTarget as HTMLButtonElement, assuming that openTable is only called by buttons
	const button = evt.currentTarget as HTMLButtonElement;
	button.className += ' active';
};

const createTableComponent = (id: string) => {
	const table = document.createElement('table');
	table.id = id + 'Table';
	table.innerHTML = `
	  <thead>
		<tr>
		  <th id="${id}Column0">Screen Name</th>
		  <th id="${id}Column1">Followers Count</th>
		  <th id="${id}Column2">Following Count</th>
		</tr>
	  </thead>
	  <tbody id="${id}TableBody">
		<!-- Rows will be dynamically inserted here -->
	  </tbody>
	`;
	return table;
};

const sortTable = (tableId: string, column: number) => {
	const table = document.getElementById(tableId) as HTMLTableElement;
	if (!table) return;

	let rows = Array.from(table.getElementsByTagName('TR'));
	const header = rows.shift(); // Exclude the header from sorting

	// Determine sort direction or default to 'asc' if not previously sorted
	const sortDirection = (sortDirections[tableId + column] =
		sortDirections[tableId + column] === 'asc' ? 'desc' : 'asc');

	// Sort rows array in memory
	rows.sort((a, b) => {
		const xText = a.getElementsByTagName('TD')[column].textContent || '';
		const yText = b.getElementsByTagName('TD')[column].textContent || '';

		// Check if the text content is numeric
		const x = parseInt(xText?.replace(/,/g, ''));
		const y = parseInt(yText?.replace(/,/g, ''));
		const isNumeric = !isNaN(x) && !isNaN(y);

		// Compare numbers if numeric, otherwise compare strings
		let comparison = 0;
		if (isNumeric) {
			comparison = x - y;
		} else {
			comparison = xText.toLowerCase().localeCompare(yText.toLowerCase());
		}

		// Reverse the comparison for descending sort
		return sortDirection === 'asc' ? comparison : -comparison;
	});

	// Create a new tbody and append the sorted rows
	const tbody = document.createElement('tbody');
	if (header) tbody.appendChild(header); // Reattach the header row

	rows.forEach((row) => tbody.appendChild(row));

	// Replace the old tbody with the new tbody
	table.replaceChild(tbody, table.getElementsByTagName('tbody')[0]);
};

const populateTableWithData = (data: any, action: ActionType) => {
	const tableBodyName =
		action === ActionType.FetchFollowers
			? XUserType.Followers.toString() + 'TableBody'
			: XUserType.Following.toString() + 'TableBody';
	const tableBody = document.getElementById(tableBodyName);
	if (tableBody) {
		tableBody.innerHTML = ''; // Clear existing table rows
		data.sort(
			(a: User, b: User) =>
				(b.followers_count || 0) - (a.followers_count || 0)
		).forEach((user: User) => {
			const row = document.createElement('tr');

			const screenNameCell = document.createElement('td');
			screenNameCell.textContent = user?.screen_name || null;
			row.appendChild(screenNameCell);

			const followersCountCell = document.createElement('td');
			followersCountCell.textContent = toLocaleNumber(
				user?.followers_count?.toString() || null
			);

			row.appendChild(followersCountCell);

			const followingCountCell = document.createElement('td');
			followingCountCell.textContent = toLocaleNumber(
				user?.friends_count?.toString() || null
			);
			row.appendChild(followingCountCell);
			// Add more cells as needed

			tableBody.appendChild(row);
		});
	}
};

const toLocaleNumber = (text: string | null) => {
	if (text) {
		const number = parseFloat(text);
		if (!isNaN(number)) {
			return number.toLocaleString(navigator.language);
		}
	}
	return '';
};

export const uiTableHelper = {
	openTable,
	createTableComponent,
	sortTable,
	populateTableWithData,
};
