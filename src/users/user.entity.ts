import { compare, hash } from 'bcryptjs';

export class User {
	private _password!: string;

	constructor(
		private readonly _email: string,
		private readonly _name: string,
		passwordHash?: string,
	) {
		if (passwordHash) {
			this._password = passwordHash;
		}
	}

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

	public async comparePassword(password: string) {
		if (this._password?.length > 0) {
			return compare(password, this._password);
		}
		return false;
	}
}
