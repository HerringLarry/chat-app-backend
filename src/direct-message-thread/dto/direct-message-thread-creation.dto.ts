import { User } from 'users/user.entity';

export class DMThreadCreationDto{
    users: User[];
    currentUserId: number;
    groupName: string;
}