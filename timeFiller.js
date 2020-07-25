var issueKeyToSelect = null;

const observeDOM = (function(){
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  
    return function( obj, callback ){
      if( !obj || obj.nodeType !== 1 ) return; // validation
  
      if( MutationObserver ){
        // define a new observer
        const obs = new MutationObserver(function(mutations, observer){
            callback(mutations);
        })
        // have the observer observe foo for changes in children
        obs.observe( obj, { childList:true, subtree:true });
      }
      
      else if( window.addEventListener ){
        obj.addEventListener('DOMNodeInserted', callback, false);
      }
    }
})();

const tempoContainer = document.getElementById('tempo-container');
if (tempoContainer != null) {
    observeDOM(tempoContainer, function(m){ 
        m.forEach(record => {
            record.addedNodes.forEach(addedNode => checkForLogTimeModal(addedNode) || selectFavIssue(addedNode));
        });
     });
}

function checkForLogTimeModal(addedNode) {
    const issueInput = addedNode.querySelector && addedNode.querySelector('#form-issue-input');
    if (issueInput == null) return false;

    const modalDialog = issueInput.closest('div[role="dialog"]'); // Get the nearest ancestor "dialog" container.
    if (modalDialog == null) return false;

    const header = modalDialog.querySelector('header > h2');
    if (header == null || header.innerText.indexOf("Log Time") < 0) {
      console.log(`Modal dialog found, but header was "${header == null ? null : header.innerText}".`)
      return false;
    }

    console.log(`"Log Time" modal dialog found.`);

    // Increase the dialog width:
    const section = issueInput.closest('section');
    section.style.minWidth = '750px';

    // Copy styling from the "Cancel" button to the "Fav" and "Fill" buttons...
    const templateButton = modalDialog.querySelector('button[data-testid="cancelLogTime"]');
    addFavIssueButton(issueInput, templateButton);
    addFillDurationButton(modalDialog, templateButton);

    return true;
}

function selectFavIssue(addedNode) {
  if (!issueKeyToSelect) return false;

  const selection = addedNode.querySelector && addedNode.querySelector(`div[data-testid="issue_${issueKeyToSelect}"]`);
  if (!selection || !selection.closest('#issueSearchResults')) return; // The issue key being searched was not found in the search-results list.

  selection.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));

  console.log(`Filled fav issue: ${issueKeyToSelect}`);
  issueKeyToSelect = null;
}

function addFavIssueButton(issueInput, templateButton) {
  const favButton = document.createElement("button");
  const favIcon = document.createElement("img");
  favIcon.src = chrome.runtime.getURL('images/heart.png');
  favIcon.width = 26;
  favButton.appendChild(favIcon);
  favButton.title = "Fav issue";
  favButton.onclick = function() {
    try {
      onFavIssueClicked(issueInput);
    } catch(error) {
      console.log(error); // Suppress any error.
    }
    return false; // Signal that the click event is handled, so the button won't refresh the page (i.e. following the undefined 'href' link).
  };

  const issueInputDiv = issueInput.parentElement;
  issueInputDiv.style.width = '688px';

  const iconContainer = issueInputDiv.parentElement;
  iconContainer.appendChild(favButton);

  // Copy styling from the template button to the "Fav" button...
  favButton.setAttribute('class', templateButton.getAttribute('class'));
  favIcon.setAttribute('class', templateButton.querySelector('span').getAttribute('class'));
  // Adjust margin so that the "Fill" button sits directly adjacent to the issue input field...
  favButton.style.marginTop = '-5px';
  favButton.style.marginLeft = '0px';
}

function onFavIssueClicked(issueInput) {
  if (issueInput.value) {
    // An issue has been selected in the dialog, so update the stored favourite:
    const newFavIssue = issueInput.value;
    chrome.storage.sync.set({favIssue: newFavIssue}, function() {
      showSnackbarNotification(issueInput, `Fav issue set to "${newFavIssue}".`)
    });
  } else {
    // No issue has been selected in the dialog, so try to set the input field from the stored favourite:
    chrome.storage.sync.get('favIssue', function(data) {
      if (data.favIssue) {
        // Set the issue input field value:
        issueInput.value = data.favIssue;
        issueInput.dispatchEvent(new window.KeyboardEvent('change', { bubbles: true }));
        
        issueKeyToSelect = data.favIssue.split(' ', 1)[0];
        console.log(`Finding fav issue: ${data.favIssue}…`);
      } else {
        showSnackbarNotification(issueInput, 'No fav issue found in browser storage.');
      }
    });
  }
}

