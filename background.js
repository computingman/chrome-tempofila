// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757', favProject: 'TEMPO-153'}, function() {
    console.log('Tempofila installed. Default fav project: TEMPO-153');
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'tigerspike.atlassian.net', schemes: ['https'], pathContains: 'tempo-app'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
