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
            record.addedNodes.forEach(addedNode => checkForLogTimeModal(addedNode));
        });
     });
}

function checkForLogTimeModal(addedNode) {
    const modalDialog = addedNode.querySelector && addedNode.querySelector('div[role="dialog"]');
    if (modalDialog == null) return;

    const header = modalDialog.querySelector('header > h2');
    if (header == null || header.innerText.indexOf("Log Time") < 0) {
      console.log(`Modal dialog found, but header was "${header == null ? null : header.innerText}".`)
      return;
    }

    console.log(`"Log Time" modal dialog found.`);

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

    // Copy styling from the "Cancel" button to the "Fill" button...
    const cancelButton = modalDialog.querySelector('button[data-testid="cancelLogTime"]');
    fillButton.setAttribute('class', cancelButton.getAttribute('class'));
    fillIcon.setAttribute('class', cancelButton.querySelector('span').getAttribute('class'));
    // Adjust margin so that the "Fill" button sits directly adjacent to the duration field...
    fillButton.setAttribute('style', 'margin-top: -5px; margin-left: 0px;');
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