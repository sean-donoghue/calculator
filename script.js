const display = document.querySelector("#calc-display");
const backspaceButton = document.querySelector("#backspace-btn");
const clearButton = document.querySelector("#clear-btn");
const equalButton = document.querySelector("#equal-btn");
const numButtons = document.querySelectorAll(".num-btn");
const opButtons = document.querySelectorAll(".op-btn");
const buttons = document.querySelectorAll(".calc-btn");

let firstNumber = null;
let secondNumber = null;
let operator = null;
let displayValue = "0";

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

function operate(operator, a, b) {
  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      return divide(a, b);
  }
}

function calculateResult() {
  const result = operate(operator, firstNumber, secondNumber);
  return String(Number.parseInt(result * 10_000) / 10_000); // Ensure long floats are truncated
}

function clearValues(clearDisplayValue = true) {
  firstNumber = null;
  secondNumber = null;
  operator = null;
  if (clearDisplayValue) displayValue = "0";
}

function calculateAndDisplay() {
  if (operator === null) return;

  secondNumber = Number.parseFloat(display.value);

  if (operator === "/" && secondNumber === 0) {
    clearValues();
    display.value = "lmao";
  } else {
    displayValue = calculateResult();
    display.value = displayValue;
    clearValues(false); // displayValue is kept for next calculation
  }
}

numButtons.forEach((button) =>
  button.addEventListener("click", (e) => {
    const numStr = e.target.value;

    if (displayValue.length === 8 || (displayValue === "0" && numStr === "0"))
      null; // We want to eliminate these conditions early so below are valid
    else if (displayValue === "0") displayValue = numStr;
    else displayValue += numStr;

    display.value = displayValue;
  })
);

opButtons.forEach((button) =>
  button.addEventListener("click", (e) => {
    if (operator !== null) calculateAndDisplay(); // Allow chaining operators e.g. (12 + 7) * 2

    operator = e.target.value;
    firstNumber = Number.parseFloat(displayValue);
    displayValue = "0"; // Only change internal value, keeps display until next number clicked
  })
);

backspaceButton.addEventListener("click", () => {
  displayValue = displayValue.slice(0, -1);
  displayValue = displayValue ? displayValue : "0";
  display.value = displayValue;
});

clearButton.addEventListener("click", () => {
  clearValues();
  display.value = "0";
});

equalButton.addEventListener("click", calculateAndDisplay);

buttons.forEach((button) =>
  button.addEventListener("click", (e) => {
    if (!e.isTrusted) { // Add visual effect to simulated button clicks
      e.target.classList.add("active");
      setTimeout(() => e.target.classList.remove("active"), 200);
    }
  })
);

document.addEventListener("keydown", (e) => {
  const operators = ["+", "-", "*", "/"];

  const keyMapping = {
    Enter: equalButton,
    "=": equalButton,
    Escape: clearButton,
    Backspace: backspaceButton,
    Delete: backspaceButton,
  };

  let button = null;

  if (Number.isInteger(Number(e.key))) {
    button = Array.from(numButtons).find((button) => button.value === e.key);
  } else if (operators.includes(e.key)) {
    button = Array.from(opButtons).find((button) => button.value === e.key);
  } else if (e.key in keyMapping) {
    button = keyMapping[e.key];
  }

  button ? button.click() : null;
});
