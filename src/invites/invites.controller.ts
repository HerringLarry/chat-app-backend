import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { Invite } from './invites.entity';
import { InviteDto } from './dto/invites.dto';
import { ResponseDto } from './dto/response.dto';
import { ModifiedInviteDto } from './helpers/helpers';

@Controller('invites')
export class InvitesController {

    constructor( private _invitesService: InvitesService ) {}

    @Get('/:username')
    async getAllInvitesForUser(@Param('username') username: string ): Promise<Invite[]> {
        return await this._invitesService.getAllInvitesForUser(username);
    }

    @Post('/invite')
    async createInvite(@Body() inviteDto: ModifiedInviteDto ): Promise<void> {
        await this._invitesService.createInvite( inviteDto );
    }

    @Post('/respond')
    async respondToInvite( @Body() responseDto: ResponseDto ): Promise<void> {
        await this._invitesService.respondToInvite( responseDto );
    }

    @Get('/:searchTerm/:groupId')
    async searchForNonMembersAndNonInvitees( @Param('searchTerm') searchTerm: string, @Param('groupId') groupId: number ) {
        return await this._invitesService.getListOfRelevantUsers( searchTerm, groupId );
    }
}
