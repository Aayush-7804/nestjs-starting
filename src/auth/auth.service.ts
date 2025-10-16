import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUser } from './auth.entity';
import { Repository } from 'typeorm';
import { AuthUserDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/payload.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthUser)
    private readonly authUser: Repository<AuthUser>,
    private readonly jwt: JwtService,
  ) {}

  async signUp(authCredentialDto: AuthUserDto): Promise<void> {
    const { username, password } = authCredentialDto;
    const bcrypt = await import('bcrypt');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const userAuth = this.authUser.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.authUser.save(userAuth);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User already exists.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(
    authCredentialDto: AuthUserDto,
  ): Promise<{ message: string; token: { accessToken: string } }> {
    const { username, password } = authCredentialDto;
    const user = await this.authUser.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const bcrypt = await import('bcrypt');
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { username };
    const accessToken: string = this.jwt.sign(payload);

    return {
      message: 'Login successful!',
      token: { accessToken },
    };
  }
}
