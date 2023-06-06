import { hash } from 'bcryptjs';

export class User {
	private _password!: string;

	constructor(private readonly _email: string, private readonly _name: string) {}

	public get email() {
		return this._email;
	}

	public get name() {
		return this._name;
	}

	public get password() {
		return this._password;
	}

	public async setPassword(password: string, salt: number) {
		this._password = await hash(password, 10);
	}
}
