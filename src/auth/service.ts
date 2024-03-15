import { IUser } from "../user/model";
import UserService from "../user/service";
import type * as jsonwebtoken from "jsonwebtoken";
declare type JWT = typeof jsonwebtoken;

class AuthService {

    constructor(
        private readonly UserService: UserService,
        private readonly jwt: any,
        private config: any
    ) { }

    login = async (user: Partial<IUser>) => {
        const loginAttempt = await this.UserService.login(user);

        if (loginAttempt.payload.banned) {
            loginAttempt.error = true;
            loginAttempt.internalMsg = "Error: User is banned";
            loginAttempt.errMsg
        }

        if (loginAttempt.error)
            return loginAttempt;

        loginAttempt.payload.token = this.jwt.sign(
            { sub: loginAttempt.payload._key },
            this.config.secret,
            { expiresIn: this.config.tokenExpiresIn }
        );
        return loginAttempt;
    }

}

export default AuthService;