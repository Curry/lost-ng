import { Injectable } from '@angular/core';
import { Connection } from './connection.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface ConnectionState extends EntityState<Connection> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'connection' })
export class ConnectionStore extends EntityStore<ConnectionState> {

  constructor() {
    super();
  }

}

