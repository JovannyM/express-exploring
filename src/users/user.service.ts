import { User } from './user.entity';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';

export interface UserService {
	validate: (dto: UserLoginDto) => Promise<boolean>;
	create: (dto: UserRegisterDto) => Promise<User | null>;
}
