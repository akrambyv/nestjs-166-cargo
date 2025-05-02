import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthRegisterDto } from "./dto/auth-register.dto";
import { AuthSignInDto } from "./dto/auth-signin.dto";
import { SkipThrottle, Throttle } from "@nestjs/throttler";
import { ApiResponse } from "@nestjs/swagger";

@Controller('auth')
@Throttle({
    default: {
        limit: 3,
        ttl: 10000,
    }
})
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @SkipThrottle()
    @ApiResponse({ status: 200, description: 'Uğurla giriş edildi' })
    @ApiResponse({ status: 401, description: 'Yanlış email və ya şifrə' })
    signIn(
        @Body() body: AuthSignInDto
    ) {
        return this.authService.signIn(body);
    }

    @Post('register')
    @ApiResponse({ status: 201, description: 'Hesab uğurla yaradıldı' })
    @ApiResponse({ status: 400, description: 'Yanlış məlumat' })
    @ApiResponse({ status: 409, description: 'Email artıq mövcuddur' })
    register(
        @Body() body: AuthRegisterDto
    ) {
        return this.authService.register(body);
    }
}