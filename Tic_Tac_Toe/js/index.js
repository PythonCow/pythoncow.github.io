var app = new PIXI.Application(window.innerWidth, window.innerHeight, {antialias: true, backgroundColor: 0xFFFFFF});
document.body.appendChild(app.view);

var gameState = [
['','',''],
['','',''],
['','','']
];

var gameDone = false;

var lineWidth = Math.min(window.innerWidth, window.innerHeight)-30;
var lineHeight = lineWidth/20;
var sectionWidth = (lineWidth-(2*lineHeight))/3;
var hcenter = window.innerWidth/2;
var vcenter = window.innerHeight/2;

var playerSymbol;
var computerSymbol;

drawXAnywhere(hcenter/2, vcenter, sectionWidth, lineHeight);
drawCircleAnywhere(hcenter*1.5, vcenter, sectionWidth/2.7, lineHeight);

document.getElementsByTagName("CANVAS")[0].addEventListener("click", setSymbol, false);

function setSymbol(event){
  if (event.pageX < hcenter){
    playerSymbol = "X";
  } else {
    playerSymbol = "O";
  }
  computerSymbol = playerSymbol==="X"?"O":"X";
  document.getElementsByTagName("CANVAS")[0].removeEventListener("click", setSymbol);
  var graphics = new PIXI.Graphics();
  graphics.beginFill(0xFFFFFF);
  graphics.drawRect(0, 0, window.innerWidth, window.innerHeight);
  app.stage.addChild(graphics);
  startGame();
}

var XCoords = [
  hcenter-(sectionWidth+lineHeight),
  hcenter,
  hcenter+(sectionWidth+lineHeight)
];

var YCoords = [
  vcenter-(sectionWidth+lineHeight),
  vcenter,
  vcenter+(sectionWidth+lineHeight)
];


function startGame(){ 
  drawTable();
  if (playerSymbol==="O"){
    playSymbol(0,0,"X");
  }
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
       let sectionX = i;
       let sectionY = j;
      setClickForSquare(i, j, function () {
          if (!gameDone && gameState[sectionY][sectionX]===""){
          playSymbol(sectionX, sectionY, playerSymbol);
          checkForWinner(gameState, playerSymbol, function(sectionX1, sectionY1, sectionX2, sectionY2){
            drawRedLine.apply(null, arguments);      
            gameDone = true;
            setTimeout(function(){location.reload(true);}, 1000);
          });
          if(!gameDone){
            computerTurn();
          }
          checkForWinner(gameState, computerSymbol, function(sectionX1, sectionY1, sectionX2, sectionY2){
            drawRedLine.apply(null, arguments);      
            gameDone = true;
            setTimeout(function(){location.reload(true);}, 1000);
          });
          if (gameState.every(function(row){return row.every(function(item){return item !== "";});})){
            setTimeout(function(){location.reload(true);}, 1000);
          }
        }
      });
    }
  }
}
function drawTable(){
  var graphics = new PIXI.Graphics()

  graphics.beginFill(0x000000);
  graphics.lineStyle(0);

  graphics.drawRoundedRect(
    hcenter-lineWidth/2,
    vcenter-(sectionWidth/2+lineHeight),
    lineWidth,
    lineHeight,
    15
  );

  graphics.drawRoundedRect(
    hcenter-lineWidth/2,
    vcenter+(sectionWidth/2),
    lineWidth,
    lineHeight,
    15
  );

  graphics.drawRoundedRect(
    hcenter-(sectionWidth/2+lineHeight),
    vcenter-lineWidth/2,
    lineHeight,
    lineWidth,
    15
  );

  graphics.drawRoundedRect(
    hcenter+(sectionWidth/2),
    vcenter-lineWidth/2,
    lineHeight,
    lineWidth,
    15
  );

  app.stage.addChild(graphics);
}

function drawXAnywhere(x, y, length, width){
  var graphics1 = new PIXI.Graphics();

  graphics1.beginFill(0x000000);
  graphics1.pivot.x = x;
  graphics1.pivot.y = y;
  graphics1.position.x = x;
  graphics1.position.y = y;
  graphics1.rotation += Math.PI/4;
  graphics1.drawRoundedRect(
    x-length/2,
    y-width/2,
    length,
    width,
    15
  );

  var graphics2 = new PIXI.Graphics();

  graphics2.beginFill(0x000000);
  graphics2.pivot.x = x;
  graphics2.pivot.y = y;
  graphics2.position.x = x;
  graphics2.position.y = y;
  graphics2.rotation -= Math.PI/4;
  graphics2.drawRoundedRect(
    x-length/2,
    y-width/2,
    length,
    width,
    15
  );

  app.stage.addChild(graphics1);
  app.stage.addChild(graphics2);
}

