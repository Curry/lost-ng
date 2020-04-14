import { Injectable } from '@angular/core';
import {
  NodesGQL,
  Node,
  ConnectionsGQL,
  Connection,
  MoveNodeGQL,
  AddConnectionGQL,
} from './graphql';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(
    private nodes: NodesGQL,
    private connections: ConnectionsGQL,
    private move: MoveNodeGQL,
    private addConnection: AddConnectionGQL
  ) {}

  getNodes = () => {
    const queryRef = this.nodes.watch({ map: 1 });
    queryRef.startPolling(1000);
    return queryRef.valueChanges.pipe(map((val) => val.data.nodes as Node[]));
  };

  moveNode = (id: string, posX: number, posY: number) => {
    return this.move.mutate({ id: id, posX: posX, posY: posY });
  };

  getConnections = () => {
    const queryRef = this.connections.watch({ map: 1 });
    queryRef.startPolling(1000);
    return queryRef.valueChanges.pipe(
      map((val) => val.data.connections as Connection[])
    );
  };

  createConnection = (mapId: number, source: string, target: string) => {
    return this.addConnection
      .mutate({
        map: mapId,
        source,
        target,
      })
      .pipe(map((val) => val.data.addConnection as Connection));
  };
}
