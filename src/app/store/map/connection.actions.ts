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
