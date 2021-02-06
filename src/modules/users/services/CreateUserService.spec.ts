import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

import AppError from '@shared/erros/AppError';

let fakeUsersRepository: FakeUsersRepository
let fakeCacheProvider: FakeCacheProvider;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();
        createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
    });

    it('should be able to create a new user', async () => {
        const user = await createUser.execute({
            name: 'John',
            email: 'john@example.com',
            password: '123456'
        });

        expect(user).toHaveProperty('id');
    });

    it('should not be able to create a two or more users with the same email', async () => {
        await createUser.execute({
            name: 'John',
            email: 'john@example.com',
            password: '123456',
        });

        expect(
            createUser.execute({
                name: 'John',
                email: 'john@example.com',
                password: '123456'
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});