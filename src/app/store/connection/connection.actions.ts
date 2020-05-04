export class Add {
  static readonly type = '[ConnectionEntity] Add Connection';
  readonly type = '[ConnectionEntity] Add Connection';
  constructor(
    public source: string,
    public target: string,
    public skipHistory = false
  ) {}
}

export class Delete {
  static readonly type = '[ConnectionEntity] Delete Connection';
  readonly type = '[ConnectionEntity] Add Connection';
  constructor(
    public source: string,
    public target: string,
    public skipHistory = false
  ) {}
}
