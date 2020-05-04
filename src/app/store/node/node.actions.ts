export class Add {
  static readonly type = '[NodeEntity] Add Node';
  readonly type = '[NodeEntity] Add Node';
  constructor(
    public mapId: number,
    public systemId: number,
    public skipHistory = false
  ) {}
}

export class Move {
  static readonly type = '[NodeEntity] Move Node';
  readonly type = '[NodeEntity] Move Node';
  constructor(
    public id: string,
    public posX: number,
    public posY: number,
    public skipHistory = false
  ) {}
}

export class Delete {
  static readonly type = '[NodeEntity] Delete Node';
  readonly type = '[NodeEntity] Delete Node';
  constructor(public systemId: number, public skipHistory = false) {}
}
