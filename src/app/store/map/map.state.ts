import { Injectable } from '@angular/core';
import {
  State,
  Action,
  StateContext,
  Selector,
} from '@ngxs/store';
import { Node, Connection } from 'src/app/graphql';
import { AppService } from 'src/app/app.service';
import { NodeActions, ConnectionActions } from './map.actions';
import { produce } from 'immer';
import { tap } from 'rxjs/operators';

export interface MapEntityModel {
  nodes: { [id: string]: Node };
  connections: { [id: string]: Connection };
}

@State<MapEntityModel>({
  name: 'nodes',
  defaults: {
    nodes: {},
    connections: {}
  },
})
@Injectable()
export class MapState {
  constructor(private service: AppService) {}

  @Selector()
  static nodes(state: MapEntityModel) {
    return Object.values(state.nodes);
  }

  @Selector()
  static connections(state: MapEntityModel) {
    return Object.values(state.connections);
  }

  @Action(NodeActions.Load)
  loadNodes(ctx: StateContext<MapEntityModel>) {
    return this.service.getNodes().pipe(
      tap((nodes) => {
        ctx.setState(
          produce((draft: MapEntityModel) => {
            nodes.forEach(node => {
              draft.nodes[node.id] = node;
            });
          })
        );
      })
    );
  }

  @Action(NodeActions.Move)
  moveNode(ctx: StateContext<MapEntityModel>, action: NodeActions.Move) {
    return this.service.moveNode(action.id, action.posX, action.posY).pipe(
      tap((val) => {
        ctx.setState(
          produce((draft: MapEntityModel) => {
            draft.nodes[val.id].posX = val.posX;
            draft.nodes[val.id].posY = val.posY;
          })
        );
      })
    );
  }

  @Action(NodeActions.Add)
  createNode(ctx: StateContext<MapEntityModel>, action: NodeActions.Add) {
    return this.service.createNode(action.mapId, action.systemId).pipe(
      tap((val) => {
        ctx.setState(
          produce((draft: MapEntityModel) => {
            draft.nodes[val.id] = val;
          })
        );
      })
    );
  }

  @Action(NodeActions.Remove)
  removeNode(ctx: StateContext<MapEntityModel>, action: NodeActions.Remove) {
    return this.service.removeNode(action.systemId).pipe(
      tap(val => {
        ctx.setState(
          produce((draft: MapEntityModel) => {
            delete draft.nodes[val];
          })
        );
      })
    );
  }

  @Action(ConnectionActions.Load)
  loadConnections(ctx: StateContext<MapEntityModel>) {
    return this.service.getConnections().pipe(
      tap((connections) => {
        ctx.setState(
          produce((draft: MapEntityModel) => {
            connections.forEach(conn => {
              draft.connections[conn.id] = conn;
            });
          })
        );
      })
    );
  }

  @Action(ConnectionActions.Add)
  addConnection(
    ctx: StateContext<MapEntityModel>,
    action: ConnectionActions.Add
  ) {
    return this.service.createConnection(1, action.source, action.target).pipe(
      tap((conn) => {
        ctx.setState(
          produce((draft: MapEntityModel) => {
            draft.connections[conn.id] = conn;
          })
        );
      })
    );
  }

  @Action(ConnectionActions.Remove)
  removeConnection(
    ctx: StateContext<MapEntityModel>,
    action: ConnectionActions.Remove
  ) {
    return this.service.removeConnection(action.source, action.target).pipe(
      tap(val => {
        ctx.setState(
          produce((draft: MapEntityModel) => {
            delete draft.connections[val.id];
          })
        );
      })
    );
  }
}
