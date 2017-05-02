WebFont.load({
  google: {
    families: ['VT323']
  }
});

var app = new PIXI.Application(800, 600, {backgroundColor: 0x87CEEB});
document.body.appendChild(app.view);

var githubAddr = "https://raw.githubusercontent.com/PythonCow/Codepen-assets/master/assets/";

var playbutton = PIXI.Sprite.fromImage(githubAddr+"playbutton.png");

var groundSprites = [];
for (var i = 0; i <= (Math.floor(app.renderer.width/64))+2; i++){
  var newGroundSprite = PIXI.Sprite.fromImage(githubAddr+"ground.png");
  newGroundSprite.y = app.renderer.height-64;
  newGroundSprite.x = i*64;
  app.stage.addChild(newGroundSprite);
  groundSprites.push(newGroundSprite);
}

var obstacles = [];

var obstacle = PIXI.Sprite.fromImage(githubAddr+"crate.png");
obstacle.x = app.renderer.width+1024;
obstacle.y = app.renderer.height-96;
app.stage.addChild(obstacle);
obstacles.push(obstacle);

for (var i = 1; i < 5; i++){
  obstacle = PIXI.Sprite.fromImage(githubAddr+"crate.png");
  obstacle.x = (obstacles[i-1].x)+Math.floor((Math.random()*500)+200);
  obstacle.y = app.renderer.height-96;
  app.stage.addChild(obstacle);
  obstacles.push(obstacle);
}

var doggoImages = ["0.png", "1.png", "2.png", "3.png"].map(val => githubAddr+"doggo"+val);
var textures = [];
doggoImages.forEach(image => {
  let texture = PIXI.Texture.fromImage(image);
  textures.push(texture);
});

var doggo = new PIXI.extras.AnimatedSprite(textures);

doggo.x = 0;
doggo.y = app.renderer.height-128;
doggo.height = 64;
doggo.width = 64;
doggo.animationSpeed = 0.2;
doggo.texture = textures[1];

app.stage.addChild(doggo);

$(document).keydown(function(event){
  if (event.keyCode===32){
    spaceKey();
  }
});

var jumping = false;
var up = false;

var jumpTicker = new PIXI.ticker.Ticker();
jumpTicker.add(function(delta){
  if (up){
    if(doggo.y <= app.renderer.height-(134+96)){
      up = false;
      doggo.y += 5*delta;
    } else {
      doggo.y -= 5*delta;
    }
  } else {
    if (doggo.y >= app.renderer.height-128){
      doggo.y = app.renderer.height-128;
      doggo.play();
      jumping = false;
      jumpTicker.stop();
    } else if((doggo.y+10*delta) >= app.renderer.height-128){
      doggo.y += app.renderer.height-doggo.y;
    }else{
      doggo.y += 5*delta;
    }
  }
});

function jump(){
  doggo.texture = textures[0];
  doggo.stop();
  jumping = true;
  up = true;
  doggo.y -= 10*crateTicker.deltaTime;
  jumpTicker.start();
}

var score = 100000;

var scoreFont = new PIXI.TextStyle({
  fontFamily: "VT323",
  fontSize: 30
});

var scoreDisplay = new PIXI.Text(score, scoreFont);
scoreDisplay.x = app.renderer.width-scoreDisplay.width-5;
scoreDisplay.y = 5;
app.stage.addChild(scoreDisplay);

var crateTicker = new PIXI.ticker.Ticker();

crateTicker.stop();
crateTicker.add(function(delta){
  speed = Math.floor(score/500);
  doggo.animationSpeed = 0.2+(speed/10);
  scoreDisplay.text = score;
  scoreDisplay.x = app.renderer.width-scoreDisplay.width-5;
  
  obstacles[0].x -= obstacles[0].x>-32 ? (5+speed)*delta: -(Math.max.apply(null, obstacles.map(i => i.x))+Math.floor((Math.random()*500)+250+speed*50));
  for (i = 1; i < obstacles.length; i++){
    obstacles[i].x -= obstacles[i].x>-32 ? (5+speed)*delta: -(Math.max.apply(null, obstacles.map(i => i.x))+Math.floor((Math.random()*500)+250+speed*50));
  }
  
  groundSprites.forEach((sprite, index) =>{

    if (index === 0){
      sprite.x = sprite.x>-64 ? sprite.x-(5+speed)*delta: groundSprites[groundSprites.length-1].x+64-(5+speed)*delta;
    } else {
      sprite.x = sprite.x>-64 ? sprite.x-(5+speed)*delta: groundSprites[index-1].x+64;    
    }
  });
  
  obstacles.forEach(obstacle => {
    if (obstacle.x<64 && doggo.y >= app.renderer.height-(128)){
      pause(reset);
    }
  });
  score++;
});

function enableJump(){
  spaceKey = function(){
    if (!jumping){
      jump();
    }
  }
}

var spaceKey = function(){
  playbutton.click();
}

function pause(func){
  playbutton.anchor.set(0.5)
  playbutton.x = app.renderer.width/2;
  playbutton.y = app.renderer.height/2;
  playbutton.interactive = true;
  app.stage.addChild(playbutton);
  playbutton.click = function(){
    crateTicker.start();
    doggo.play();
    app.stage.removeChild(playbutton);
    func();
    enableJump();
  };
  spaceKey = function(){
    playbutton.click();
  }
  jumpTicker.stop();
  doggo.stop();
  crateTicker.stop();  
}

function reset(){
  enableJump();
  for(var i = 0; i < groundSprites.length; i++){
    groundSprites[i].y = app.renderer.height-64;
    groundSprites[i].x = i*64;
    app.stage.addChild(groundSprites[i]);
  }
  
  doggo.y = app.renderer.height-128;
  jumping = false;
  up = false;
  
  obstacles.forEach((item, index)=>{
    if (index ===0){item.x=app.renderer.width+1024;}
    else {
      item.x = obstacles[index-1].x+Math.floor((Math.random()*500)+200);
    }
  });
  score = 100000;
}

var titleFont = new PIXI.TextStyle({
  fontFamily: "VT323",
  fontSize: 90
});

var title = new PIXI.Text("Doggo Run", titleFont);
title.anchor.set(0.5);
title.x = app.renderer.width/2;
title.y = 64;
app.stage.addChild(title);

var subtitle = new PIXI.Text("Press Space to Start", titleFont);
subtitle.anchor.set(0.5);
subtitle.x = app.renderer.width/2;
subtitle.y = 192;
app.stage.addChild(subtitle);

playbutton.anchor.set(0.5)
playbutton.x = app.renderer.width/2;
playbutton.y = app.renderer.height/2;
playbutton.interactive = true;
app.stage.addChild(playbutton);
playbutton.click = function(){
  crateTicker.start();
  doggo.play();
  app.stage.removeChild(playbutton);
  enableJump();
  app.stage.removeChild(title);
  app.stage.removeChild(subtitle);
};
