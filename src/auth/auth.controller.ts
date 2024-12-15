// auth.controller.ts

import { Controller, Post, UnauthorizedException, Headers, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PublicRoute } from "../decorators/public-route.decorator"

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

    @PublicRoute()
    @Post("authenticate")
    async login(@Body() body: { initData: string }) {
      // console.log(body.initData)
        return await this.authService.login(body.initData)
    }

}