import { Thread } from "threads/thread.entity";

export class CreationResponseDto {
    threadId: number;
    alreadyCreated: boolean;

    constructor( thread: Thread, alreadyCreated: boolean ) {
        this.threadId = thread.id;
        this.alreadyCreated = alreadyCreated;
    }
}