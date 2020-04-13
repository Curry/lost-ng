import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Node, Connection } from './graphql';
import * as nodeActions from './store/actions/node.action';
import * as connectionActions from './store/actions/connection.action';
import * as fromApp from './store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'lost-ng';
  nodes$: Observable<Node[]>;
  connections$: Observable<Connection[]>;

  constructor(private store: Store<fromApp.AppState>) {
    this.nodes$ = store.select(fromApp.getAllNodes);
    this.connections$ = store.select(fromApp.getAllConnections);
  }

  ngOnInit() {
    this.store.dispatch(nodeActions.getNodes());
  }

  ngAfterViewInit() {
    this.store.dispatch(connectionActions.getConnections());
  }

  addNode() {
    const node = {
      id: [Math.random().toString(16).slice(2, 8)].toString(),
      system: { systemName: '1' },
    } as Node;
    this.store.dispatch(nodeActions.addNode({ node: node }));
  }

  deleteNode() {
    this.store.dispatch(nodeActions.resetNodes());
  }
}
