import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Store } from '@ngrx/store';
import { Node, Connection } from './graphql';
import { addNode, resetNodes } from './store/actions/node.action';
import { NodeService } from './node.service';
import { AppState } from './store/reducers';
import * as fromApp from './store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'lost-ng';
  nodes$: Observable<Node[]>;
  connections$: Observable<Connection[]>;

  constructor(private store: Store<AppState>) {
    this.nodes$ = store.select(fromApp.getAllNodes);
    this.connections$ = store.select(fromApp.getAllConnections)
  }

  ngOnInit() {
    this.store.dispatch({ type: '[Node Page] Load Nodes' });
    console.log('1', new Date().getMilliseconds());
  }

  ngAfterViewInit() {
    this.store.dispatch({ type: '[Connection Page] Load Connections' });
    console.log('2', new Date().getMilliseconds());
  }

  addNode() {
    const node = { id: [Math.random().toString(16).slice(2, 8)].toString(), system: { systemName: '1'} } as Node;
    this.store.dispatch(addNode({ node: node }));
  }

  deleteNode() {
    this.store.dispatch(resetNodes());
  }
}
