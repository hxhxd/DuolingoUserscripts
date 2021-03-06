// ==UserScript==
// @name         Vocabulary Viewer
// @namespace    https://github.com/x-inkfish-x/
// @version      0.1.17
// @description  A Duolinge userscript that adds a skill strength indicator
// @author       Legato né Mikael
// @match        https://www.duolingo.com/

// @grant        GM_addStyle

// @downloadURL  https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/VocabularyViewer.user.js
// @updateURL    https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/VocabularyViewer.user.js

// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://raw.githubusercontent.com/x-inkfish-x/DuolingoUserscripts/master/DuolingoHelper2.0.js

// ==/UserScript==

// ---------------------------------------------------------------------------------------------------------

var helper = new DuolingoHelper({
    onPageUpdate: function (mutations) {
        helper.requestVocabulary({
            success: addVocabulary
        });
    }
});

var css = `
.vocabulary-viewer{
    
}

.vocabulary-viewer .container{
    height: 50em;
    overflow-y: auto;
}

.vocabulary-viewer table{
    width: 100%;
}

.vocabulary-viewer a{
    color: #534;
}

.vocabulary-viewer a:visited{
    color: #534;
}

.vocabulary-viewer tr .word{
    min-width: 12em;
}

.vocabulary-viewer tr{
    display: block;
    border-radius: 2em;
    background-color: #dddddd;
}

.vocabulary-viewer tr:nth-child(odd){
    background-color: #cccccc;
}
`;

var vocabTable;
var title;
// ---------------------------------------------------------------------------------------------------------

function makeVocabEntry(vocab, v) {
    var vocabField = $('<td class="word"><a href="/dictionary/{lang}/{normstr}/{id}" target="_blank">{str}</a></td>'
        .format({
            lang: vocab.language_string,
            normstr: v.normalized_string,
            id: v.lexeme_id,
            str: v.word_string
        }));

    var strengthField = $('<td class="strength">{strength}%</td>'.format({
        strength: Math.round(v.strength * 100)
    }));

    return $('<tr></tr>').append(vocabField).append(strengthField);
}

// ---------------------------------------------------------------------------------------------------------

var timeoutHandle;

function addVocabularyEntry(vocab, i) {
    if (i < vocab.vocab_overview.length) {
        var line = makeVocabEntry(vocab, vocab.vocab_overview[i]);
        line.hide();
        $(vocabTable).append(line);
        line.fadeIn(400);
        timeoutHandle = setTimeout(function () {
            addVocabularyEntry(vocab, i + 1);
        }, 1);
    }
}

// ---------------------------------------------------------------------------------------------------------

function abortTimeout() {
    clearTimeout(timeoutHandle);
}

// ---------------------------------------------------------------------------------------------------------
var previousVocab;

function addVocabulary(vocab) {
    if (vocab && (!previousVocab ||
            vocab.from_language != previousVocab.from_language &&
            vocab.learning_language != previousVocab.learning_language ||
            vocab.vocab_overview.length != previousVocab.vocab_overview.length)) {
        previousVocab = vocab;

        if ($("#vocab-table").length == 0) {

            vocabTable = $('<table id="vocab-table"></table>');
            title = $('<h2></h2>');
            var tableContainer = $('<div class="container"></div>').append(vocabTable);
            var vocabContainer = $('<div class="_2SCNP _1E3L7 vocabulary-viewer"></div>').append(title).append(tableContainer);

            $("div._2_lzu div._21w25").after(vocabContainer);
        }

        $(title).text('Loading...');

        vocabTable.empty();

        vocab.vocab_overview.sort(function (left, right) {
            if (left.strength > right.strength) {
                return 1;
            }
            if (left.strength < right.strength) {
                return -1;
            }

            return 0;
        });

        $(title).text('Vocab - {vocabCount} words learned'.format({
            vocabCount: vocab.vocab_overview.length
        }));
        abortTimeout();
        addVocabularyEntry(vocab, 0);
    }
}

// ---------------------------------------------------------------------------------------------------------

$(function () {
    GM_addStyle(css);
    helper.requestVocabulary({
        success: addVocabulary
    });
});

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------