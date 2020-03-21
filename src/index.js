/**
 * Parser of array expression sequencies (WITHOUT BRACKETS)
 * @param {Array} arr unparsed array of symbols with numbers & operations
 * @returns {Array} parsed array numbers & operations
 */

function parser(arr) {
    let parsed = [];
    let item = '';
    for (let i = 0; i < arr.length; i++) {
        switch(arr[i]) {
            case '+':
            case '-':
            case '*':
            case '/':
                parsed.push(Number(item), arr[i]);
                item = '';
                break;
            default: item += arr[i]; break;
        }
    }
    if (item.length) parsed.push(Number(item));
    return parsed;
}

/**
 * Evaluate the given expression (WITHOUT BRACKETS)
 * @param {Array} arr unparsed array of the numbers & operations
 * @returns {number} result of the evaluated expression
 */

function eval(arr) {
    const OPERATIONS = ['/', '*', '-', '+'];
    let parsed = parser(arr); 
    while (parsed.length !== 1) {
        for (let i = 0; i < OPERATIONS.length; i++) {
            const OPERATION = OPERATIONS[i];

            let posOperation = parsed.indexOf(OPERATION);
            while (posOperation !== -1) {
                let tempResult;
                const operand1 = parsed[posOperation - 1];
                const operand2 = parsed[posOperation + 1];
                switch (OPERATION) {
                    case '/':
                        if (parsed[posOperation + 1] === 0)
                            throw new Error('TypeError: Division by zero.');
                              tempResult = operand1 / operand2; break;
                    case '*': tempResult = operand1 * operand2; break;
                    case '-': tempResult = operand1 - operand2; break;
                    case '+': tempResult = operand1 + operand2; break;
                }
                parsed.splice(posOperation - 1, 3, tempResult);
                posOperation = parsed.indexOf(OPERATION);
            }
        }
    }
    return parsed[0];
}

function expressionCalculator(expr) {
    expr = expr.split('').filter(val => val !== '' && val !== ' ');
    let bracketsCount = 0;
    for (let i = 0; i < expr.length; i++) {
        switch (expr[i]) {
            case '(': bracketsCount++; break;
            case ')': bracketsCount--; break;
        }
    }
    if (bracketsCount !== 0)
        throw new Error('ExpressionError: Brackets must be paired');

    let start = expr.lastIndexOf('(');
    while (start !== -1) {
        let end = expr.indexOf(')') + 1;
        while (end < start) end = expr.indexOf(')', end) + 1;
        let cutArray = expr.slice(start + 1, end - 1);
        expr.splice(start, end - start, eval(cutArray));
        start = expr.lastIndexOf('(');
    }

    return eval(expr);
}

module.exports = {
    expressionCalculator
}