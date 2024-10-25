let currentInput = "";
const inputField = document.querySelector(".input");
const equalButton = document.querySelector(".equal");

document.querySelectorAll(".num").forEach((button) => {
  button.addEventListener("click", handleNumberClick);
});

document.querySelectorAll(".op").forEach((button) => {
  button.addEventListener("click", handleOperatorClick);
});

document.querySelector(".clear").addEventListener("click", clearInput);
equalButton.addEventListener("click", calculate);

document.addEventListener("keydown", handleKeyPress);

function updateDisplay() {
  inputField.value = currentInput;
}

function handleNumberClick(e) {
  const clickedNumber = e.target.innerText;
  const lastNumber = currentInput.trim().split(" ").pop(); 

  if (clickedNumber === "." && lastNumber.includes(".")) return;

  currentInput += clickedNumber;
  updateDisplay();
}

function handleOperatorClick(e) {
  const operator = e.target.innerText;
  if (currentInput === "infinite") {
    currentInput = "";
  }
  if (currentInput === "") {
    if (operator === "-") {
      currentInput += operator;
      updateDisplay();
    }
    return;
  }
  if (currentInput === "-" && ["+", "*", "/", "×", "÷"].includes(operator)) {
    return;
  }

  const lastChar = currentInput.trim().slice(-1);

  if (["+", "-", "×", "÷", "*","."].includes(lastChar)) {
    currentInput = currentInput.trim().slice(0, -1) + `${operator} `;
  } else {
    currentInput += ` ${operator} `;
  }
  updateDisplay();
}

function handleKeyPress(e) {
  const key = e.key;
  if (key === " ") {
    e.preventDefault();
    return;
  }
  if (!isNaN(key) || key === '.') { 
    e.preventDefault();
    handleNumberClick({ target: { innerText: key } });
  } else if (["+", "-", "*", "/"].includes(key)) {
    e.preventDefault();
    handleOperatorClick({ target: { innerText: key } });
  } else if (key === "Enter") {
    e.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    e.preventDefault();
    if (currentInput.length > 0) {
      currentInput = currentInput.slice(0, -1);
      updateDisplay();
    }
  } else {
    e.preventDefault();
  }
}

function calculate() {
  if (currentInput === "" || currentInput === "infinite") {
    return;
  }

  currentInput = currentInput.trim();
  while (["+", "-", "*", "/", "×", "÷"].includes(currentInput.slice(-1))) {
    currentInput = currentInput.slice(0, -1).trim();
  }

  const expression = currentInput.replace(/×/g, "*").replace(/÷/g, "/");

  if (expression === "" || /[^\d\s\+\-\*\/\.]/.test(expression)) {
    currentInput = " ";
    updateDisplay();
    return;
  }

  const result = evaluateExpression(expression);
  currentInput = result.toString();
  updateDisplay();
}

function evaluateExpression(expr) {
  if (expr.startsWith("-")) {
    expr = "0 " + expr;  
  }

  const tokens = expr.match(/(\d+\.?\d*|\+|\-|\*|\/|\s+)/g).map(token => token.trim()).filter(token => token.length);

  let tempResult = [];
  let i = 0;
  while (i < tokens.length) {
    if (tokens[i] === "*" || tokens[i] === "/") {
      const left = parseFloat(tempResult.pop());
      const right = parseFloat(tokens[i + 1]);
      const operator = tokens[i];

      if (operator === "/" && right === 0) {
        currentInput = "infinite";          
        updateDisplay();
        currentInput = " ";
        return;
      }

      const newValue = operator === "*" ? left * right : left / right;
      tempResult.push(newValue);
      i += 2; 
    } else {
      tempResult.push(tokens[i]);
      i++;
    }
  }

  let finalResult = parseFloat(tempResult[0]);
  for (let j = 1; j < tempResult.length; j += 2) {
    const operator = tempResult[j];
    const nextNumber = parseFloat(tempResult[j + 1]);

    if (isNaN(nextNumber)) {
      currentInput = " ";
      updateDisplay();
      return;
    }

    switch (operator) {
      case "+":
        finalResult += nextNumber;
        break;
      case "-":
        finalResult -= nextNumber;
        break;
      default:
        return;
    }
  }

  return finalResult;
}

function clearInput() {
  currentInput = "";
  equalButton.disabled = false;
  updateDisplay();
}
