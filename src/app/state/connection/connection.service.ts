import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { HttpClient } from '@angular/common/http';
import { ConnectionStore } from './connection.store';
import { Connection } from './connection.model';
import { tap, map } from 'rxjs/operators';
import { ConnectionsGQL, AddConnectionGQL, RemoveConnectionGQL } from 'src/app/graphql';

@Injectable({ providedIn: 'root' })
export class ConnectionService {
  constructor(
    private connectionStore: ConnectionStore,
    private connections: ConnectionsGQL,
    private addConnection: AddConnectionGQL,
    private removeConnection: RemoveConnectionGQL,
  ) {}

  get() {
    return this.connections.fetch({ map: 1 }).pipe(
      map((val) => val.data.connections as Connection[]),
      tap((connections) => {
        this.connectionStore.set(connections);
      })
    );
  }

  watch() {
    const queryRef = this.connections.watch({ map: 1 });
    queryRef.startPolling(1000);
    return queryRef.valueChanges.pipe(
      map((val) => val.data.connections as Connection[]),
      tap((val) => this.connectionStore.set(val))
    );
  }

  add(source: string, target: string) {
    return this.addConnection.mutate({
      map: 1,
      source,
      target,
    });
  }

  update(id, connection: Partial<Connection>) {
    this.connectionStore.update(id, connection);
  }

  remove(source: string, target: string) {
    return this.removeConnection.mutate({
      map: 1,
      source,
      target,
    });
  }
}
