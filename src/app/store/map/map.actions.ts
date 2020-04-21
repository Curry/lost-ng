import { Node, Connection } from 'src/app/graphql';

export namespace NodeActions {
  export class Add {
    static readonly type = '[Node] Add Node';
    constructor(public mapId: number, public systemId: number) {}
  }

  export class Load {
    static readonly type = '[Node] Load Nodes';
  }

  export class Move {
    static readonly type = '[Node] Move Node';
    constructor(public id: string, public posX: number, public posY: number) {}
  }

  export class Delete {
    static readonly type = '[Node] Delete Node';
    constructor(public systemId: number) {}
  }
}

export namespace ConnectionActions {
  export class Load {
    static readonly type = '[Connection] Load Connections';
  }

  export class Add {
    static readonly type = '[Connection] Add Connection';
    constructor(public source: string, public target: string) {}
  }

  export class Delete {
    static readonly type = '[Connection] Delete Connection';
    constructor(public source: string, public target: string) {}
  }
}

export namespace SocketActions {
  export class AddNode {
    static readonly type = '[Socket] Add Node';
    constructor(public node: Node) {}
  }

  export class AddConnection {
    static readonly type = '[Socket] Add Connection';
    constructor(public connection: Connection) {}
  }

  export class DeleteNode {
    static readonly type = '[Socket] Delete Node';
    constructor(public node: Node) {}
  }

  export class DeleteConnection {
    static readonly type = '[Socket] Delete Connection';
    constructor(public connection: Connection) {}
  }

  export class MoveNode {
    static readonly type = '[Socket] Move Node';
    constructor(public node: Node) {}
  }
}

export class Undo {
  static readonly type = 'Undo';
}

export class Redo {
  static readonly type = 'Redo';
}

export class Watch {
  static readonly type = 'Watch';
}
