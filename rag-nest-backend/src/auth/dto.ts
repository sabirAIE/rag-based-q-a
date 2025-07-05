import { IsEmail, IsNotEmpty, MinLength, IsString, IsIn, isNotEmpty } from 'class-validator';

export class SignupDTO{
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsIn(['admin', 'viewer'])
    role: string = 'viewer';
}