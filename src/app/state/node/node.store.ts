import { Injectable } from '@angular/core';
import { Node } from './node.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface NodeState extends EntityState<Node> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'node' })
export class NodeStore extends EntityStore<NodeState> {
  constructor() {
    super();
  }
}
