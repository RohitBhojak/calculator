const buttonArea = document.querySelector("#button-area");
const expressionScreen = document.querySelector("#expression-screen");
const resultScreen = document.querySelector("#result-screen");
const map = {
    divide: '/',
    multiply: '*',
    subtract: '-',
    add: '+',
    modulus: '%',
};
const operators = new Set(["/", "*", "-", "+", "%"]);
const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
    '%': (a, b) => a % b,
};
const numbers = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

let expression = [];
let hasOperator = false;
let hasDot = false;

function getExpression() {
    return expression.join("");
}

function display(char) {
    switch (char) {
        case "all-clear":
            expression = [];
            resultScreen.textContent = '';
            expressionScreen.textContent = '';
            hasDot = false;
            hasOperator = false;
            break;

        case "clear":
            const lastInput = expression.pop();
            expressionScreen.textContent = getExpression();
            if (operators.has(lastInput)) {
                hasOperator = false;
            } else if (lastInput === '.') {
                hasDot = false;
            }
            break;

        case "dot":
            if (!hasDot && getExpression().length < 26) {
                expression.push(".");
                expressionScreen.textContent = getExpression();
                hasDot = true;
            }
            break;

        case "equal":
            if (hasOperator && !operators.has(expression.at(-1))) {
                calculate(getExpression());
            }
            break;

        default:
            // Case for operators
            if (getExpression().length < 26) {
                if (operators.has(char)) {
                    if (hasOperator) {
                        if (operators.has(expression.at(-1))) {
                            expression.pop(); // Replace last operator
                        } else {
                            calculate(getExpression()); // Calculate result to hold only one operator at a time
                        }
                    }
                    expression.push(char);
                    expressionScreen.textContent = getExpression();
                    hasOperator = true;
                    hasDot = false;
                    return; // Exit after handling operator
                }

                // Case for numbers
                expression.push(char);
                expressionScreen.textContent = getExpression();
                break;
            }
    }
}

function calculate(expr) {
    let operator = '';
    let a = '';
    let b = '';
    let foundOperator = false;
    let isNegative = false;

    // Loop through the expression to find the operator and operands
    for (let i = 0; i < expression.length; i++) {
        let char = expression[i];

        // Handle negative numbers
        if (char === '-' && !foundOperator && i === 0) {
            isNegative = true;
            continue; // Skip adding the '-' to the operand yet
        }

        if (operators.has(char)) {
            operator = char;
            foundOperator = true;
        } else {
            if (!foundOperator) {
                a += char;  // Build the first operand
            } else {
                b += char;  // Build the second operand
            }
        }
    }

    // Parse numbers, considering negative sign for the first operand
    if (a === '') a = '0'; // Handle empty first operand
    const num1 = isNegative ? parseFloat('-' + a) : parseFloat(a);
    const num2 = parseFloat(b);
    console.log(num1 + ' ' + num2);
    let result;

    if (num2 === 0 && operator === '/') {
        result = "ERROR";  // Handle division by zero
    } else {
        if (operator === '') result = num1; // Handle no operator
        else result = operations[operator](num1, num2);

        // Check if result is too large or small and convert it to exponential notation
        result = result.toString();
        if (result.length > 12) {
            if (Math.abs(result) >= 1e12 || Math.abs(result) < 1e-6) {
                // Convert large/small results to exponential notation
                result = Number(result).toExponential(6); // 6 digits precision
            } else if (result.includes(".")) {
                // Trim decimal results if they are too long
                result = result.slice(0, 12);
            } else {
                result = Number(result).toExponential(6); // Handle large integers
            }
        } else if (isNaN(result)) {
            result = "ERROR";
        }
    }

    resultScreen.textContent = result; // Show the result
    expressionScreen.textContent = result;
    expression = [result];  // Reset expression to only hold the result
    hasOperator = false; // Reset operator flag
}


buttonArea.addEventListener("click", (e) => {
    const button = e.target.closest("button");

    if (button) {
        if (button.id.startsWith("num")) {
            display(button.textContent);
        } else if (button.id in map) {
            display(map[button.id]);
        } else {
            display(button.id);
        }
        console.log(expression); // Debugging output
    }
});

// Keyboard support
document.addEventListener("keydown", (e) => {
    const key = e.key;
    if (operators.has(key) || numbers.has(key)) {
        display(key);
    } else if (key === '.') {
        display("dot");
    } else if (key === 'Enter' || key === "=") {
        display("equal");
    } else if (key === 'Backspace') {
        display("clear");
    } else if (key === "Delete" || key === "Escape") {
        display("all-clear");
    }
})