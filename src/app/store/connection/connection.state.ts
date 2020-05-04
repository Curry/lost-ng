import { StateRepository, Computed } from '@ngxs-labs/data/decorators';
import { State, Action } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { NgxsDataEntityCollectionsRepository } from '@ngxs-labs/data/repositories';
import { createEntityCollections } from '@ngxs-labs/data/utils';
import { Connection } from 'src/app/graphql';
import { AppService } from 'src/app/app.service';
import * as MapActions from '../map/map.actions';
import * as ConnectionActions from './connection.actions';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HistoryState2 } from '../history/history2.state';

@StateRepository()
@State({
  name: 'connections1',
  defaults: createEntityCollections(),
})
@Injectable()
export class ConnectionState extends NgxsDataEntityCollectionsRepository<
  Connection
> {
  constructor(private service: AppService, private history: HistoryState2) {
    super();
  }

  @Computed()
  public get connections$(): Observable<Node[]> {
    return this.entities$.pipe(map(Object.values));
  }

  @Action(MapActions.Load)
  load(): Observable<Connection[]> {
    return this.service.getConnections().pipe(
      tap((conns) => {
        this.setAll(conns);
      })
    );
  }

  @Action(ConnectionActions.Add)
  add(
    _ctx: unknown,
    { source, target, skipHistory }: ConnectionActions.Add
  ): Observable<Connection> {
    if (!skipHistory) {
      this.history.addHistory(
        [new ConnectionActions.Add(source, target, true)],
        [new ConnectionActions.Delete(source, target, true)]
      );
    }
    return this.service.createConnection(1, source, target).pipe(
      tap((conn) => {
        this.addOne(conn);
      })
    );
  }

  @Action(ConnectionActions.Delete)
  delete(
    _ctx: unknown,
    { source, target, skipHistory }: ConnectionActions.Delete
  ): Observable<{ id: string }> {
    if (!skipHistory) {
      this.history.addHistory(
        [new ConnectionActions.Delete(source, target, true)],
        [new ConnectionActions.Add(source, target, true)]
      );
    }
    return this.service.removeConnection(source, target).pipe(
      tap(({ id }) => {
        this.removeOne(id);
      })
    );
  }
}
