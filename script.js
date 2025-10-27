

let log = console.log
let currentCalculation = [];
let resultsDisplayed;
let lastClickedButtonId = null;
let memoryCounter = null
const resultOutput = document.getElementById("result")



// Calculator button click handler
const handleButtonClick = () => {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      switch (true) {
        case e.target.className == "operation" || e.target.id === "decimal":
          lastClickedButtonId = e.target.className
          basicCalculations(e.target);
          break;
        case e.target.className == "number" :
          basicCalculations(e.target);
             lastClickedButtonId === "percentage" ? lastClickedButtonId : lastClickedButtonId = e.target.className
          break;
        case e.target.className == "special":
          negativeNumbers(e.target, e.target.value);
          break;
        case e.target.id == "delete" && lastClickedButtonId !== "equals":
          deleteButton()
          break;
        case e.target.className == "clear":   
         clear(e.target)
         break;
        case e.target.className == "percentage":
          handlePercentage(e.target);
          break;
        case e.target.className == "m-buttons" :
          handleMemory(e.target)
          break;
        case e.target.id == "equals":
          lastClickedButtonId = e.target.id 
          equalsPress(e.target);
          break;
        case e.target.className === "otherMaths" && lastClickedButtonId !== "equals":
          rootsAndOne(e.target)
      }
    });
  });
};

handleButtonClick()

//HELPERS 

// prevents errors caused by dividing by zero
const divideZero = () =>{
  if(currentCalculation.slice(-2).join("") === "/0" ||resultOutput.innerText === "Cannot divide by zero") {
    return true
  }
}

// finds index of operator to confirm existence 
const operatorIndex = () =>{
  return currentCalculation.findIndex((item) =>isNaN(item) && item != ".");                                                                            
}

//checks if current calculation has decimal 
const hasDecimal = () =>{
  return currentCalculation.some(item => item.toString().includes(".") || item % 1 !== 0 && !isNaN(item));
  }

//returns last value
const getLastValue = () => currentCalculation[currentCalculation.length - 1] 

// Function for alternative eval() & conversion of double negative to a plus for negative numbers
const customEval = (expression) => {
  expression = expression.replace(/--/g, '+');
  return Function('"use strict";return (' + expression + ')')();
};

const bodmas = (target) => {
  if (operatorIndex() !== -1 && target.value !== ".") {
    if (!isNaN(getLastValue())) {
      let tempEquals = divideZero()
        ? 0
        : customEval(currentCalculation.join(""));
      currentCalculation.length = 0;
      currentCalculation.push(tempEquals);
    }
  }
};

// output for calculator screen
const calculatorScreen = () => {
  let getScreen = document.getElementById("calculation");
  let convertedCurrentCalc = currentCalculation.map((operator) =>{
    if(operator === "*") {
      operator = "x"
    }else if(operator === "/") {
      operator = "÷"
    }
    return operator
  })
getScreen.innerText = convertedCurrentCalc.join("");
}

// CALCULATOR FUNCTIONS
  
// Square root, squared and division by one
  const rootsAndOne = (target) => {
    if (currentCalculation.includes(".")) {
      bodmas();
    }

    const basicValue = +currentCalculation.slice(operatorIndex() + 1).join("");
    const repeatValue = +currentCalculation.slice(0, operatorIndex()).join("");
    const valueToChange = isNaN(getLastValue()) ? repeatValue : basicValue;
    let newValue;

    if (!isNaN(getLastValue())) {
      switch (true) {
        case target.value === "/1":
          if (!(1 / valueToChange === Infinity)) {
            newValue = 1 / valueToChange;
          } else {
            newValue = 0;
            displayResults("Cannot divide by zero");
            resultsDisplayed = true;
          }
          break;
        case target.value === "x2":
          newValue = Math.pow(valueToChange, 2);
          break;
        case target.value === "2x":
          newValue = Math.sqrt(valueToChange);
          break;
      }
      currentCalculation.splice(operatorIndex() + 1);
      currentCalculation.push(newValue);
      calculatorScreen();
    }
  };

