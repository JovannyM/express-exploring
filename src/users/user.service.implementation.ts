import { inject, injectable } from 'inversify';

import { TYPES } from '../types';
import { ConfigService } from '../config/config.service';

import { UserService } from './user.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './user.entity';

@injectable()
export class UserServiceImplementation implements UserService {
	constructor(@inject(TYPES.ConfigService) private readonly configService: ConfigService) {}

	public async validate(dto: UserLoginDto): Promise<boolean> {
		return false;
	}

	public async create({ email, password, name }: UserRegisterDto): Promise<User | null> {
		const newUser = new User(email, name);
		const salt = Number(this.configService.get('PASSWORD_SALT'));
		await newUser.setPassword(password, salt);
		console.log(salt);
		return newUser;
	}
}
