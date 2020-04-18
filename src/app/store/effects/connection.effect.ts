import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { AppService } from '../../app.service';
import * as connectionActions from '../actions/connection.action';
@Injectable()
export class ConnectionEffects {
  loadConnections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(connectionActions.getConnections),
      mergeMap(() =>
      this.service.getConnections().pipe(
        map((connections) =>
          connectionActions.loadConnections({ connections })
        ),
        catchError(() => EMPTY)))
    )
  );

  createConnection$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(connectionActions.createConnection),
        mergeMap(({ mapId, source, target }) =>
          this.service.createConnection(mapId, source, target)
        )
      ),
    { dispatch: false }
  );

  removeConnect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(connectionActions.deleteConnection),
        mergeMap(({ source, target }) =>
          this.service.removeConnection(source, target)
        )
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private service: AppService,
  ) {}
}
