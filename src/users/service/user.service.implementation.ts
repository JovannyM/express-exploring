import { inject, injectable } from 'inversify';
import { UserModel } from '@prisma/client';
import e from 'express';

import { TYPES } from '../../types';
import { ConfigService } from '../../config/config.service';
import { UserRegisterDto } from '../dto/user-register.dto';
import { UserLoginDto } from '../dto/user-login.dto';
import { User } from '../user.entity';
import { UserRepository } from '../repository/user.repository';

import { UserService } from './user.service';

@injectable()
export class UserServiceImplementation implements UserService {
	constructor(
		@inject(TYPES.ConfigService) private readonly configService: ConfigService,
		@inject(TYPES.UserRepository) private readonly userRepository: UserRepository,
	) {}

	public async validate({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.userRepository.find(email);
		if (existedUser) {
			const newUser = new User(existedUser.email, existedUser.name, existedUser.password);
			return newUser.comparePassword(password);
		}
		return false;
	}

	public async create({ email, password, name }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = Number(this.configService.get('PASSWORD_SALT'));
		await newUser.setPassword(password, salt);
		const existedUser = await this.userRepository.find(email);
		if (existedUser) {
			return null;
		}
		return await this.userRepository.create(newUser);
	}
}
