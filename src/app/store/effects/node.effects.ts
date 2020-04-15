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
          map((nodes) => nodeActions.loadNodes({ nodes })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  moveNode$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(nodeActions.moveNode),
        mergeMap((val) => this.service.moveNode(val.id, val.posX, val.posY))
      ),
    { dispatch: false }
  );

  addNode$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(nodeActions.addNode),
        mergeMap(({ mapId, system }) => this.service.createNode(mapId, system))
      ),
    { dispatch: false }
  );

  removeNode$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(nodeActions.deleteNode),
        mergeMap(({ id }) => this.service.removeNode(id))
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private service: AppService) {}
}
