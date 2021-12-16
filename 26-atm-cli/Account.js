const fs = require("./FileSystem")

module.exports = class Account {
	constructor(name) {
		this.#name = name
	}

	#name
	#balance

	get name() {
		return this.#name
	}

	get balance() {
		return this.#balance
	}

	get filePath() {
		return `accounts/${this.#name}.txt`
	}

	async #load() {
		this.#balance = parseFloat(await fs.read(this.filePath))
	}

	async deposit(amount) {
		await fs.write(this.filePath, this.#balance + amount)
		this.#balance += amount
	}

	async withdraw(amount) {
		if (this.#balance - amount < 0) throw new Error()
		await fs.write(this.filePath, this.#balance - amount)
		this.#balance -= amount
	}

	static async find(accountName) {
		const account = new Account(accountName)
		try {
			await account.#load()
			return account
		} catch (error) {
			return
		}
	}

	static async create(accountName) {
		const newAccount = new Account(accountName)
		await fs.write(newAccount.filePath, 0)
		newAccount.#balance = 0
		return newAccount
	}
}
