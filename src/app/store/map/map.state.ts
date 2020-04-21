import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Node, Connection } from 'src/app/graphql';
import { AppService } from 'src/app/app.service';
import * as MapActions from './map.actions';
import * as NodeActions from './node.actions';
import * as ConnectionActions from './connection.actions';
import * as SocketActions from './socket.actions';
import {
  produce,
  Patch,
  enablePatches,
  applyPatches,
  produceWithPatches,
  Draft,
} from 'immer';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface MapEntityModel {
  nodes: { [id: string]: Node };
  connections: { [id: string]: Connection };
  history: History;
}

interface Patches {
  patches: Patch[];
  inversePatches: Patch[];
}

interface History {
  undone: Patches[];
  undoable: Patches[];
}

@State<MapEntityModel>({
  name: 'map',
  defaults: {
    nodes: {},
    connections: {},
    history: {
      undone: [],
      undoable: [],
    },
  },
})
@Injectable()
export class MapState {
  private ignoreSocket = false;
  constructor(private service: AppService) {
    enablePatches();
  }

  @Selector()
  static nodes(state: MapEntityModel): Node[] {
    return Object.values(state.nodes);
  }

  @Selector()
  static connections(state: MapEntityModel): Connection[] {
    return Object.values(state.connections);
  }

  @Selector()
  static undoDisabled(state: MapEntityModel): boolean {
    return state.history.undoable.length === 0;
  }

  @Selector()
  static redoDisabled(state: MapEntityModel): boolean {
    return state.history.undone.length === 0;
  }

  @Action(NodeActions.Load)
  loadNodes(ctx: StateContext<MapEntityModel>): Observable<Node[]> {
    return this.service.getNodes().pipe(
      tap((nodes) => {
        ctx.setState(
          produce((draft: MapEntityModel) => {
            nodes.forEach((node) => {
              draft.nodes[node.id] = node;
            });
          })
        );
      })
    );
  }

  @Action(ConnectionActions.Load)
  loadConnections(ctx: StateContext<MapEntityModel>): Observable<Connection[]> {
    return this.service.getConnections().pipe(
      tap((connections) => {
        ctx.setState(
          produce((draft: MapEntityModel) => {
            connections.forEach((conn) => {
              draft.connections[conn.id] = conn;
            });
          })
        );
      })
    );
  }

  @Action(NodeActions.Move)
  moveNode(
    ctx: StateContext<MapEntityModel>,
    action: NodeActions.Move
  ): Observable<Partial<Node>> {
    this.ignoreSocket = true;
    return this.service.moveNode(action.id, action.posX, action.posY).pipe(
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
    { node: { id, posX, posY } }: SocketActions.MoveNode
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
        if (!draft.nodes[action.node.id]) {
          draft.nodes[action.node.id] = action.node;
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
        if (!draft.connections[action.connection.id]) {
          draft.connections[action.connection.id] = action.connection;
        }
      })
    );
  }

  @Action(NodeActions.Delete)
  deleteNode(
    ctx: StateContext<MapEntityModel>,
    action: NodeActions.Delete
  ): Observable<{ node: string; connections: string[] }> {
    this.ignoreSocket = true;
    return this.service.removeNode(action.systemId).pipe(
      tap(({ node, connections }) => {
        this.changeState(ctx, (draft) => {
          delete draft.nodes[node];
          connections.forEach((conn) => {
            delete draft.connections[conn];
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
        delete draft.nodes[action.node.id];
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
        delete draft.connections[action.connection.id];
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

  @Action(MapActions.Undo)
  undo(ctx: StateContext<MapEntityModel>): void {
    if (ctx.getState().history.undoable.length > 0) {
      ctx.setState((state) =>
        applyPatches(
          produce(state, (draft) => {
            draft.history.undone.unshift(draft.history.undoable.shift());
          }),
          state.history.undoable[0].inversePatches
        )
      );
    }
  }

  @Action(MapActions.Redo)
  redo(ctx: StateContext<MapEntityModel>): void {
    if (ctx.getState().history.undone.length > 0) {
      ctx.setState((state) =>
        applyPatches(
          produce(state, (draft) => {
            draft.history.undoable.unshift(draft.history.undone.shift());
          }),
          state.history.undone[0].patches
        )
      );
    }
  }

  private changeState = (
    ctx: StateContext<MapEntityModel>,
    produceFn: (draft: Draft<MapEntityModel>) => void
  ): void => {
    const [newState, patches, inversePatches] = produceWithPatches(
      ctx.getState(),
      produceFn
    );
    ctx.setState(
      produce(newState, (draft) => {
        draft.history.undoable.unshift({ patches, inversePatches });
        draft.history.undone = [];
      })
    );
  };
}
