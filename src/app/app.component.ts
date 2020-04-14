import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Connection, Node } from './graphql';
import { NodeService } from './node.service';
import * as fromApp from './store';
import * as connectionActions from './store/actions/connection.action';
import * as nodeActions from './store/actions/node.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'lost-ng';
  nodes$: Observable<Node[]>;
  connections$: Observable<Connection[]>;

  constructor(
    private store: Store<fromApp.AppState>,
    private service: NodeService
  ) {
    this.nodes$ = store.select(fromApp.getAllNodes);
    this.connections$ = store.select(fromApp.getAllConnections);
  }

  ngOnInit() {
    this.store.dispatch(nodeActions.getNodes());
    this.store.dispatch(connectionActions.getConnections());
    this.service.jsPlumbInstance.bind('connection', (info, event) => {
      if (event) {
        const { sourceId, targetId } = info;
        this.store.dispatch(
          connectionActions.createConnection({
            mapId: 1,
            source: sourceId,
            target: targetId,
          })
        );
      }
    });
  }

  addNode() {
    const node = {
      id: [Math.random().toString(16).slice(2, 8)].toString(),
      system: { systemName: '1' },
    } as Node;
    this.store.dispatch(nodeActions.addNode({ node }));
  }
}
