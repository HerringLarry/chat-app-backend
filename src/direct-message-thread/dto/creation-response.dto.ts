import { DirectMessageThread } from 'direct-message-thread/direct-message-thread.entity';
export class CreationResponseDto{
    threadId: number;
    alreadyCreated: boolean;

    constructor( dMThread: DirectMessageThread, alreadyCreated: boolean ) {
        this.threadId = dMThread.id;
        this.alreadyCreated = alreadyCreated;
    }
}