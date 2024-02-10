import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('twitters')
export class TwitterController {
    constructor(private twitterService: TwitterService) { }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @HttpCode(HttpStatus.BAD_REQUEST)
    @Post()
    async createTweet(@Body() dataDto: Record<string, any>) {
        if (!dataDto.text) throw new BadRequestException();
        const tweetId = await this.twitterService.createTweet(dataDto.text);
        return { tweetId };
    }
}
