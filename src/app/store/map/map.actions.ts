import { Node } from 'src/app/graphql';

export namespace NodeActions {
  export class AddNode {
    static readonly type = '[Node] Add Node';
    constructor(public node: Node) {}
  }

  export class LoadNodes {
    static readonly type = '[Node] Load Nodes';
  }

  export class MoveNode {
    static readonly type = '[Node] Move Node';
    constructor(public id: string, public posX: number, public posY: number) {}
  }
}

export namespace ConnectionActions {
  export class LoadConnections {
    static readonly type = '[Connection] Load Connections';
  }

  export class AddConnection {
    static readonly type = '[Connection] Add Connection';
    constructor(public source: string, public target: string) {}
  }

  export class RemoveConnection {
    static readonly type = '[Connection] Remove Connection';
    constructor(public source: string, public target: string) {}
  }
}

export class Undo {
  static readonly type = 'Undo';
}

export class Redo {
  static readonly type = 'Redo';
}
