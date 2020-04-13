import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { AppService } from '../../app.service';
import * as connectionActions from '../actions/connection.action';

@Injectable()
export class ConnectionEffects {
  loadNodes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(connectionActions.getConnections),
      mergeMap(() =>
        this.service.getConnections().pipe(
          map((connections) =>
            connectionActions.loadConnections({ connections: connections })
          ),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(private actions$: Actions, private service: AppService) {}
}
