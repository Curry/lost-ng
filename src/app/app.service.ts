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
  DeleteConnectionByNodeGQL
} from './graphql';
import { map, mergeMap } from 'rxjs/operators';

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
  ) {}

  getNodes = () => {
    const queryRef = this.nodes.watch({ map: 1 });
    queryRef.startPolling(this.POLL_RATE);
    return queryRef.valueChanges.pipe(map((val) => val.data.nodes as Node[]));
  }

  createNode = (mapId: number, system: number) => {
    return this.addNode.mutate({ map: mapId , system });
  }

  moveNode = (id: string, posX: number, posY: number) => {
    return this.move
      .mutate({ id, posX, posY })
      .pipe(map((val) => val.data.moveNode));
  }

  removeNode = (id: string) => {
    return this.deleteNode.mutate({ id }).pipe(
      mergeMap(val => this.removeConnectionByNode(id))
    );
  }

  removeConnectionByNode = (nodeId: string) => {
    return this.deleteConnectionByNode.mutate({ nodeId });
  }

  getConnections = () => {
    const queryRef = this.connections.watch({ map: 1 });
    queryRef.startPolling(this.POLL_RATE);
    return queryRef.valueChanges.pipe(map(val => val.data.connections as Connection[]));
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
    return this.deleteConnection.mutate({ map: 1, source, target });
  }
}
