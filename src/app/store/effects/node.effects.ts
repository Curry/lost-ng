import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { AppService } from '../../app.service';
import * as nodeActions from '../actions/node.action';

@Injectable()
export class NodeEffects {
  loadNodes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(nodeActions.getNodes),
      mergeMap(() =>
        this.service.getNodes().pipe(
          map((nodes) => nodeActions.loadNodes({ nodes: nodes })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(private actions$: Actions, private service: AppService) {}
}
