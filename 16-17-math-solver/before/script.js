// KNOWN BUGS
// Can't handle back to back operators like '/*'

// Constants
const ERRORS = { DEFAULT: "Error: Ghost in the machine 👻", DIV_BY_ZERO: "Error: Cannot Divide by Zero" }

// DOM Elements
const resultDiv = document.getElementById("results")
const input = document.getElementById("equation")
const form = document.getElementById("equation-form")
const historyNode = document.createElement("li")
const historyUL = document.getElementById("history")
const clearButton = document.getElementById("clear")

// Calc Helper Functions
const output = (ans) => (resultDiv.textContent = isNaN(ans) ? (ans === ERRORS.DIV_BY_ZERO ? ERRORS.DIV_BY_ZERO : ERRORS.DEFAULT) : `Answer: ${ans}`)
const multiply = (a, b) => eval(a * b)
const divide = (op, div) => (div === 0 || div === "0" ? ERRORS.DIV_BY_ZERO : eval(op / div))
const pow = (num, exp) => Math.pow(num, exp)

// 2+(2-3)*4/6^2+(3+5)

// Regex

const REGEX = {
	PARENS: /\(...\)/g,
	EXP: /\d*\^\d*/g,
	MULT: /\d*\*\d*/g,
	DIV: /\d*\/\d*/g,
	CHECK: /[^\d^+(*)/-]/,
}

// Evaluate Function
const evaluate = (str) => {
	let work = str
	console.log("START", work)
	const parens = work.match(REGEX.PARENS)
	if (!!parens) {
		parens.forEach((problem) => {
			work = work.replace(problem, eval(problem))
		})
		console.log("PARENS", work)
	}

	const exponents = work.match(REGEX.EXP)
	if (!!exponents) {
		exponents.forEach((problem) => {
			const operands = problem.split("^")
			work = work.replace(problem, pow(...operands))
		})
		console.log("exponents", work)
	}

	const multiplications = work.match(REGEX.MULT)
	if (!!multiplications) {
		multiplications.forEach((problem) => {
			const operands = problem.split("*")
			work = work.replace(problem, multiply(...operands))
		})
		console.log("multiplications", work)
	}

	const divisions = work.match(REGEX.DIV)
	if (!!divisions) {
		divisions.forEach((problem) => {
			const operands = problem.split("/")
			const answer = divide(...operands)
			work = work.replace(problem, answer)
		})
		if (work.includes(ERRORS.DIV_BY_ZERO)) return ERRORS.DIV_BY_ZERO
		console.log("divisions", work)
	}

	// Account for subtracting a negative in the string '1--4' by converting to addition '1+4'
	work = work.replace("--", "+")

	// Utilize eval to handle the remaining addition and subtraction
	return eval(work)
}

// UI Handlers
form.onsubmit = (e) => {
	e.preventDefault()
	const problem = input.value.replaceAll(" ", "")
	let answer
	answer = REGEX.CHECK.test(problem) ? ERRORS.DEFAULT : evaluate(problem)
	output(answer)
	historyNode.innerText = `${problem} = ${isNaN(answer) ? (answer === ERRORS.DIV_BY_ZERO ? ERRORS.DIV_BY_ZERO : ERRORS.DEFAULT) : answer}`
	historyUL.appendChild(historyNode)
	input.value = ""
}

clearButton.onclick = () => {
	historyUL.innerHTML = ""
	resultDiv.textContent = ""
}
