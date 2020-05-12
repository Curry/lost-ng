import { Node, Connection } from 'src/app/graphql';

export class AddNode {
  static readonly type = '[Socket] Add Node';
  constructor(public props: Node) {}
}

export class AddConnection {
  static readonly type = '[Socket] Add Connection';
  constructor(public props: Connection) {}
}

export class DeleteNode {
  static readonly type = '[Socket] Delete Node';
  constructor(public props: Node) {}
}

export class DeleteConnection {
  static readonly type = '[Socket] Delete Connection';
  constructor(public props: Connection) {}
}

export class MoveNode {
  static readonly type = '[Socket] Move Node';
  constructor(public props: Node) {}
}