function drawX(sectionX, sectionY, length, width){
  var x = XCoords[sectionX];
  var y = YCoords[sectionY];
  drawXAnywhere(x, y, length, width);
}

function drawCircleAnywhere(x, y , radius, thickness){
  var graphics = new PIXI.Graphics();

  graphics.beginFill(0xFFFFFF);
  graphics.lineStyle(thickness, 0x000000);
  graphics.drawCircle(x,y,radius);

  app.stage.addChild(graphics);
}

function drawCircle(sectionX, sectionY, radius, thickness){
  var x = XCoords[sectionX];
  var y = YCoords[sectionY];
  drawCircleAnywhere(x, y, radius, thickness);
}

function playSymbol(sectionX, sectionY, symbol){
  if (symbol === "X"){
    drawX(sectionX, sectionY, sectionWidth, lineHeight);
  } else {
    drawCircle(sectionX, sectionY, sectionWidth/2.7, lineHeight);
  }
  gameState[sectionY][sectionX]=symbol;
}

function drawRedLine(sectionX1, sectionY1, sectionX2, sectionY2){
  var x1 = XCoords[sectionX1];
  var y1 = YCoords[sectionY1];
  var x2 = XCoords[sectionX2];
  var y2 = YCoords[sectionY2];
  
  
  
  var graphics = new PIXI.Graphics();
  
  graphics.beginFill(0xFF0000);
  graphics.drawCircle(x1, y1, lineHeight/4);
  graphics.drawCircle(x2, y2, lineHeight/4);
  
  graphics.lineStyle(lineHeight/2, 0xFF0000);
  graphics.moveTo(x1, y1);
  graphics.lineTo(x2, y2);
  
  app.stage.addChild(graphics);
}

function setClickForSquare(sectionX, sectionY, callback){
  var x = XCoords[sectionX]-sectionWidth/2;
  var y = YCoords[sectionY]-sectionWidth/2;
  
  document.getElementsByTagName("CANVAS")[0].addEventListener("click", function(e){
    if (e.pageX >= x && e.pageY >= y && e.pageX <= x+sectionWidth && e.pageY <= y+sectionWidth && gameState[sectionY][sectionX]===''){
      callback();    
    }
  }, false);
}

function computerTurn(){
  var scores = evaluateOptions(gameState, computerSymbol, computerSymbol);
  var max = Math.max.apply(null, scores);
  var scoresIndex = 0;
  for (var row = 0; row < gameState.length; row++){
    for (var col = 0; col < gameState[row].length; col++){
      if (gameState[row][col]===""){
        if (scores[scoresIndex]===max){
          playSymbol(col, row, computerSymbol);
          return;
        }
        scoresIndex++;
      }
    }
  }
}

function evaluateOptions(game, symbol, playingSymbol){
  if (checkForWinner(game, symbol)){
    return [10];
  }
  if (checkForWinner(game, symbol==="O"?"X":"O")){
    return [-10];  
  }
  if (game.every(function(row){return row.every(function(item){return item !=="";});})){
    return [0];
  }
  var rtnArr = [];
  for (var row = 0; row < game.length; row++){
    for (var col = 0; col < game[row].length; col++){
      var possibility = game.map(function(item){return item.slice();});
      if (possibility[row][col]===""){
        possibility[row][col]=playingSymbol;
        var scores = evaluateOptions(possibility, symbol, playingSymbol==="O"?"X":"O");
        if (symbol !== playingSymbol){
          rtnArr.push(Math.max.apply(null, scores));
        } else {
          rtnArr.push(Math.min.apply(null, scores)); 
        }
      }
    }  
  }
  return rtnArr;
}

function checkForWinner(game, symbol, callback=function(){return;}){
  for(var i = 0; i < game.length; i++){
    if (game[i].every(function(item){return item === symbol;})){
    	  callback(0, i, 2, i);
        return true;
      } 
  }
  
  for (var i = 0; i < game.length; i++){
    if (game[0][i]===symbol && game[1][i]===symbol && game[2][i]===symbol){
    	callback(i, 0, i, 2);
      return true;
    }
  }
  
  if (game[0][0]===symbol && game[1][1]===symbol && game[2][2]===symbol
  ){
  	 callback(0, 0, 2, 2);  
    return true;
  }
  
  if (game[0][2]===symbol && game[1][1]===symbol && game[2][0]===symbol){
  	 callback(0, 2, 2, 0);  
    return true;
  }
}