import { injectable } from 'inversify';

import { UserService } from './user.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './user.entity';

@injectable()
export class UserServiceImplementation implements UserService {
	public async validate(dto: UserLoginDto): Promise<boolean> {
		return false;
	}
	public async create({ email, password, name }: UserRegisterDto): Promise<User | null> {
		const newUser = new User(email, name);
		await newUser.setPassword(password);
		return newUser;
	}
}
