import { StateRepository, Computed } from '@ngxs-labs/data/decorators';
import { State, Action, ActionType } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { NgxsDataEntityCollectionsRepository } from '@ngxs-labs/data/repositories';
import { createEntityCollections } from '@ngxs-labs/data/utils';
import { Node } from 'src/app/graphql';
import { AppService } from 'src/app/app.service';
import * as MapActions from '../map/map.actions';
import * as NodeActions from './node.actions';
import * as ConnectionActions from '../connection/connection.actions';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HistoryState2 } from '../history/history2.state';

@StateRepository()
@State({
  name: 'nodes1',
  defaults: createEntityCollections(),
})
@Injectable()
export class NodeState extends NgxsDataEntityCollectionsRepository<Node> {
  constructor(private service: AppService, private history: HistoryState2) {
    super();
  }

  @Computed()
  public get nodes$(): Observable<Node[]> {
    return this.entities$.pipe(map(Object.values));
  }

  @Action(MapActions.Load)
  load(): Observable<Node[]> {
    return this.service.getNodes().pipe(
      tap((nodes) => {
        this.setAll(nodes);
      })
    );
  }

  @Action(NodeActions.Add)
  add(
    _ctx: unknown,
    { mapId, systemId, skipHistory }: NodeActions.Add
  ): Observable<Node> {
    if (!skipHistory) {
      this.history.addHistory(
        [new NodeActions.Add(mapId, systemId, true)],
        [new NodeActions.Delete(systemId, true)]
      );
    }
    return this.service.createNode(mapId, systemId).pipe(
      tap((node) => {
        this.addOne(node);
      })
    );
  }

  @Action(NodeActions.Delete)
  delete(
    _ctx: unknown,
    { systemId, skipHistory }: NodeActions.Delete
  ): Observable<{
    node: string;
    connections: { id: string; source: string; target: string }[];
  }> {
    // if (!skipHistory) {
    //   this.history.addHistory(
    //     [new NodeActions.Delete(systemId, true)],
    //     [new NodeActions.Add(1, systemId)]
    //   );
    // }
    const actions: ActionType[] = [new NodeActions.Delete(systemId, true)];
    const inverseActions: ActionType[] = [
      new NodeActions.Add(1, systemId, true),
    ];
    return this.service.removeNode(systemId).pipe(
      tap(({ node, connections }) => {
        this.removeOne(node);
        connections.forEach(({ source, target }) => {
          const action = new ConnectionActions.Delete(source, target, true);
          const inverseAction = new ConnectionActions.Add(source, target, true);
          this.dispatch(action);
          actions.push(action);
          inverseActions.push(inverseAction);
        });
        if (!skipHistory) {
          this.history.addHistory(actions, inverseActions);
        }
      })
    );
  }

  @Action(NodeActions.Move)
  move(
    _ctx: unknown,
    { id, posX, posY, skipHistory }: NodeActions.Move
  ): Observable<Partial<Node>> {
    const { id: oId, posX: oPosX, posY: oPosY } = this.selectOne(id);
    if (!skipHistory) {
      this.history.addHistory(
        [new NodeActions.Move(id, posX, posY, true)],
        [new NodeActions.Move(oId, oPosX, oPosY, true)]
      );
    }
    return this.service.moveNode(id, posX, posY).pipe(
      tap(({ id, posX, posY }) => {
        this.updateOne({
          id,
          changes: {
            posX,
            posY,
          },
        });
      })
    );
  }
}
