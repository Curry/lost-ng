import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Node } from './graphql';
import { addNode, deleteNode } from './store/actions/node.action';
import { NodeService } from './node.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'lost-ng';
  nodes = [];
  connections = [];
  nodes$: Observable<Node[]>;

  constructor(private nodeService: NodeService, private store: Store<{ nodes: Node[] }>) {
    this.nodes$ = store.select(select => select.nodes);
  }

  ngOnInit() {
    this.store.dispatch({ type: '[Node Page] Load Nodes' });
  }

  addNode() {
    const node = { id: [Math.random().toString(16).slice(2, 8)].toString() } as Node;
    this.nodeService.addDynamicNode(node);
    this.store.dispatch(addNode({ node: node }));
  }

  deleteNode() {
    this.store.dispatch(deleteNode());
  }
}
