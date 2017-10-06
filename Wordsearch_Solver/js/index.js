var linesToDraw = [];
var tessData;
var inputImage;

$(document).ready(function () {
  if (document.forms['image-form']['file'].files[0].name){
    $('#upload-file-info').html(document.forms['image-form']['file'].files[0].name);
  }
});

window.onresize = function () {
  drawLines();
};

function readText (callback) {
  //Show text from image in form. Mostly just to test tesseract library.
  var image = document.forms['image-form']['file'].files[0];
  Tesseract.recognize(image,
  {
    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    textord_tabfind_show_blocks: true
  })
  .then(function (result) {
    callback(result);
  })
  .catch(function (error) {
    throw error;
  });

}

function findWords () {
  linesToDraw = [];
  var words = $('#words').val()
    //Remove spaces.
    .replace(/ /g, '')
    .toUpperCase()
    .split('\n')
    //Remove empty strings from list.
    .filter(function (item) {return item});
  readText(function (result) {
    tessData = result;

    var reader = new FileReader();

    reader.onload = function () {
      inputImage = reader.result;
      var searchResults = $('#search-results')[0];
      searchResults.src = inputImage;

      for (var i = 0; i < words.length; i++) {
        var wordIndices = findWord(words[i], result.text.replace(/ /g, '').toUpperCase().split('\n'));
        if (wordIndices.length === 0) {continue;}
        linesToDraw.push(wordIndices);
      }
      drawLines();
    };

    reader.readAsDataURL(document.forms['image-form']['file'].files[0]);
  });
}

function drawLines () {
  d3.select('#image-overlay').selectAll('*').remove();
  var searchResults = $('#search-results')[0];
  d3.select('#image-overlay').attr('height', searchResults.height);
  for (var i = 0; i < linesToDraw.length; i++) {
    var wordIndices = linesToDraw[i];
    var scale = searchResults.width / getSize(inputImage).width;
    var startBbox = tessData.symbols[wordIndices[0].startChar].bbox;
    var endBbox = tessData.symbols[wordIndices[0].endChar].bbox;
    var x1 = (startBbox.x0 + startBbox.x1) / 2;
    var y1 = (startBbox.y0 + startBbox.y1) / 2;
    var x2 = (endBbox.x0 + endBbox.x1) / 2;
    var y2 = (endBbox.y0 + endBbox.y1) / 2;
    drawLine(x1 * scale, y1 * scale , x2 * scale, y2 * scale, 20 * scale);
  }
}

function getSize (image) {
  var unscaledImage = new Image();
  unscaledImage.src = image;
  return {
    width: unscaledImage.width,
    height: unscaledImage.height
  };
}

function drawLine (x1, y1, x2, y2, width) {
  d3.select("#image-overlay").append('line')
    .attr('x1', x1)
    .attr('y1', y1)
    .attr('x2', x2)
    .attr('y2', y2)
    .attr('stroke-width', width)
    .attr('stroke-linecap', 'round');
}

function resetOverlay () {
  d3.select('#image-overlay').selectAll('*').remove();
}

function findWord (word, wordSearch) {
  var occurences = [];
  for (var row = 0; row < wordSearch.length; row++){
    for (var col = 0; col < wordSearch[row].length; col++){

      for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
          if (!(i ==  0 && j == 0)){
            var result = stringInDirection(wordSearch, word.length, row, col, i, j);
            if (result == word) {
              occurences.push({
                startRow: row,
                startCol: col,
                endRow: row + ((word.length - 1) * j),
                endCol: col + ((word.length - 1) * i)
              });
            }
          }
        }
      }

    }
  }

  return occurences.map(function (item) {
    return {
      startChar: item.startRow * wordSearch[0].length + item.startCol,
      endChar: item.endRow * wordSearch[0].length + item.endCol
    };
  });
}

//Returns string in a certain direction from the given row and column.
//Takes the word search as an array of strings,
//the length the return string should be,
//the row and column to search from,
//and the horizontalDirection and verticalDirection.
//It's hard to explain the direction arguments without examples, so I'll show you what different pairs would represent.
//1 0 To the right.
//-1 0 To the left.
//0 1 Down.
//1 1 Down and to the right.
function stringInDirection (wordSearch, length, row, col, horizontalDirection, verticalDirection) {
  var charsInDirection = [];

  for (var i = 0; i < length; i++) {
    var currentRow = row + i * verticalDirection;
    var currentColumn = col + i * horizontalDirection;
    if (currentRow < 0 || currentRow >= wordSearch.length || currentColumn < 0 || currentColumn >= wordSearch[row].length){
      break;
    }
    charsInDirection.push(wordSearch[currentRow][currentColumn]);
  }

  return charsInDirection.join('');
}
