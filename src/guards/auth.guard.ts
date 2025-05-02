import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { UserService } from "../modules/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        let request: Request = context.switchToHttp().getRequest();

        let token = request.headers.authorization || '';
        token = token.split(" ")[1];

        if (!token) throw new UnauthorizedException('Unauthorized');

        try {
            let payload = this.jwtService.verify(token);
            
            if (!payload.userId) {
                throw new UnauthorizedException('Invalid token payload');
            }

            let user = await this.userService.findById(payload.userId);

            if (!user) throw new UnauthorizedException('User not found');

            request['user'] = {
                id: user.id,
                email: user.email,
                role: user.role
            };

            return true;

        } catch (err) {
            console.error('AuthGuard Error:', err);
            throw new UnauthorizedException('Unauthorized');
        }
    }
}