// memory buttons  
const handleMemory = (target) => {
  if (operatorIndex() === -1) {
  bodmas(target);
  }

  const memoryBox = document.getElementById("memoryCount");
  const addToMemory = +(currentCalculation.slice(operatorIndex()+ 1)).join("");

  if (!isNaN(getLastValue())) {
  if ((addToMemory != 0) && (target.innerText === "M+" || target.innerText === "M-")) {
      const valueToAdd = resultsDisplayed ? +resultOutput.innerText : +addToMemory;
      memoryCounter += (target.innerText === "M+") ? valueToAdd : -valueToAdd;
      if(memoryCounter === 0) {
        memoryCounter = null
      }
   }
  }
  if(target.innerText === "MC") {
    memoryCounter = null
  }
  if(target.innerText === "MR" && memoryCounter ) {
    currentCalculation.splice(operatorIndex() + 1);
    currentCalculation.push(memoryCounter)
  }
    memoryBox.innerText = memoryCounter;
    calculatorScreen();
};


//Handles negative numbers
const negativeNumbers = () => {
  let negativeNumber;
  if(lastClickedButtonId !== "equals"){
  if (currentCalculation.length) {
    if (operatorIndex() === -1) {
      negativeNumber = currentCalculation.join("") * -1;
      if (currentCalculation.join("") > 0) {
        currentCalculation.length = 0;
        currentCalculation.push(negativeNumber);
      } else {
        currentCalculation[0] = Math.abs(currentCalculation[0]);
      }
    } else {
      if(!isNaN(getLastValue())){
      negativeNumber = currentCalculation.slice(operatorIndex() + 1).join("") * -1;
      if (currentCalculation.slice(operatorIndex() + 1).join("") > 0) {
        currentCalculation.splice(operatorIndex() + 1);
        currentCalculation.push(negativeNumber);
      } else {
        currentCalculation[currentCalculation.length - 1] = Math.abs(
        currentCalculation[currentCalculation.length - 1]);
      }
    }
    }
  }
  calculatorScreen()
};
}

// function to handle any unexpected user behaviour
const handleErrors = (target) => {
  const beforeLastValue = currentCalculation[currentCalculation.length - 2];

  if (lastClickedButtonId === "percentage" && currentCalculation.length != 0) {
    return true;
  }
  if (target.className === "number" || target.id === "decimal") {
    if (getLastValue() === 0 && target.id != "decimal") {
      if (isNaN(beforeLastValue) && beforeLastValue !== ".") {
        currentCalculation.pop();
      }
    }
    if (resultsDisplayed) {
      clear();
      if (resultsDisplayed === true) {
        resultsDisplayed = false;
      }
    }
  }
  if (currentCalculation.includes(".") && target.id === "decimal") {
    return true;
  }
  if (target.className === "operation") {
    if(divideZero()) {
      currentCalculation.length === 0
      currentCalculation[0] = 0
      resultOutput.innerText = 0
  }
  if(resultsDisplayed) {
    resultOutput.innerText = 0
      resultsDisplayed = false
  }
  if (currentCalculation.length === 0 ) {
    currentCalculation.push(0);
  }
  if (operatorIndex() > 0 && getLastValue() === ".") {
    currentCalculation.splice(operatorIndex() + 1);
  }
  if (isNaN(getLastValue())) {
    if (target.id != "decimal") {
      currentCalculation[currentCalculation.length - 1] = target.value;
      return true;
    } else {
      currentCalculation.push(0);
    }
    }
  }
};

// If no unexpected user behavior, pushes values into array
const basicCalculations = (target) =>{
if(target.className === "operation") {
  bodmas(target);
}
  if (!handleErrors(target)) {
    target.className === "number"
      ? currentCalculation.push(+target.value)
      : currentCalculation.push(target.value);
  }
  calculatorScreen();
}

