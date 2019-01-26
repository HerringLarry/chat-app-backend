export class MultiInviteDto {
    groupId: number;
    fromUserId: number;
    toUserIds: number[] = [];
}
