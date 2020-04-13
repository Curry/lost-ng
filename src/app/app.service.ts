import { Injectable } from '@angular/core';
import { NodesGQL, Node, ConnectionsGQL, Connection } from './graphql';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private nodes: NodesGQL, private connections: ConnectionsGQL) {}

  getNodes = () => {
    const queryRef = this.nodes.watch({ map: 1 });
    queryRef.startPolling(1000);
    return queryRef.valueChanges.pipe(map((val) => val.data.nodes as Node[]));
  };

  getConnections = () => {
    const queryRef = this.connections.watch({ map: 1 });
    queryRef.startPolling(1000);
    return queryRef.valueChanges.pipe(
      map((val) => val.data.connections as Connection[])
    );
  };
}
