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
