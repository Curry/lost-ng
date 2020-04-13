import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { AppService } from '../../app.service';

@Injectable()
export class NodeEffects {
  loadNodes$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[Node Page] Load Nodes'),
      mergeMap(() =>
        this.service.getNodes().pipe(
          map((nodes) => ({
            type: '[Node] Load Nodes',
            nodes: nodes,
          })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(private actions$: Actions, private service: AppService) {}
}
