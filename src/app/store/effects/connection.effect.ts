import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { AppService } from '../../app.service';

@Injectable()
export class ConnectionEffects {
  loadNodes$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[Connection Page] Load Connections'),
      mergeMap(() =>
        this.service.getConnections().pipe(
          map((connections) => ({
            type: '[Connection] Load Connections',
            connections: connections,
          })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(private actions$: Actions, private service: AppService) {}
}
