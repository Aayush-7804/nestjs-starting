import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('/signup')
  async signUp(@Body() authData: AuthUserDto): Promise<void> {
    return await this.auth.signUp(authData);
  }

  @Post('/signin')
  @HttpCode(200)
  async signIn(
    @Body() authData: AuthUserDto,
  ): Promise<{ message: string; token: { accessToken: string } }> {
    return await this.auth.signIn(authData);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log(req);
  }
}
