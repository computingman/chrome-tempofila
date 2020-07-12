# chrome-tempofila
Unofficial Chrome extension for Tempo Timesheets (Jira app) to fill-in remaining minutes of your workday with a time entry for your fav project.

## Getting started with Chrome extension development
See [Getting Started Tutorial](https://developer.chrome.com/extensions/getstarted) in Google Chrome docs.

### Loading extension into Chrome
After cloning this repository to your local computer...
1. Open the Extension Management page by navigating to `chrome://extensions`.
   - The Extension Management page can also be opened by clicking on the Chrome menu, hovering over **More Tools** then selecting **Extensions**.
1. Enable **Developer Mode** by clicking the toggle switch next to Developer mode.
1. Click the **LOAD UNPACKED** button and select the extension directory.

   ![Load extension](https://developer.chrome.com/static/images/get_started/load_extension.png)

## Usage
1. Navigate to the Tempo page in Jira.
   - [https://{your-organisation}.atlassian.net/plugins/servlet/ac/io.tempo.jira/tempo-app#!](https://{organisation}.atlassian.net/plugins/servlet/ac/io.tempo.jira/tempo-app#!)
1. In the **Calendar** List view, hover over the **`+`** button (for a day of the week) and press **Log Time**.
1. In the **Log Time** screen, press the "Fill duration" button. This will set the duration field value to the number of minutes remaining to be logged for the current workday.

   ![Fill duration (paint-bucket icon)](images/paint-bucket.png)
