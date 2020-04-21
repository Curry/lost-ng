import { Node, Connection } from 'src/app/graphql';

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
