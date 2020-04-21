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

  getNodes = () =>
    this.nodes.fetch({ map: 1 }).pipe(map((val) => val.data.nodes as Node[]))

  createNode = (mapId: number, system: number) =>
    this.addNode
      .mutate({ map: mapId, system })
      .pipe(map((val) => val.data.addNode))

  moveNode = (id: string, posX: number, posY: number) =>
    this.move.mutate({ id, posX, posY }).pipe(map((val) => val.data.moveNode))

  removeNode = (systemId: number) =>
    this.deleteNode.mutate({ systemId }).pipe(
      map((val) => val.data.deleteNodeBySystem),
      mergeMap(
        (val) => this.removeConnectionByNode(val.id),
        (val1, val2) => ({
          node: val1.id,
          connections: (val2 || []).map((conn) => conn.id),
        })
      )
    )

  removeConnectionByNode = (nodeId: string) =>
    this.deleteConnectionByNode
      .mutate({ nodeId })
      .pipe(map((val) => val.data.removeConnectionsByNode))

  getConnections = () =>
    this.connections
      .fetch({ map: 1 })
      .pipe(map((val) => val.data.connections as Connection[]))

  createConnection = (mapId: number, source: string, target: string) =>
    this.addConnection
      .mutate({
        map: mapId,
        source,
        target,
      })
      .pipe(map((val) => val.data.addConnection as Connection))

  removeConnection = (source: string, target: string) =>
    this.deleteConnection
      .mutate({ source, target })
      .pipe(map((val) => val.data.removeConnection))

  watchMap = (mapId: number) =>
    this.watch.subscribe({ mapId }).pipe(
      map((val) => ({
        type: val.data.subscribe.type,
        node: val.data.subscribe.node,
        connection: val.data.subscribe.connection,
      }))
    )
}
