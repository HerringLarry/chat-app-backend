import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {

    constructor( private _memberService: MemberService ) {}

    @Get('/:searchTerm/:groupId')
    async searchForMembers( @Param('searchTerm') searchTerm: string, @Param('groupId') groupId: number ) {

        const results = await this._memberService.findMembersWithNameLike( searchTerm, groupId );

        return results;
    }

}
