import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as ConnectionActions from '../actions/connection.action';
import { Connection } from 'src/app/graphql';

export interface ConnectionState extends EntityState<Connection> {};

export const adapter: EntityAdapter<Connection> = createEntityAdapter<Connection>();

export const initialState: ConnectionState = adapter.getInitialState();

const connectionReducer = createReducer(
  initialState,
  on(ConnectionActions.addConnection, (state, { connection }) => adapter.addOne(connection, state)),
  on(ConnectionActions.resetConnections, (state) => adapter.removeAll(state)),
  on(ConnectionActions.loadConnections, (state, { connections }) => adapter.setAll(connections, state)),
)

export function reducer(state: ConnectionState | undefined, action: Action) {
  return connectionReducer(state, action);
}

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();
