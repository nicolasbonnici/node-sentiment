/*
 * If you want run tests please install the test framework Mocha (https://mochajs.org).
 * Then type the command on the parent folder: mocha test
 */

// Require assert mocha
var assert = require('assert');

// Require the sentiment module
var sentiment = require('../index');

var sTextEn = 'Seems somebody had a good meal! @wildelifeanimal #lion #safari #cats #wildlife #Africa #adventure #offroad https://t.co/6cX7hAlrYY',
  sTextFr = 'Tout le monde a bien manger! @wildelifeanimal #lion #safari #felins #viesauvage #Afrique #aventure #touterrain https://t.co/6cX7hAlrYY';

describe('Analyse in english', function () {
  it('It should return positive or negative', function () {
    assert.equal(sentiment('Cats are stupid.', 'en').vote, 'negative', 'Negative detection in english');
    assert.equal(sentiment('Cats are totally amazing!', 'en').vote, 'positive', 'Positive detection in english');
  });
});

describe('Analyse in french', function () {
  it('It should return positive or negative', function () {
    assert.equal(sentiment('Les chats sont stupides.', 'fr').vote, 'negative', 'Negative detection in french');
    assert.equal(sentiment('J\'aime bien les chats!', 'fr').vote, 'positive', 'Positive detection in french');
  });
});

describe('Wrong input language', function () {
  it('It should return positive or neutral', function () {
    assert.equal(sentiment(sTextEn, 'en').vote, 'positive', 'Good language with positive vote');
    assert.equal(sentiment(sTextEn, 'fr').vote, 'neutral', 'Wrong language result is neutral vote');
    assert.equal(sentiment(sTextEn, 'xxx').vote, 'neutral', 'Not existing language result is neutral vote');
  });
});

describe('Negation', function () {
  it('check negation detection', function () {
    var oPositiveResponseFr = sentiment('j\'aime beaucoup ce morceau', 'fr'),
      oNegativeResponseFr = sentiment('C\'est de la merde ce morceau', 'fr'),
      oPositiveResponseEn = sentiment('Cats are so cool!', 'en'),
      oNegativeResponseEn = sentiment('Cats are not so cool!', 'en');

    assert.equal(oPositiveResponseFr.vote, 'positive', 'Positive vote in French');
    assert.equal(oNegativeResponseFr.vote, 'negative', 'Negation detection in French');
    assert.equal(oPositiveResponseEn.vote, 'positive', 'Positive vote in English');
    assert.equal(oNegativeResponseEn.vote, 'negative', 'Negation detection in English');
  });
});

describe('Language detection in english', function () {
  it('It should guess english language and return a positive vote', function () {
    var oResponse = sentiment(sTextEn);
    assert.equal(oResponse.vote, 'positive', 'Must detect english positive message');
    assert.equal(oResponse.language, 'en', 'Unable to detect english language');
  });
});

describe('Language detection in french', function () {
  it('It should guess french language and return a positive vote', function () {
    var oResponse = sentiment(sTextFr);
    assert.equal(oResponse.vote, 'positive', 'Must detect french positive message');
    assert.equal(oResponse.language, 'fr', 'Unable to detect french language');
  });
});

describe('Emoji support', function () {
  it('It should return positive or negative in any language or without', function () {
    assert.equal(sentiment('♥', 'en').vote, 'positive');
    assert.equal(sentiment('♥', 'fr').vote, 'positive');
    assert.equal(sentiment('😭', 'en').vote, 'negative');
    assert.equal(sentiment('😭', 'fr').vote, 'negative');
    assert.equal(sentiment('♥').vote, 'positive');
    assert.equal(sentiment('😭').vote, 'negative');
  });
});

describe('Test tokenize() method integration', function () {

  it('It should output an empty array with an empty input', function () {

    assert.equal(
      sentiment('', 'en').tokens.length,
      0,
      'Tokenize must return zero chunk'
    );

  });

  it('It should correctly explode this string in 7 chunks even with \\n.', function () {

    assert.equal(
      sentiment("C'est super de faire des retour chariots!", 'en').tokens.length,
      7,
      'Tokenize must return 7 chunks even with a new line'
    );


    assert.equal(
      sentiment("C'est super de faire des \n retour chariots!", 'en').tokens.length,
      7,
      'Tokenize must return 7 chunks even with a new line'
    );

  });

});
