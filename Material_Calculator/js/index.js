var stringToEvaluate = "";

$(document).ready(function(){
  for (var i = 0; i <= 9; i++){
    $("#"+i).click(function(event){
      $("#calculator-text").append(event.target.id);
    });
  }
  
  $("#period").click(function(){
    $("#calculator-text").append(".");
  });
  
  $("#CE").click(function(){
    $("#calculator-text").html("");
  });
  $("#AC").click(function(){
    $("#calculator-text").html("");
    stringToEvaluate = "";
  });
  
  var operators = {"divide": "/", "multiply":"*", "subtract":"-", "add":"+"};
  
  Object.keys(operators).forEach(function(i){
    console.log("#"+i);
    $("#"+i).click(function(event){
      var currentHTML = $("#calculator-text").html();
      stringToEvaluate += currentHTML + operators[event.target.id];
      $("#CE").click();
      console.log(stringToEvaluate);
    });
  });
  
  $("#equals").click(function(){
    var currentHTML = $("#calculator-text").html();
    stringToEvaluate += currentHTML;
    stringToEvaluate = eval(stringToEvaluate);
    $("#calculator-text").html(stringToEvaluate);
    stringToEvaluate = "";
  });
});