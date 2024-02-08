import { Controller, Post, UseGuards } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('twitter')
export class TwitterController {
    constructor(private twitterService: TwitterService) { }

    @UseGuards(AuthGuard)
    @Post('day-quotes')
    createDayQuote() {
        const quote = this.twitterService.getDayQuote();
        return { text: quote };
    }
}
