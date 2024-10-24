document.querySelectorAll(".num").forEach((button) => {
  button.addEventListener("click", handleNumberClick);
});

document.querySelectorAll(".op").forEach((button) => {
  button.addEventListener("click", handleOperatorClick);
});

document.querySelector(".clear").addEventListener("click", clearInput);

document.querySelector(".equal").addEventListener("click", calculate);

let currentInput = "";

const inputField = document.querySelector(".input");

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

  }
   else 
   {
    currentInput += ` ${operator} `;
  }

  updateDisplay();
}

function calculate() {
  const expression = currentInput.replace(/×/g, "*").replace(/÷/g, "/");

  const tokens = expression.split(" ").filter((token) => token.trim() !== "");

  let result = parseFloat(tokens[0]);

  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i];
    const nextNumber = parseFloat(tokens[i + 1]);

    if (isNaN(nextNumber)) {
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
          console.log("nan")
          currentInput = "infinity"
          updateDisplay();
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
  updateDisplay();
}
