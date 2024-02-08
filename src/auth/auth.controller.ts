import { Body, Controller, HttpCode, HttpStatus, Logger, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('oauth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @HttpCode(HttpStatus.UNAUTHORIZED)
    @Post('token')
    getToken(@Body() tokenDto: Record<string, any>): Promise<{ access_token: string }> {
        const func = "getToken";
        try {
            if (!tokenDto.clientId || !tokenDto.clientSecret) {
                throw new UnauthorizedException();
            }
            const clientId: number = tokenDto.clientId as number;
            let isAuth: boolean = false;
            let username: string;
            if (clientId == 1) {
                isAuth = tokenDto.clientSecret == process.env.CLIENT_SECRET;
                username = "Kiratae's iPhone 14 Pro";
            }
            if (!isAuth) {
                throw new UnauthorizedException();
            }
            return this.authService.getAccessToken(clientId, username);
        } catch (ex) {
            if (ex instanceof UnauthorizedException) {
                this.logger.warn(`${func}: UnauthorizedException caugth with client id ${tokenDto.clientId}. ${ex.message}`);
            } else if (ex instanceof Error) {
                this.logger.error(`${func}: Exception caugth with client id ${tokenDto.clientId}. ${ex.message}`);
            }
            throw ex;
        }
    }
}
