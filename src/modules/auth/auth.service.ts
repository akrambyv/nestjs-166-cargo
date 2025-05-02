import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthRegisterDto } from "./dto/auth-register.dto";
import { JwtService } from "@nestjs/jwt";
import { AuthSignInDto } from "./dto/auth-signin.dto";
import { compare, hash } from "bcrypt";
import { UserRole, Gender } from "../user/user.types";
import { UserEntity } from "../../entities/User.entity";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
    ) { }


    async signIn(params: AuthSignInDto) {
        let user = await this.userRepo.findOne({
            where: { email: params.email }
        });

        if (!user) throw new UnauthorizedException('Invalid email or password!');

        let checkPassword = await compare(params.password, user.password);
        if (!checkPassword) throw new UnauthorizedException('Invalid email or password!');

        const userId = parseInt(user.id.toString(), 10);
        if (isNaN(userId)) {
            throw new UnauthorizedException('Invalid user ID');
        }

        let token = this.jwtService.sign({
            userId: userId,
            role: user.role,
        });

        return {
            user: {
                ...user,
                password: undefined,
            },
            token,
        };
    }

    async register(params: AuthRegisterDto) {
        let checkEmail = await this.userRepo.findOne({
            where: { email: params.email }
        });

        if (checkEmail) throw new ConflictException('Email already exists!');

        const hashedPassword = await hash(params.password, 10);

        let user = this.userRepo.create({
            email: params.email,
            password: hashedPassword,
            firstName: params.firstName,
            lastName: params.lastName,
            gender: params.gender as Gender,
            role: UserRole.USER,
        });

        await this.userRepo.save(user);

        return {
            ...user,
            password: undefined
        };
    }
}