import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { User } from '../user.entity';
import { TYPES } from '../../types';
import { PrismaService } from '../../storage/prisma.service';

import { UserRepository } from './user.repository';

import 'reflect-metadata';

@injectable()
export class UserRepositoryImplementation implements UserRepository {
	constructor(@inject(TYPES.PrismaService) private readonly prismaService: PrismaService) {}

	async create({ email, name, password }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				password,
				name,
			},
		});
	}

	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({ where: { email } });
	}
}
