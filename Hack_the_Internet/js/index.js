
function printToDiv(id, string, lineEnd="<br>"){
  var divHeight = document.getElementById(id).clientHeight;
  var divWidth = document.getElementById(id).clientWidth;
  

  document.getElementById(id+"-text").innerHTML += string+lineEnd;
  var textHeight = document.getElementById(id+"-text").clientHeight;
  while(textHeight > divHeight){
  	 var innerText = document.getElementById(id+"-text").innerHTML;
    lines = innerText.split("<br>")
    lines.shift();
    document.getElementById(id+"-text").innerHTML = lines.reduce(function(prev, next){return prev+"<br>"+next;});
    textHeight = document.getElementById(id+"-text").clientHeight;
  }  
}

function numberStream(){
  numbers = [];
  for (var i = 0; i < 12; i++){
    numbers.push(zeroFill((Math.floor(Math.random()*99999)).toString(), 5))  
  }
  printToDiv("number-stream", numbers.join(" "))
}

function printCode(){
  var xmlhttp = new XMLHttpRequest();
  
  xmlhttp.onreadystatechange = function (){
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
      codeCount = 0;
      setInterval(function(){
        var nextChar = xmlhttp.responseText[codeCount++];
        if (nextChar == "\n"){
          printToDiv("code", "<br>", "");        
        }
        else {
          printToDiv("code", nextChar, "");
        }
        if (codeCount == xmlhttp.responseText.length){
          codeCount = 0;        
        }
      },
      25);
    }
    else if (xmlhttp.status == 400){
    	console.log("Unable to fetch https://raw.githubusercontent.com/torvalds/linux/master/fs/ext4/dir.c.")
    }
  }
  
  xmlhttp.open("GET", "https://raw.githubusercontent.com/torvalds/linux/master/fs/ext4/dir.c", true);
  xmlhttp.send();  
}

var placesToHack = [
"NSA",
"Google",
"Anonymous",
"your mom",
"Illuminati",
"Rancheritos",
"FBI",
"Eiffel Tower",
"Minecraft",
"Info Wars",
"CNN",
"CIA",
"FDA",
"Canada",
"Black Lives Matter",
"The Election",
"DNC",
"DMV",
"Statue of Liberty",
"White House",
"Donald Trump's mind",
"Power Grid",
"NYPD",
"Russia",
"North Korea",
"Nintendo",
"Microsoft",
"fake news",
"Facebook",
"the Internet",
"the laws of physics",
"the timeline",
"the frogs to turn them gay"
];

var hackingActions = [
"Decrypting ",
"Injecting ",
"Infiltrating ",
"Allocating ",
"Targeting ",
"Detecting ",
"Refreshing ",
"Executing ",
"Parsing ",
"Compromising ",
"Encoding "
];

var hackingNouns = [
"the kilobytes...",
"the firewall...",
"the network...",
"the viruses...",
"the mainframe...",
"the grid...",
"the IP addresses...",
"the code...",
"the SQL...",
"the Bitcoins...",
"the files...",
"the security measures...",
"the database...",
"the program...",
"the sequence..."
];

function notifications(){
  scrambledPlacesToHack = scramble(placesToHack);
  notifsCount = 0;
  setInterval(function(){
    printToDiv("notifs", "Hacking "+scrambledPlacesToHack[notifsCount]+"...");
    setTimeout(function(){
      var randint = Math.floor(Math.random()*hackingActions.length);
      var randint2 = Math.floor(Math.random()*hackingNouns.length);
      printToDiv("notifs", hackingActions[randint]+hackingNouns[randint2]); 
    },
    2500)
    setTimeout(function(){
      printToDiv("notifs", "Hacking completed...");
    },
    5000)
    if(notifsCount == placesToHack.length){
      scrambledPlacesToHack = scramble(placesToHack);
      notifsCount = 0;
    } else {
      notifsCount++;
    }
  },
  6000);
}

function scramble(array){
  var arrayCopy = array.slice();
  var returnArray = [];
  while (arrayCopy.length != 0){
    var randint = Math.floor(Math.random()*arrayCopy.length);
    returnArray.push(arrayCopy[randint]);
    arrayCopy.splice(randint, 1);  
  }
  return returnArray;
}

function zeroFill(string, length){
  array = string.split("");
  while(array.length < length){
    array.unshift("0");  
  }
  return array.join("");
}

function playAudio(){
  hackingMusic = new Audio("https://upload.wikimedia.org/wikipedia/commons/7/7c/Free_Bee_by_Dynabee.ogg");
  hackingMusic.loop = true;
  hackingMusic.play();
}

setInterval(numberStream, 100);
printCode();
notifications();
playAudio();