// Makes sure decimal behaviour is normal
const handleDecimal = (decimal) =>{
  return parseFloat(decimal.toPrecision(14))
}

// Handles what happens when percentage button is clicked
const handlePercentage = (target) => {
  let convertedPercentage;
  let percentage;
  let numBeforeOperator;
  if(lastClickedButtonId === "number"){
  if (operatorIndex() != -1) {
    numBeforeOperator = customEval(currentCalculation.slice(0, operatorIndex()).join(""));
    percentage = currentCalculation.slice(operatorIndex()+ 1).join("");
    currentCalculation.splice(operatorIndex()+ 1);
    if (currentCalculation[operatorIndex()] === "+" || currentCalculation[operatorIndex()] === "-") {
      convertedPercentage = +parseFloat((percentage / 100).toPrecision(2) * numBeforeOperator);
    } else if (currentCalculation[operatorIndex()] === "*" || currentCalculation[operatorIndex()] === "/") {
      convertedPercentage = +parseFloat(percentage / 100).toPrecision(2);
    }
  } else {
    currentCalculation.includes(".") ?  
    convertedPercentage = (currentCalculation.join("") / 100).toPrecision(2) 
    :
    convertedPercentage = (currentCalculation.join("") / 100)
    currentCalculation.length = 0;
  }
  currentCalculation.push(convertedPercentage);
  calculatorScreen();
  }
lastClickedButtonId = target.className;
}

// displays equal results
const displayResults = (equalResults) => {
  resultOutput.innerText = equalResults;
  if (currentCalculation.length > 0) {
    afterResult();
  }
};

// Triggered if equals is clicked once results are displayed
const afterResult = () =>{
  const operatorArray = currentCalculation.filter((item) => isNaN(item));
    if (resultsDisplayed) {
      if (operatorArray[0] != ".") {
        currentCalculation[0] = resultOutput.innerText;
        resultOutput.innerText = customEval(currentCalculation.join(""));
      }
    }
     calculatorScreen();
    resultsDisplayed = false;
}

// equals 
const equalsPress = () => {
  const beforeCalculation = currentCalculation.join("");
  let finalResult;
  if (currentCalculation.length) {
    if(divideZero()) {
      displayResults("Cannot divide by zero")
    } else {
      if ( !isNaN(getLastValue())) {
        hasDecimal
          ? (finalResult = handleDecimal(customEval(beforeCalculation)))
          : (finalResult = customEval(beforeCalculation));
        displayResults(finalResult);
      } else{
        if (getLastValue() != ".") {
          currentCalculation.push(currentCalculation[0]);
          finalResult = customEval(currentCalculation.join(""));
          displayResults(finalResult);
        } else {
          currentCalculation.pop();
          finalResult = customEval(beforeCalculation);
          displayResults(finalResult);
        }
        calculatorScreen();
      }
    }
  }
    resultsDisplayed = true;
};

// delete 
const deleteButton = () =>{
  if (!resultsDisplayed) {
    currentCalculation.pop();
    calculatorScreen();
  } else {
    resultOutput.innerText = 0;
    displayResults(resultOutput.innerText);
  }
}

// C & CE
const clear = (target) => {
  let clearResults;
  if (lastClickedButtonId === "percentage") {
    lastClickedButtonId = null;
  }
  if (resultsDisplayed || target.innerText === "C") {
    clearResults = 0;
    currentCalculation.length = 0;
    displayResults(clearResults);
  } else {
    clearResults = currentCalculation.splice(operatorIndex() + 1);
  }
  calculatorScreen();
};



const test =() => {
  log("current cal:   " , currentCalculation)
  log("last button:     " + lastClickedButtonId)
  log("memory counter:   " + memoryCounter)
  log("results displayed:   " + resultsDisplayed)
  log("has a decimal:        " + hasDecimal())
  log("last value:    "      +    getLastValue())
  log("operator index " +   (operatorIndex()))






}








