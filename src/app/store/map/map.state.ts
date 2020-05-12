import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { Node, Connection } from 'src/app/graphql';
import { AppService } from 'src/app/app.service';
import * as MapActions from './map.actions';
import * as NodeActions from './node.actions';
import * as ConnectionActions from './connection.actions';
import * as SocketActions from './socket.actions';
import * as HistoryActions from '../history/history.actions';

import { produce, produceWithPatches, Draft, applyPatches, Patch } from 'immer';
import {
  tap,
  switchMap,
  mergeMap,
  map,
  catchError,
  debounceTime,
} from 'rxjs/operators';
import { Observable, timer, BehaviorSubject, never, forkJoin, of } from 'rxjs';
import {
  StateRepository,
  Computed,
  DataAction,
} from '@ngxs-labs/data/decorators';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';

export interface MapEntityModel {
  nodes: { [id: string]: Node };
  connections: { [id: string]: Connection };
}

@StateRepository()
@State<MapEntityModel>({
  name: 'map',
  defaults: {
    nodes: {},
    connections: {},
  },
})
@Injectable()
export class MapState extends NgxsDataRepository<MapEntityModel> {
  private ignoreSocket = false;
  private syncChanges$: BehaviorSubject<boolean>;

  constructor(private service: AppService) {
    super();
    this.syncChanges$ = new BehaviorSubject(false);
    this.syncChanges$
      .pipe(
        debounceTime(2500),
        mergeMap(() =>
          this.service.syncChanges(
            Object.values(this.getState().nodes),
            Object.values(this.getState().connections)
          )
        )
      )
      .subscribe(() => console.log('val'));
  }

  @Computed()
  public get nodes$(): Observable<Node[]> {
    return this.state$.pipe(map((state) => Object.values(state.nodes)));
  }

  @Computed()
  public get connections$(): Observable<Connection[]> {
    return this.state$.pipe(map((state) => Object.values(state.connections)));
  }

  @Action(MapActions.Load)
  load(ctx: StateContext<MapEntityModel>): Observable<boolean> {
    return forkJoin(
      this.service.getNodes(),
      this.service.getConnections()
    ).pipe(
      map(([nodes, connections]) => {
        ctx.setState(
          produce((draft: MapEntityModel) => {
            nodes.forEach((node) => {
              draft.nodes[node.id] = node;
            });
            connections.forEach((conn) => {
              draft.connections[conn.id] = conn;
            });
          })
        );
        return true;
      }),
      catchError(() => of(false))
    );
  }

  @Action(NodeActions.Move)
  moveNode(
    ctx: StateContext<MapEntityModel>,
    { id, posX, posY }: NodeActions.Move
  ): Observable<Partial<Node>> {
    this.ignoreSocket = true;
    return this.service.moveNode(id, posX, posY).pipe(
      tap((val) => {
        this.changeState(ctx, (draft) => {
          draft.nodes[val.id].posX = val.posX;
          draft.nodes[val.id].posY = val.posY;
        });
        this.ignoreSocket = false;
      })
    );
  }

  @Action(SocketActions.MoveNode)
  socketMoveNode(
    ctx: StateContext<MapEntityModel>,
    { props: { id, posX, posY } }: SocketActions.MoveNode
  ): void {
    ctx.setState((state) =>
      produce(state, (draft) => {
        draft.nodes[id].posX = posX;
        draft.nodes[id].posY = posY;
      })
    );
  }

  @Action(NodeActions.Add)
  addNode(
    ctx: StateContext<MapEntityModel>,
    action: NodeActions.Add
  ): Observable<Node> {
    this.ignoreSocket = true;
    return this.service.createNode(action.mapId, action.systemId).pipe(
      tap((node) => {
        this.changeState(ctx, (draft) => {
          if (!draft.nodes[node.id]) {
            draft.nodes[node.id] = node;
          }
        });
        this.ignoreSocket = false;
      })
    );
  }

