/**
 * The required information to register a new user
 */
export class RegisterDto {
  username: string;
  password: string;
  birthdate: Date;
  fullname: string;
  email: string;
}
