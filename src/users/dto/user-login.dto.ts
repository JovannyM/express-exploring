import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Incorrect email' })
	public email!: string;

	@IsString({ message: 'Incorrect password' })
	public password!: string;
}
