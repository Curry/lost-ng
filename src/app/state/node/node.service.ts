import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { NodeStore } from './node.store';
import { Node } from './node.model';
import { map, tap } from 'rxjs/operators';
import { NodesGQL, MoveNodeGQL } from 'src/app/graphql';

@Injectable({ providedIn: 'root' })
export class NodeService {
  constructor(private nodeStore: NodeStore, private nodes: NodesGQL, private moveNode: MoveNodeGQL) {}

  get() {
    return this.nodes.fetch({ map: 1 }).pipe(
      map((val) => val.data.nodes as Node[]),
      tap((val) => this.nodeStore.set(val))
    );
  }

  watch() {
    const queryRef = this.nodes.watch({ map: 1 });
    queryRef.startPolling(1000);
    return queryRef.valueChanges.pipe(
      map((val) => val.data.nodes as Node[]),
      tap((val) => this.nodeStore.set(val))
    );
  }

  add(node: Node) {
    this.nodeStore.add(node);
  }

  move(id: string, posX: number, posY: number) {
    return this.moveNode.mutate({
      id,
      posX,
      posY
    });
  }

  update(id: string, node: Partial<Node>) {
    this.nodeStore.update(id, node);
  }

  remove(id: ID) {
    this.nodeStore.remove(id);
  }
}
