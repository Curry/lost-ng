import { createReducer, on, Action } from '@ngrx/store';
import * as NodeActions from '../actions/node.action';
import { Node } from 'src/app/graphql';

export const initalState: Node[] = []

const nodeReducer = createReducer(
  initalState,
  on(NodeActions.addNode, (state, { node }) => ([...state, node])),
  on(NodeActions.deleteNode, (state) => (state.slice(0, state.length - 1))),
  on(NodeActions.loadNodes, (state, { nodes }) => (nodes))
)

export function reducer(state: Node[] | undefined, action: Action) {
  return nodeReducer(state, action);
}
