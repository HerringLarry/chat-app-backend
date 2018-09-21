export class PieceQuery {
    name: string;
    constructor( pieceName: string ){
        this.name = pieceName;
    }
}

export class PieceIdQuery {
    id: number;
    constructor( id: number ){
        this.id = id;
    }
}

export class UserQuery {
    username: string;
    constructor( username: string ) {
        this.username = username;
    }
}