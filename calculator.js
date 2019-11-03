(function() {
  
  var myCalculator = window.myCalculator = (window.myCalculator || {});

  var keys = ["+","-","*","/","7","8","9","=","4","5","6","1","2","3","0",".","AC"];
  // var numbers = ["7","8","9","4","5","6","1","2","3","0","."];

  //julia is awesome

  var operators = ["=","+","-","*","/","C", "CE"];
  var current_expression = "";
  var total = 0;


  myCalculator.initialize = function() {
    addButtons();
    updateCurrentExpression();
    updateTotal(0);
  }


  var addButtons = function() {
    var parent = document.getElementById("button_container");
    //var options = numbers.concat(operators);
    var options = keys;
    var buttonCounter = 0;

    for(var i = 0; i < options.length; i++) {

      let new_button = document.createElement("div");
      new_button.setAttribute("class", "calc_button");
      new_button.setAttribute("id", "button_"+options[i]);
      new_button.setAttribute("value", options[i]);
      new_button.innerText = options[i];
      parent.appendChild(new_button);
      new_button.addEventListener("click", myCalculator.buttonClick)
    }
  }


  myCalculator.buttonClick = function(event) {
    var button = event.target
    var value = button.getAttribute("value")

    if (!isNaN(value) || value === ".") {
      // isNaN will return false if the value is NOT a number. Thus !isNan will
      // return true if it is a number.

      addNumber(value);
    } else if (value === "=") {
      evaluateCurrentExpression();
    } else if (value === "AC" || value === "C") {
      clear();
      // current_expression = "";
      // updateCurrentExpression();
    } else if (value === "CE") {
      // current_expression = "";
      // updateCurrentExpression();
      // updateTotal(0);
    } else {
      addOperator(value);
    }

    updateClearButton();
  };

  var updateClearButton = function() {
    if (current_expression != "") {
      document.getElementById("button_AC").innerText = "C";
    } else {
      document.getElementById("button_AC").innerText = "AC";
    }
  }

  var clear = function() {
    if (current_expression != "") {
      current_expression = "";
      updateCurrentExpression();
    } else {
      updateTotal(0);
    }
  }


  var addNumber = function(value) {
    current_expression += value;
    updateCurrentExpression();
  };


  var addOperator = function(value) {
    if (operators.includes(current_expression.charAt(current_expression.length - 2))) {
      // Prevent adding two operators in a row.
      return;
    }

    if (current_expression === "") {
      current_expression += total.toString();
    }

    current_expression += " " + value + " ";
    updateCurrentExpression();
  };


  var updateCurrentExpression = function() {
    var updateText = current_expression;
    if (current_expression === "") {
      updateText = "0";
    }
    document.getElementById("curr_expression").innerText = updateText;
  };


  var updateTotal = function(new_total) {
    total = new_total;
    document.getElementById("total").innerText = total;
  }


  var evaluateCurrentExpression = function() {
    expr_arr = current_expression.split(" ");

    if (!checkValidity(expr_arr)) {
      return;
    }

    let new_total = parseFloat(orderOfOperations(expr_arr));
    new_total = new_total.toFixed(2);

    if (current_expression != "") {
      updateTotal(new_total);

    }

    current_expression = "";
    updateCurrentExpression();
  };

  var checkValidity = function(expr_arr) {
    if (expr_arr.length === 0) {
      console.log("Error: Empty equation.");
      return false;
    }

    if (operators.includes(expr_arr[0])) {
      console.log("Error: Operators cannot start the equation.");
      return false;
    }

    if (operators.includes(expr_arr[expr_arr.length-1])) {
      console.log("Error: operators cannot end be at the end of the equation");
      return false;
    }

    return true;
  }

  var orderOfOperations = function(expr_arr) {
    expr_arr = handleMD(expr_arr); // Handle multiplication and division
    expr_arr = handleAS(expr_arr); // handle addition and subtraction

    return expr_arr[0]; // There should only be one value left, that is the total.
  }

  var handleMD = function(expr_arr) {
    // We will loop through each element. If we see a * or /, we will perform the
    // math on the numbers on either side. We are hoping that there is a value
    // on both sides. If not, substitute it with the value 1.

    var md = ['*', '/'];

    for (var i = 0; i < expr_arr.length-1; i++) {
      if (md.includes(expr_arr[i])) {
        var temp_total;
        let first_num = parseFloat(expr_arr[i-1]);
        let second_num = parseFloat(expr_arr[i+1]);

        if (expr_arr[i] === "*") {
          temp_total = first_num * second_num;
        } else {
          temp_total = first_num / second_num;
        }

        expr_arr.splice(i-1, 3, temp_total); // Remove the three elements and insert total

        i -= 2; // Adjust for the two removed values.

      }
    }

    return expr_arr;
  }

  var handleAS = function(expr_arr) {
    var as = ['+', '-'];

    for (var i = 0; i < expr_arr.length-1; i++) {
      if (as.includes(expr_arr[i])) {
        var temp_total;
        let first_num = parseFloat(expr_arr[i-1]);
        let second_num = parseFloat(expr_arr[i+1]);
        console.log(first_num);
        console.log(second_num);
        if (expr_arr[i] === "+") {
            temp_total = first_num + second_num;
        } else {
            temp_total = first_num - second_num;
        }
        console.log(temp_total);
        expr_arr.splice(i-1, 3, temp_total); // Remove the three elements and insert total

        i -= 2; // Adjust for the two removed values.

      }
    }
    return expr_arr;
  }
})();