import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ConnectionStore, ConnectionState } from './connection.store';

@Injectable({ providedIn: 'root' })
export class ConnectionQuery extends QueryEntity<ConnectionState> {
  connections$ = this.selectAll();

  constructor(protected store: ConnectionStore) {
    super(store);
  }

}
