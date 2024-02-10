import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import addOAuthInterceptor, { OAuthInterceptorConfig } from 'axios-oauth-1.0a';

@Injectable()
export class TwitterService {
    private readonly logger = new Logger(TwitterService.name);
    private readonly endpoint: string = 'https://api.twitter.com/2';

    constructor(private httpService: HttpService) { }

    async createTweet(text: string): Promise<string> {
        const func = "createTweet";
        try {
            const options: OAuthInterceptorConfig = {
                algorithm: "HMAC-SHA1",
                includeBodyHash: false,
                key: process.env.TWITTER_CONSUMER_KEY,
                secret: process.env.TWITTER_CONSUMER_SECRET,
                token: process.env.TWITTER_ACCESS_TOKEN,
                tokenSecret: process.env.TWITTER_TOKEN_SECRET
            };

            // Add interceptor that signs requests
            addOAuthInterceptor(this.httpService.axiosRef, options);

            const response = await this.httpService.axiosRef.post(`${this.endpoint}/tweets`, { text });
            if (response.status == HttpStatus.CREATED) {
                return response.data.data.id;
            }
        } catch (ex) {
            if (ex instanceof AxiosError && ex.response.status == 403) {
                this.logger.log(`${func}: AxiosError caught. ${ex}`);
                return null;
            } else {
                this.logger.log(`${func}: Exception caught. ${ex}`);
                throw ex;
            }
        }
    }
}
