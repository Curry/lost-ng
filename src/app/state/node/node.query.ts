import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { NodeStore, NodeState } from './node.store';

@Injectable({ providedIn: 'root' })
export class NodeQuery extends QueryEntity<NodeState> {
  nodes$ = this.selectAll();

  constructor(protected store: NodeStore) {
    super(store);
  }
}