function showSnackbarNotification(issueInput, message) {
  console.log(message);
  addSnackbarStyle();
  const container = issueInput.parentElement.parentElement;
  const messageDiv = document.createElement('div');
  messageDiv.id = 'snackbar';
  messageDiv.setAttribute('class', 'show');
  messageDiv.innerText = message;
  container.appendChild(messageDiv);
  // After 3 seconds, remove the message:
  setTimeout(function(){ container.removeChild(messageDiv); }, 3000);
}

function addSnackbarStyle() {
  if (document.querySelector('#snackbarStyle')) return; // Style already exists.

  const style = document.createElement('style');
  style.id = 'snackbarStyle';
  style.innerHTML = `#snackbar { visibility: hidden; color: #fff; background-color: #333; border-radius: 2px; padding: 8px; }
    #snackbar.show { visibility: visible; -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s; animation: fadein 0.5s, fadeout 0.5s 2.5s; }
    @-webkit-keyframes fadein { from {bottom: 0; opacity: 0;} to {bottom: 30px; opacity: 1;} }
    @keyframes fadein { from {bottom: 0; opacity: 0;} to {bottom: 30px; opacity: 1;} }
    @-webkit-keyframes fadeout { from {bottom: 30px; opacity: 1;} to {bottom: 0; opacity: 0;} }
    @keyframes fadeout { from {bottom: 30px; opacity: 1;} to {bottom: 0; opacity: 0;} }`;
  const firstScript = document.querySelector('script');
  firstScript.parentNode.insertBefore(style, firstScript);
}

function addFillDurationButton(modalDialog, templateButton) {
  const durationField = modalDialog.querySelector('#durationField');
  const durationDiv = durationField.parentElement.parentElement;
  
  // Add "Fill" button...
  const fillButton = document.createElement("button");
  const fillIcon = document.createElement("img");
  fillIcon.src = chrome.runtime.getURL('images/paint-bucket.png');
  fillIcon.width = 26;
  fillButton.appendChild(fillIcon);
  fillButton.title = "Fill duration";
  fillButton.onclick = function() { 
    try {
      onFillClicked(modalDialog, durationField);
    } catch(error) {
      console.log(error); // Suppress any error.
    }
    return false; // Signal that the click event is handled, so the button won't refresh the page (i.e. following the undefined 'href' link).
  };
  durationDiv.appendChild(fillButton);

  // Copy styling from the template button to the "Fill" button...
  fillButton.setAttribute('class', templateButton.getAttribute('class'));
  fillIcon.setAttribute('class', templateButton.querySelector('span').getAttribute('class'));
  // Adjust margin so that the "Fill" button sits directly adjacent to the duration field...
  fillButton.style.marginTop = '-5px';
  fillButton.style.marginLeft = '0px';
}

function onFillClicked(modalDialog, durationField) {
  // Get the date for which time is to be logged:
  const startedField = modalDialog.querySelector('#startedField');
  const currentDay = new Date(startedField.value);
  const threeLetterWeekday = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(currentDay);
  const twoDigitDay = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(currentDay);
  const twoDigitMonth = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(currentDay);
  const currentDayTitle = `${threeLetterWeekday} ${twoDigitDay}.${twoDigitMonth}`;
  console.log(`Filling minutes for workday: ${currentDayTitle}`);

  // Get the number of minutes already logged and the target total minutes for the current date:
  const dayHeaders = tempoContainer.querySelector('#calendarCanvasHeader');
  const currentDayHeader = Array.from(dayHeaders.querySelectorAll('div[name="calendarCanvasDayHeader"]>h3'))
    .find(day => day.querySelector('span').title == currentDayTitle);
    const tallyHeader = Array.from(currentDayHeader.querySelectorAll('span')).find(span => span.title.indexOf(' of ') > 0);
  console.log(`Initially tally: ${tallyHeader.title}`);
  const parts = tallyHeader.title.split(' of ', 2);
  const alreadyLoggedMinutes = getMinutesFromTimeSpanHeader(parts[0]);
  const totalTargetMinutes = getMinutesFromTimeSpanHeader(parts[1]);

  const remainderMinutes = totalTargetMinutes - alreadyLoggedMinutes;

  // Set the duration field value:
  durationField.focus();
  durationField.value = `${remainderMinutes}m`;
  durationField.dispatchEvent(new window.KeyboardEvent('change', { bubbles: true }));
  console.log(`Filled duration: ${durationField.value}`);

  modalDialog.focus();
}

// Converts string containing hours and/or minutes (e.g. "7h 36m" or "6m" or "2h") into a numeric total minutes value.
function getMinutesFromTimeSpanHeader(timeSpanHeader) {
  const regex = /((?<hours>\d+)h)?(\s)?((?<minutes>\d+)m)?/;
  const match = timeSpanHeader.match(regex);
  const hours = match.groups.hours ? Number(match.groups.hours) : 0;
  const minutes = match.groups.minutes ? Number(match.groups.minutes) : 0;
  return hours * 60 + minutes;
}