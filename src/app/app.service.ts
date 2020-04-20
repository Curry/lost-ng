import { Injectable } from '@angular/core';
import {
  NodesGQL,
  Node,
  ConnectionsGQL,
  Connection,
  MoveNodeGQL,
  AddConnectionGQL,
  AddNodeGQL,
  DeleteNodeGQL,
  RemoveConnectionGQL,
  DeleteConnectionByNodeGQL,
  WatchGQL,
} from './graphql';
import { map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private readonly POLL_RATE = 1000;

  constructor(
    private nodes: NodesGQL,
    private connections: ConnectionsGQL,
    private move: MoveNodeGQL,
    private addConnection: AddConnectionGQL,
    private addNode: AddNodeGQL,
    private deleteNode: DeleteNodeGQL,
    private deleteConnectionByNode: DeleteConnectionByNodeGQL,
    private deleteConnection: RemoveConnectionGQL,
    private watch: WatchGQL
  ) {}

  getNodes = () => {
    // const queryRef = this.nodes.watch({ map: 1 });
    // queryRef.startPolling(this.POLL_RATE);
    // return queryRef.valueChanges.pipe(map((val) => val.data.nodes as Node[]));
    return this.nodes
      .fetch({ map: 1 })
      .pipe(map((val) => val.data.nodes as Node[]));
  }

  createNode = (mapId: number, system: number) => {
    console.log('here');
    return this.addNode
      .mutate({ map: mapId, system })
      .pipe(map((val) => val.data.addNode));
  }

  moveNode = (id: string, posX: number, posY: number) => {
    return this.move
      .mutate({ id, posX, posY })
      .pipe(map((val) => val.data.moveNode));
  }

  removeNode = (systemId: number) => {
    return this.deleteNode.mutate({ systemId }).pipe(
      map((val) => val.data.deleteNodeBySystem),
      mergeMap(
        (val) => this.removeConnectionByNode(val.id),
        (val1, val2) => ({
          node: val1.id,
          connections: (val2 || []).map((conn) => conn.id),
        })
      )
    );
  }

  removeConnectionByNode = (nodeId: string) => {
    return this.deleteConnectionByNode
      .mutate({ nodeId })
      .pipe(map((val) => val.data.removeConnectionsByNode));
  }

  getConnections = () => {
    // const queryRef = this.connections.watch({ map: 1 });
    // queryRef.startPolling(this.POLL_RATE);
    // return queryRef.valueChanges.pipe(
    //   map((val) => val.data.connections as Connection[])
    // );
    return this.connections
      .fetch({ map: 1 })
      .pipe(map((val) => val.data.connections as Connection[]));
  }

  createConnection = (mapId: number, source: string, target: string) => {
    return this.addConnection
      .mutate({
        map: mapId,
        source,
        target,
      })
      .pipe(map((val) => val.data.addConnection as Connection));
  }

  removeConnection = (source: string, target: string) => {
    return this.deleteConnection
      .mutate({ map: 1, source, target })
      .pipe(map((val) => val.data.removeConnection));
  }

  watchMap = (mapId: number) =>
    this.watch.subscribe({ mapId }).pipe(
      map((val) => ({
        type: val.data.subscribe.type,
        node: val.data.subscribe.node,
        connection: val.data.subscribe.connection
      }))
    )
}
