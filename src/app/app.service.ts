import { Injectable } from '@angular/core';
import {
  Node,
  Connection,
  NodesGQL,
  ConnectionsGQL,
  MoveNodeGQL,
  AddConnectionGQL,
  AddNodeGQL,
  RemoveNodeGQL,
  RemoveConnectionGQL,
  RemoveConnectionByNodeGQL,
  WatchGQL,
} from './graphql';
import { map, mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(
    private nodes: NodesGQL,
    private connections: ConnectionsGQL,
    private move: MoveNodeGQL,
    private addConnection: AddConnectionGQL,
    private addNode: AddNodeGQL,
    private deleteNode: RemoveNodeGQL,
    private deleteConnectionByNode: RemoveConnectionByNodeGQL,
    private deleteConnection: RemoveConnectionGQL,
    private watch: WatchGQL
  ) {}

  getNodes = (): Observable<Node[]> =>
    this.nodes.fetch({ map: 1 }).pipe(map((val) => val.data.nodes as Node[]));

  createNode = (mapId: number, system: number): Observable<Node> =>
    this.addNode
      .mutate({ map: mapId, system })
      .pipe(map((val) => val.data.addNode));

  moveNode = (
    id: string,
    posX: number,
    posY: number
  ): Observable<Partial<Node>> =>
    this.move.mutate({ id, posX, posY }).pipe(map((val) => val.data.moveNode));

  removeNode = (
    systemId: number
  ): Observable<{ node: string; connections: string[] }> =>
    this.deleteNode.mutate({ systemId }).pipe(
      map((val) => val.data.deleteNodeBySystem),
      mergeMap(
        (val) => this.removeConnectionByNode(val.id),
        (val1, val2) => ({
          node: val1.id,
          connections: (val2 || []).map((conn) => conn.id),
        })
      )
    );

  removeConnectionByNode = (nodeId: string): Observable<{ id: string }[]> =>
    this.deleteConnectionByNode
      .mutate({ nodeId })
      .pipe(map((val) => val.data.removeConnectionsByNode));

  getConnections = (): Observable<Connection[]> =>
    this.connections
      .fetch({ map: 1 })
      .pipe(map((val) => val.data.connections as Connection[]));

  createConnection = (
    mapId: number,
    source: string,
    target: string
  ): Observable<Connection> =>
    this.addConnection
      .mutate({
        map: mapId,
        source,
        target,
      })
      .pipe(map((val) => val.data.addConnection as Connection));

  removeConnection = (
    source: string,
    target: string
  ): Observable<{ id: string }> =>
    this.deleteConnection
      .mutate({ source, target })
      .pipe(map((val) => val.data.removeConnection));

  watchMap = (
    mapId: number
  ): Observable<{ type: string; node?: Node; connection?: Connection }> =>
    this.watch.subscribe({ mapId }).pipe(map((val) => val.data.subscribe));
}
