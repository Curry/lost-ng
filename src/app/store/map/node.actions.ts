export class Add {
  static readonly type = '[Node] Add Node';
  readonly type = '[Node] Add Node';
  constructor(
    public mapId: number,
    public systemId: number,
    public skipHistory = false
  ) {}
}

export class Move {
  static readonly type = '[Node] Move Node';
  readonly type = '[Node] Move Node';
  constructor(
    public id: string,
    public posX: number,
    public posY: number,
    public skipHistory = false
  ) {}
}

export class Delete {
  static readonly type = '[Node] Delete Node';
  readonly type = '[Node] Delete Node';
  constructor(public systemId: number, public skipHistory = false) {}
}
