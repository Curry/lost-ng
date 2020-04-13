import * as fromNode from './node.reducer';
import * as fromConnection from './connection.reducer';
import {
  createSelector,
  ActionReducerMap,
  createFeatureSelector,
} from '@ngrx/store';

export interface AppState {
  nodes: fromNode.NodeState;
  connections: fromConnection.ConnectionState;
}

export const reducers: ActionReducerMap<AppState> = {
  nodes: fromNode.reducer,
  connections: fromConnection.reducer,
};

export const getAppState = createFeatureSelector<AppState>('app');

export const getNodeState = createSelector(
  getAppState,
  (state: AppState) => state.nodes
);

export const getConnectionState = createSelector(
  getAppState,
  (state: AppState) => state.connections
)

export const getNodeEntities = createSelector(
  getNodeState,
  fromNode.selectEntities
);

export const getAllNodes = createSelector(
  getNodeState,
  fromNode.selectAll
)

export const getConnectionEntities = createSelector(
  getConnectionState,
  fromConnection.selectEntities
)

export const getAllConnections = createSelector(
  getConnectionState,
  fromConnection.selectAll
)
