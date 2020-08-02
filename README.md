# chrome-tempofila
Unofficial Chrome extension for Tempo Timesheets (Jira app) to fill-in remaining minutes of your workday with a time entry for your fav project.

## Overview
Tempofila makes it easier to log time in Tempo by:
1. Auto-filling the Duration field, depending on the amount of time that you have left to log in the current workday,
2. Auto-filling your favourite issue in the "Search issues" field, and
3. Increasing the "Log Time" screen width, so that you have more room to enter a meaningful Description for each time entry.

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
1. Select an issue in the "Search issues" field.
1. Press the "Fav issue" button (heart icon).
1. Tempofila will save the selected issue as your favourite.
1. Next time you open the Log Time screen, press the "Fav issue" button to auto-fill the "Search issues" field with your saved fav.

## Store listing description
Tempofila makes it easier to log time in Tempo by:
1. Auto-filling the Duration field, depending on the amount of time that you have left to log in the current workday,
2. Auto-filling your favourite issue in the "Search issues" field, and
3. Increasing the "Log Time" screen width, so that you have more room to enter a meaningful Description for each time entry.

Usage:
1. Navigate to the Tempo page in Jira:  https://{your-organisation}.atlassian.net/plugins/servlet/ac/io.tempo.jira/tempo-app#!
2. In the Calendar List view, hover over the `+` button (for a day of the week) and press Log Time.
3. In the Log Time screen, press the "Fill duration" button (paint bucket icon). 
4. Tempofila will set the duration field value to the number of minutes remaining to be logged for your current workday.
5. Select an issue in the "Search issues" field.
6. Press the "Fav issue" button (heart icon).
7. Tempofila will save the selected issue as your favourite.
8. Next time you open the Log Time screen, press the "Fav issue" button to auto-fill the "Search issues" field with your saved fav.

## Privacy

### Single purpose
Tempofila auto-fills the "Duration" and "Issue" fields in the Tempo "Log Time" screen.

### Storage
Tempofila can save your favourite issue by keeping it in browser storage.

### Host permission
Tempofila works on the Tempo app for Jira cloud: https://app.tempo.io/*

Tempofila does not transmit any of your private data.

Tempofila does not submit any time entries on your behalf - this extension only fills-in the on-screen fields, allowing you to review the filled values before you press the "Log time" button. 