// import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { User } from '../user.entity';
import { TYPES } from '../../types';
import { PrismaService } from '../../storage/prisma.service';

import { UserRepository } from './user.repository';

import 'reflect-metadata';

@injectable()
export class UserRepositoryImplementation implements UserRepository {
	constructor(@inject(TYPES.PrismaService) private readonly prismaService: PrismaService) {}

	// async create({ email, name, password }: User): Promise<UserModel> {
	async create({ email, name, password }: User): Promise<undefined> {
		// return this.prismaService.client.userModel.create({
		// 	data: {
		// 		email,
		// 		password,
		// 		name,
		// 	},
		// });
		throw new Error();
	}

	// async find(email: string): Promise<UserModel | null> {
	async find(email: string): Promise<undefined> {
		// return this.prismaService.client.userModel.findFirst({ where: { email } });
		throw new Error();
	}
}
