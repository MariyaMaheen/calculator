let currentValue = '0';
let previousValue = '';
let operator = null;
let shouldReset = false;

const resultEl = document.getElementById('result');
const expressionEl = document.getElementById('expression');

function updateDisplay() {
  resultEl.textContent = currentValue;


  const len = currentValue.length;
  resultEl.className = 'result';
  if (len > 9) {
    resultEl.classList.add('small');
  } else if (len > 6) {
    resultEl.classList.add('medium');
  }
}


function appendNum(num) {
  if (shouldReset) {
    currentValue = num;
    shouldReset = false;
  } else {
    if (currentValue === '0') {
      currentValue = num;
    } else {
      if (currentValue.length >= 12) return; // limit digits
      currentValue += num;
    }
  }
  updateDisplay();
}


function appendDot() {
  if (shouldReset) {
    currentValue = '0.';
    shouldReset = false;
    updateDisplay();
    return;
  }
  if (!currentValue.includes('.')) {
    currentValue += '.';
    updateDisplay();
  }
}


function setOperator(op) {
  if (operator && !shouldReset) {
    calculate();
  }
  previousValue = currentValue;
  operator = op;
  shouldReset = true;

  
  const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  expressionEl.textContent = previousValue + ' ' + symbols[op];
}

function calculate() {
  if (!operator || !previousValue) return;

  const a = parseFloat(previousValue);
  const b = parseFloat(currentValue);
  let result;

  if (operator === '+') result = a + b;
  else if (operator === '-') result = a - b;
  else if (operator === '*') result = a * b;
  else if (operator === '/') {
    if (b === 0) {
      currentValue = 'Error';
      operator = null;
      previousValue = '';
      shouldReset = true;
      expressionEl.textContent = '';
      updateDisplay();
      return;
    }
    result = a / b;
  }

  
  const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  expressionEl.textContent = previousValue + ' ' + symbols[operator] + ' ' + currentValue + ' =';

  
  currentValue = parseFloat(result.toPrecision(10)).toString();
  operator = null;
  previousValue = '';
  shouldReset = true;

  updateDisplay();
}


function clearAll() {
  currentValue = '0';
  previousValue = '';
  operator = null;
  shouldReset = false;
  expressionEl.textContent = '';
  updateDisplay();
}


function toggleSign() {
  if (currentValue === '0' || currentValue === 'Error') return;
  if (currentValue.startsWith('-')) {
    currentValue = currentValue.slice(1);
  } else {
    currentValue = '-' + currentValue;
  }
  updateDisplay();
}


function percent() {
  if (currentValue === 'Error') return;
  currentValue = (parseFloat(currentValue) / 100).toString();
  updateDisplay();
}


document.addEventListener('keydown', function (e) {
  if (e.key >= '0' && e.key <= '9') appendNum(e.key);
  else if (e.key === '.') appendDot();
  else if (e.key === '+') setOperator('+');
  else if (e.key === '-') setOperator('-');
  else if (e.key === '*') setOperator('*');
  else if (e.key === '/') { e.preventDefault(); setOperator('/'); }
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Escape') clearAll();
  else if (e.key === '%') percent();
  else if (e.key === 'Backspace') {
    if (currentValue.length > 1 && !shouldReset) {
      currentValue = currentValue.slice(0, -1);
    } else {
      currentValue = '0';
    }
    updateDisplay();
  }
});