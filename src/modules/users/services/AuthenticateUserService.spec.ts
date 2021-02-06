import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

import AppError from '@shared/erros/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;
let createUser: CreateUserService;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();
        authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
        createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
    })
    it('should be able to authenticate', async () => {
        await createUser.execute({
            name: 'John',
            email: 'john@example.com',
            password: '123456'
        })

        const response = await authenticateUser.execute({
            email: 'john@example.com',
            password: '123456'
        });

        expect(response).toHaveProperty('token');
    });

    it('should not be able to authenticate with wrong password', async () => {
        await createUser.execute({
            name: 'John',
            email: 'john@example.com',
            password: '123456'
        })

        expect(
            authenticateUser.execute({
                email: 'john@example.com',
                password: 'wrong-password'
            })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate with non existing user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

        expect(
            authenticateUser.execute({
                email: 'john@example.com',
                password: '123456'
            })).rejects.toBeInstanceOf(AppError);
    });
});