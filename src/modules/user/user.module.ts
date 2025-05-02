import { Global, Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../entities/User.entity";
import { EmailModule } from '../email/email.module';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        EmailModule
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})

export class UserModule { }