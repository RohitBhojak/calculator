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

    // Loop through the expression to find the operator and operands
    for (let char of expr) {
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

    const num1 = parseFloat(a);
    const num2 = parseFloat(b);
    let result;

    if (num2 === 0 && operator === '/') {
        result = "ERROR";  // Handle division by zero
    } else {
        result = operations[operator](num1, num2);

        // Handle overflow or NaN results
        if (typeof result !== 'number' || result.toString().length > 12) {
            result = "OVERFLOW";
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
