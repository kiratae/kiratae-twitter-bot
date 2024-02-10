import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly jwtService: JwtService
    ) { }

    async getAccessToken(
        clientId: number,
        username: string,
    ): Promise<{ access_token: string }> {
        const func = "getAccessToken";
        try {
            const payload = { sub: clientId, username: username };
            return { 
                access_token: await this.jwtService.signAsync(payload) 
            };
        } catch (ex) {
            this.logger.log(`${func}: Exception caught with client id ${clientId}.`);
            throw ex;
        }
    }
}
