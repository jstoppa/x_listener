# X Listener

A chrome extension prototype to intercept X (formerly Twitter) API calls and store information in the local IndexedDB

## Installation

1. Run npm install
   bash

```
npm install
```

2. Build package
   bash

```
npm run build
```

3. Navigate to `chrome://extensions/`, click on `Load Unpacked` and select the dist folder
   ![alt text](images/installation1.png 'Title')

4. Start using X/Twitter as normal in Chrome and navigate to your Following and Followers to collect the information, the extension is not very smart at the moment, it only collects when the API calls are made.

5. To display the list of your followers and followings, open the chrome extension from the toolbar
   ![alt text](images/installation2.png 'Title')
