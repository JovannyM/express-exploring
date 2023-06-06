import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Incorrect email' })
	public email!: string;

	@IsString({ message: 'Incorrect password' })
	public password!: string;

	@IsString({ message: 'Incorrect name' })
	public name!: string;
}
