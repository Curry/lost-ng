import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as NodeActions from '../actions/node.action';
import { Node } from 'src/app/graphql';

export interface NodeState extends EntityState<Node> {}

export const adapter: EntityAdapter<Node> = createEntityAdapter<Node>()

export const initialState: NodeState =  adapter.getInitialState();

const nodeReducer = createReducer(
  initialState,
  on(NodeActions.resetNodes, (state) => adapter.removeAll(state)),
  on(NodeActions.addNode, (state, { node }) => adapter.addOne(node, state)),
  on(NodeActions.loadNodes, (state, { nodes }) => adapter.addMany(nodes, state)),
)

export function reducer(state: NodeState | undefined, action: Action) {
  return nodeReducer(state, action);
}

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();
