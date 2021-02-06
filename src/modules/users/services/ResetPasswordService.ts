import {injectable, inject } from 'tsyringe';
import {isAfter, addHours} from 'date-fns';

//import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokenRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import AppError from '@shared/erros/AppError';

interface IRequest{
    token: string;
    password: string;
}

@injectable()
class ResetPasswordService{
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        
        @inject('UserTokensRepository')
        private userTokenRepository: IUserTokenRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider
        ){}

    public async execute({token, password}: IRequest): Promise<void>{
        const userToken = await this.userTokenRepository.findByToken(token);

        if(!userToken){
            throw new AppError('User token does not exist');
        }

        const user = await this.usersRepository.findById(userToken.user_id);

        if(!user){
            throw new AppError('User does not exists');
        }

        const tokenCreatedAt = userToken.created_at;
        const compareDate = addHours(tokenCreatedAt, 2);

        if(isAfter(Date.now(), compareDate)){
            throw new AppError('Token expired.');
        }

        user.password = await this.hashProvider.generateHash(password);

        await this.usersRepository.save(user);
    }
}

export default ResetPasswordService;