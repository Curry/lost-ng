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
  SyncConnectionGQL,
  SyncNodeGQL,
  NodeInput,
} from './graphql';
import { map, mergeMap, pluck, combineAll } from 'rxjs/operators';
import { Observable, of, forkJoin, from } from 'rxjs';

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
    private watch: WatchGQL,
    private syncConn: SyncConnectionGQL,
    private syncNode: SyncNodeGQL
  ) {}

  getData = (): Observable<[Node[], Connection[]]> =>
    forkJoin(this.getNodes(), this.getConnections());

  getNodes = (): Observable<Node[]> =>
    this.nodes.fetch({ map: 1 }).pipe(pluck('data', 'nodes'));

  createNode = (mapId: number, system: number): Observable<Node> =>
    this.addNode.mutate({ map: mapId, system }).pipe(pluck('data', 'addNode'));

  moveNode = (
    id: string,
    posX: number,
    posY: number
  ): Observable<Partial<Node>> =>
    this.move.mutate({ id, posX, posY }).pipe(pluck('data', 'moveNode'));

  removeNode = (
    systemId: number
  ): Observable<{
    node: string;
    connections: { id: string; source: string; target: string }[];
  }> =>
    this.deleteNode.mutate({ systemId }).pipe(
      pluck('data', 'deleteNodeBySystem'),
      mergeMap(
        (val) => this.removeConnectionByNode(val.id),
        (val1, val2) => ({
          node: val1.id,
          connections: val2 || [],
        })
      )
    );

  removeConnectionByNode = (
    nodeId: string
  ): Observable<{ id: string; source: string; target: string }[]> =>
    this.deleteConnectionByNode
      .mutate({ nodeId })
      .pipe(pluck('data', 'removeConnectionsByNode'));

  getConnections = (): Observable<Connection[]> =>
    this.connections.fetch({ map: 1 }).pipe(pluck('data', 'connections'));

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
      .pipe(pluck('data', 'addConnection'));

  removeConnection = (
    source: string,
    target: string
  ): Observable<{ id: string }> =>
    this.deleteConnection
      .mutate({ source, target })
      .pipe(pluck('data', 'removeConnection'));

  watchMap = (
    mapId: number
  ): Observable<{ type: string; node?: Node; connection?: Connection }> =>
    this.watch.subscribe({ mapId }).pipe(pluck('data', 'subscribe'));

  syncChanges = (nodes: Node[], connections: Connection[]) => {
    return forkJoin(
      from(nodes).pipe(
        map((node) =>
          this.syncNode
            .mutate({ node: (({ __typename, system, ...rest }) => rest)(node) })
            .pipe(pluck('data', 'syncNode'))
        ),
        combineAll()
      ),
      from(connections).pipe(
        map((connection) =>
          this.syncConn
            .mutate({
              connection: (({ __typename, ...rest }) => rest)(connection),
            })
            .pipe(pluck('data', 'syncConnection'))
        ),
        combineAll()
      )
    );
  };
}
