import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AccessToken } from 'src/types';
import { SignupDTO } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(body: SignupDTO) {
    const { email, password, username, role = 'viewer' } = body;
    const passwordHash = await bcrypt.hash(password, 10);
    return this.usersService.createUser(email, passwordHash, username, role);
  }

  async login(email, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: AccessToken = {
      sub: user.id,
      role: user.role,
      username: user.username,
      userId: user.id,
      email: user.email,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
