const cl = require("./CommandLine")
const Account = require("./Account")

async function session() {
	const accountName = await cl.ask("What is your account name?")
	let account = await Account.find(accountName)
	if (!account) account = await createAccountPrompt(accountName)
	if (account) await promptTask(account)
	endSession()
}

async function createAccountPrompt(accountName) {
	const response = await cl.ask("\nAccount not found.\n\nWould you like to create an account? (y or n)")
	if (response === "y") {
		const newAccount = await Account.create(accountName)
		cl.print(`\nExcellent! We have created an account for ${newAccount.name}\n`)
		return newAccount
	} else {
		cl.print("\nIt's been a pleasure serving you. Have a great day!")
		return
	}
}

async function promptTask(account) {
	const response = await cl.ask("What would you like to do? ((v)iew / (d)eposit / (w)ithdraw / (c)ancel)")
	switch (response) {
		case "v":
			cl.print(`\nYour current balance is: $${account.balance}`)
			await promptTask(account)
			break

		case "d":
			const deposit = parseFloat(await cl.ask("How much? $"))
			await account.deposit(deposit)
			cl.print(`\n$${deposit} was successfully deposited!`)
			cl.print(`Your current balance is: $${account.balance}`)
			break

		case "w":
			const withdraw = parseFloat(await cl.ask("How much? $"))
			try {
				await account.withdraw(withdraw)
				cl.print(`\n$${withdraw} was successfully withdrawn!`)
				cl.print(`Your current balance is: $${account.balance}`)
			} catch (error) {
				cl.print(`\nYou do not have sufficient funds to withdraw $${withdraw}.`)
				cl.print(`Your current balance is: $${account.balance}`)
			}
			break

		case "c":
			break

		default:
			console.log("invalid input")
	}
}

function endSession() {
	cl.print("It's been a pleasure serving you. Have a great day!")
}

session()