  @Action(SocketActions.AddNode)
  socketAddNode(
    ctx: StateContext<MapEntityModel>,
    action: SocketActions.AddNode
  ): void {
    ctx.setState((state) =>
      produce(state, (draft) => {
        if (!draft.nodes[action.props.id]) {
          draft.nodes[action.props.id] = action.props;
        }
      })
    );
  }

  @Action(ConnectionActions.Add)
  addConnection(
    ctx: StateContext<MapEntityModel>,
    action: ConnectionActions.Add
  ): Observable<Connection> {
    this.ignoreSocket = true;
    return this.service.createConnection(1, action.source, action.target).pipe(
      tap((connection) => {
        this.changeState(ctx, (draft) => {
          if (!draft.connections[connection.id]) {
            draft.connections[connection.id] = connection;
          }
          this.ignoreSocket = false;
        });
      })
    );
  }

  @Action(SocketActions.AddConnection)
  socketAddConnection(
    ctx: StateContext<MapEntityModel>,
    action: SocketActions.AddConnection
  ): void {
    ctx.setState((state) =>
      produce(state, (draft) => {
        if (!draft.connections[action.props.id]) {
          draft.connections[action.props.id] = action.props;
        }
      })
    );
  }

  @Action(NodeActions.Delete)
  deleteNode(
    ctx: StateContext<MapEntityModel>,
    action: NodeActions.Delete
  ): Observable<{
    node: string;
    connections: {
      id: string;
      source: string;
      target: string;
    }[];
  }> {
    this.ignoreSocket = true;
    return this.service.removeNode(action.systemId).pipe(
      tap(({ node, connections }) => {
        this.changeState(ctx, (draft) => {
          delete draft.nodes[node];
          connections.forEach((conn) => {
            delete draft.connections[conn.id];
          });
        });
        this.ignoreSocket = false;
      })
    );
  }

  @Action(SocketActions.DeleteNode)
  socketDeleteNode(
    ctx: StateContext<MapEntityModel>,
    action: SocketActions.DeleteNode
  ): void {
    ctx.setState((state) =>
      produce(state, (draft) => {
        delete draft.nodes[action.props.id];
      })
    );
  }

  @Action(ConnectionActions.Delete)
  deleteConnection(
    ctx: StateContext<MapEntityModel>,
    action: ConnectionActions.Delete
  ): Observable<{ id: string }> {
    this.ignoreSocket = true;
    return this.service.removeConnection(action.source, action.target).pipe(
      tap((val) => {
        this.changeState(ctx, (draft) => {
          delete draft.connections[val.id];
        });
        this.ignoreSocket = false;
      })
    );
  }

  @Action(SocketActions.DeleteConnection)
  socketDeleteConnection(
    ctx: StateContext<MapEntityModel>,
    action: SocketActions.DeleteConnection
  ): void {
    ctx.setState((state) =>
      produce(state, (draft) => {
        delete draft.connections[action.props.id];
      })
    );
  }

  @Action(MapActions.Watch)
  watch(
    ctx: StateContext<MapEntityModel>
  ): Observable<{ type: string; node?: Node; connection?: Connection }> {
    return this.service.watchMap(1).pipe(
      tap((val) => {
        if (!this.ignoreSocket) {
          ctx.dispatch(val);
        }
      })
    );
  }

  @DataAction()
  update(patches: Patch[]): void {
    this.ctx.setState(applyPatches(this.ctx.getState(), patches));
    this.syncChanges$.next(true);
  }

  private changeState = (
    ctx: StateContext<MapEntityModel>,
    produceFn: (draft: Draft<MapEntityModel>) => void
  ): void => {
    const [newState, patches, inversePatches] = produceWithPatches(
      ctx.getState(),
      produceFn
    );
    ctx.setState(newState);
    ctx.dispatch(new HistoryActions.Add(patches, inversePatches));
  };
}
