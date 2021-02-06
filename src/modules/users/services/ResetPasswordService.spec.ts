import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

import AppError from '@shared/erros/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokenRepository = new FakeUserTokenRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeUserTokenRepository = new FakeUserTokenRepository();

        resetPassword = new ResetPasswordService(fakeUsersRepository,  fakeUserTokenRepository, fakeHashProvider);
    });
    
    it('should be able to reset the password', async () => {
        let user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456'
        });

        const {token} = await fakeUserTokenRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPassword.execute({
            password: '123123',
            token,
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toBeCalledWith('123123')
        expect(updatedUser?.password).toBe('123123');
    });

    it('should not be able to reset the password with non-existing token', async () => {
        expect(
            resetPassword.execute({
                token: 'non-existing-token', 
                password: '123456'
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password with non-existing user', async () => {
        const {token} = await fakeUserTokenRepository.generate('non-existing-user');

        expect(
            resetPassword.execute({
                token, 
                password: '123456'
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password with expired token', async () => {
        let user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456'
        });

        const {token} = await fakeUserTokenRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPassword.execute({
            password: '123123',
            token,
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        jest.spyOn(Date, 'now').mockImplementation(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        })

        await expect(
            resetPassword.execute({
                password: '123123',
                token,
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});