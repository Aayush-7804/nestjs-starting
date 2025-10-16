import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthUserDto {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Passwords will contain at least 1 upper case letter, 1 lower case letter and least 1 number or special character',
  })
  password: string;
}
