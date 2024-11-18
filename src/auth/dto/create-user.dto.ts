// src/auth/dto/create-user.dto.ts
export class CreateUserDto {
    telegramId: string;
    username: string;
    authDate: Date;
    authPayload: string;
    firstName: string;
    score: number;
  }
  
  // src/auth/dto/login.dto.ts
  export class LoginDto {
    authData: string;
  }