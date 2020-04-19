import { Node } from 'src/app/graphql';

export namespace NodeActions {
  export class Add {
    static readonly type = '[Node] Add Node';
    constructor(public node: Node) {}
  }

  export class Create {
    static readonly type = '[Node] Create Node';
    constructor(public mapId: number, public systemId: number) {}
  }

  export class Load {
    static readonly type = '[Node] Load Nodes';
  }

  export class Move {
    static readonly type = '[Node] Move Node';
    constructor(public id: string, public posX: number, public posY: number) {}
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

  export class Remove {
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
