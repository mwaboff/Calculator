////////////////////////////////////////
//
//  Over Complicated Calculator
// 
//    Michael Aboff
//    mwaboff@gmail.com
//    https://github.com/mwaboff
//
//    DSN6040 - Web Design and Javascript
//
////////////////////////////////////////


(function() {
  
  // Set the namespace to prevent any potential collisions.
  var myCalculator = window.myCalculator = (window.myCalculator || {});

  // Initializing variables.
  var keys = ["+","-","*","/","7","8","9","=","4","5","6","1","2","3","0",".","C"];
  var operators = ["=","+","-","*","/","C", "CE"];
  var current_expression = "";
  var total = 0;

  var keyMapping = {48: "0", 96: "0", 49: "1", 97: "1", 50: "2", 98: "2", 
    51: "3", 99: "3", 52: "4", 100: "4", 53: "5", 101: "5", 54: "6", 102: "6", 
    55: "7", 103: "7", 56: "8", 104: "8", 57: "9", 105: "9", 43: "+", 107: "+", 
    45: "-", 109: "-", 42: "*", 106: "*", 191: "/", 111: "/", 61: "=", 13: "=", 
    190: ".", 110: ".", 46: "C", 8: "C"};


  /**
  * Initializes the calculator script.
  */
  myCalculator.initialize = function() {
    updateCurrentExpression();
    updateTotal(0);

    addButtons();
  }


  /**
  * Creates the keypad buttons dynamically.
  */
  var addButtons = function() {
    var parent = document.getElementById("button_container");
    var options = keys;
    var buttonCounter = 0;

    for(var i = 0; i < options.length; i++) {

      let new_button = document.createElement("div");
      new_button.setAttribute("class", "calc_button");
      new_button.setAttribute("id", "button_"+options[i]);
      new_button.setAttribute("value", options[i]);
      new_button.innerText = options[i];
      parent.appendChild(new_button);
      new_button.addEventListener("click", buttonClick)
    }
  }


  /**
  * Initiates action when button is clicked by the cursor.
  *
  * @param {event} event - The browser's event action when the key is clicked.
  */
  var buttonClick = function(event) {
    var button_value = event.target.getAttribute("value");
    processButton(button_value);
  };


  /**
  * Determines course of action based off of what key or button value was clicked.
  *
  * @param {String} value - The string value of the calculator button being clicked.
  */
  var processButton = function(value) {
    if (!isNaN(value) || value === ".") {
      // Check if number with !isNaN or a period.
      addNumber(value);
    } else if (value === "=") {
      evaluateCurrentExpression();
    } else if (value === "C") {
      clear();
    } else {
      addOperator(value);
    }
  }


  /**
  * Clears the current expression and the hidden total value.
  */
  var clear = function() {
    current_expression = "";
    updateCurrentExpression();
    updateTotal(0);
  }


  /**
  * Adds a number to the current_expression string when the number or period is
  *   clicked.
  *
  * @param {String} value - The character that will be added to the string.
  */
  var addNumber = function(value) {
    current_expression += value;
    updateCurrentExpression();
  };


  /**
  * Adds a operator to the current_expression string when the number or period is
  *   clicked. Adds spaces to either side for nicer formatting.
  *
  * @param {String} value - The character that will be added to the string.
  */
  var addOperator = function(value) {
    // Prevent adding two operators in a row.
    if (operators.includes(current_expression.charAt(current_expression.length - 2))) {
      return;
    }

    // Add total as the initial number if operator is clicked first.
    if (current_expression === "") {
      current_expression += total.toString();
    }

    current_expression += " " + value + " ";
    updateCurrentExpression();
  };


  /**
  * Updates the visible output based off of the current_expression value.
  */
  var updateCurrentExpression = function() {
    var updateText = current_expression;

    // Display a zero if no current_expression.
    if (current_expression === "") {
      updateText = "0";
    }

    document.getElementById("curr_expression").innerText = updateText;
  };


  /**
  * Updates the hidden total value.
  *
  * @param {float} new_total - The new float value.
  */
  var updateTotal = function(new_total) {
    total = new_total;
  }


  /**
  * Parses and initiates the evaluation of the stored current_expression string.
  *
  * @return {bool} - Returns true if successful, false if failure.
  */
  var evaluateCurrentExpression = function() {
    expr_arr = current_expression.split(" ");

    if (current_expression == "" || !checkValidity(expr_arr)) {
      return false;
    }

    let new_total = parseFloat(orderOfOperations(expr_arr));
    new_total = new_total.toFixed(2);

    updateTotal(new_total);

    current_expression = "";

    // Updating the calculator output without modifying the current_expression.
    document.getElementById("curr_expression").innerText = total;

    return true;
  };


  /**
  * Checks if the current_expression is valid.
  *
  * @param {Array} expr_arr - The current_expression split on " ".
  * @return {bool} - Returns true if it is ok, false if the function is bad.
  */
  var checkValidity = function(expr_arr) {
    //console.log(expr_arr);
    if (expr_arr.length === 0) {
      console.log("Error: Empty equation.");
      return false;
    }

    var first_char = expr_arr[0];
    var last_char = expr_arr[expr_arr.length-1];

    if (operators.includes(expr_arr[0])) {
      console.log("Error: Operators cannot start the equation.");
      return false;
    }

    if (operators.includes(last_char) || last_char === "") {
      console.log("Error: operators cannot end be at the end of the equation");
      return false;
    }

    return true;
  }


  /**
  * Initiates the different functions in the order of operations.
  *
  * @param {Array} expr_arr - The current_expression split on " ".
  * @return {int} - The final value.
  */
  var orderOfOperations = function(expr_arr) {
    expr_arr = handleMD(expr_arr); // Handle multiplication and division
    expr_arr = handleAS(expr_arr); // handle addition and subtraction

    return expr_arr[0]; // There should only be one value left, that is the total.
  }


  /**
  * Iterates through each element of the expression array. Multiples or divides
  *   the preceeding and succeeding values.
  *
  * @param {Array} expr_arr - The current_expression split on " ".
  * @return {Array} - The remaining expr_arr after calculations.
  */
  var handleMD = function(expr_arr) {
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
        i -= 2; // Adjust counter for the two removed values.

      }
    }
    return expr_arr;
  }


  /**
  * Iterates through each element of the expression array. Adds or subtracts
  *   the preceeding and succeeding values.
  *
  * @param {Array} expr_arr - The current_expression split on " ".
  * @return {Array} - The remaining expr_arr after calculations.
  */
  var handleAS = function(expr_arr) {
    var as = ['+', '-'];

    for (var i = 0; i < expr_arr.length-1; i++) {
      if (as.includes(expr_arr[i])) {
        var temp_total;
        let first_num = parseFloat(expr_arr[i-1]);
        let second_num = parseFloat(expr_arr[i+1]);
        if (expr_arr[i] === "+") {
            temp_total = first_num + second_num;
        } else {
            temp_total = first_num - second_num;
        }
        expr_arr.splice(i-1, 3, temp_total); // Remove the three elements and insert total
        i -= 2; // Adjust the counter for the two removed values.

      }
    }
    return expr_arr;
  }


  /**
  * Handles the browser's keyDown event for keyboards when clicking select keys.
  *
  * @param {event} event - The browser's triggered event on keyDown.
  */
  myCalculator.keyDown = function(event) {
    var value = event.keyCode;
    if (Object.keys(keyMapping).includes(value.toString())) {
      let translated = keyMapping[event.keyCode];
      processButton(translated);
      buttonDown(translated);
    }
  }


  /**
  * Handles the browser's keyUp event for keyboards when clicking select keys.
  *
  * @param {event} event - The browser's triggered event on keyUp.
  */
  myCalculator.keyUp = function(event) {
    var value = event.keyCode;
    if (Object.keys(keyMapping).includes(value.toString())) {
      let translated = keyMapping[event.keyCode];
      buttonUp(translated);
    }
  }

  /**
  * Darkens the color of buttons when the button is clicked or keyboard button
  *   is pressed.
  *
  * @param {String} button_value - The value of the button pressed.
  */
  var buttonDown = function(button_value) {
    button = document.getElementById("button_" + button_value.toString());
    button.classList.add("clicked_button");
  }

  /**
  * Lightens the color of buttons when the button is clicked or keyboard button
  *   is pressed.
  *
  * @param {String} button_value - The value of the button pressed.
  */
  var buttonUp = function(button_value) {
    button = document.getElementById("button_" + button_value.toString());
    button.classList.remove("clicked_button");
  }
})();