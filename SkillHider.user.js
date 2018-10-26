// ==UserScript==
// @name         Skill Hider Beta
// @namespace    https://github.com/x-inkfish-x/
// @version      1.0.0
// @description  A Duolinge userscript that hides skills exceeding a strength treshold
// @author       Legato né Mikael
// @match        https://www.duolingo.com/*
// @run-at       document-start

// @downloadURL  https://github.com/x-inkfish-x/DuolingoUserscripts/raw/beta/SkillHider.user.js
// @updateURL    https://github.com/x-inkfish-x/DuolingoUserscripts/raw/beta/SkillHider.user.js

// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Beta/DuolingoHelper2.0.js

// ==/UserScript==

// ---------------------------------------------------------------------------------------------------------

// var helper = new DuolingoHelper({
//     onCaughtUserId: ,
//     onPageUpdate:
// });

var hiderId = 'skill-hider';

$(function () {
    if ($('div#' + hiderId).length == 0) {
        $('div.mAsUf').prepend(
            '<span class="_1JSCL _1uSF_ cCL9P" id="{0}"></span><span>Hide</span>'.format(hiderId));
    }
});

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------