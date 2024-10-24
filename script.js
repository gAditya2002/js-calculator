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

  if (clickedNumber === "." && currentInput.includes(".")) return;

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

  if (["+", "-", "×", "÷", "*"].includes(lastChar)) {
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


  if (/^[a-zA-Z]$/.test(key)) {
    e.preventDefault();
    return;
  }


  if (!isNaN(key) || key === ".") {
    e.preventDefault();
    handleNumberClick({ target: { innerText: key } });
  }

  

  else if (["+", "-", "*", "/"].includes(key)) {
    e.preventDefault();
    handleOperatorClick({ target: { innerText: key } });
  }

  

  else if (key === "Enter") {
    e.preventDefault();
    calculate();
  }

  else if (key === "Backspace") {
    e.preventDefault();
    if (currentInput.length > 0) {
      currentInput = currentInput.slice(0, -1);
      updateDisplay();
    }
  }

  else if (key === "Escape") {
    clearInput();
  }
}




function calculate() {
  if (currentInput === "" || currentInput === "infinite") {
    return;
  }

  const lastChar = currentInput.slice(-1);

  if (["+", "-", "*", "/", "×", "÷"].includes(lastChar)) {
    currentInput = " ";
    updateDisplay();
    return;
  }

  const expression = currentInput.replace(/×/g, "*").replace(/÷/g, "/");
  const tokens = expression.split(" ").filter((token) => token.trim() !== "");
  let result = parseFloat(tokens[0]);

  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i];
    const nextNumber = parseFloat(tokens[i + 1]);

    if (isNaN(nextNumber)) {
      currentInput = " ";
      updateDisplay();
      return;
    }

    switch (operator) {
      case "+":
        result += nextNumber;
        break;
      case "-":
        result -= nextNumber;
        break;
      case "*":
        result *= nextNumber;
        break;
      case "/":
        if (nextNumber === 0) {
          currentInput = "infinite";
          updateDisplay();
          equalButton.disabled = true;
          currentInput = "";
          return;
        }
        result /= nextNumber;
        break;
      default:
        return;
    }
  }

  currentInput = result.toString();
  updateDisplay();
}

function clearInput() {
  currentInput = "";
  equalButton.disabled = false;
  updateDisplay();
}
