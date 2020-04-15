import { Component, OnInit, ChangeDetectionStrategy, ComponentRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Connection, Node } from './graphql';
import { NodeService } from './node.service';
import * as fromApp from './store';
import * as connectionActions from './store/actions/connection.action';
import * as nodeActions from './store/actions/node.action';
import { jsPlumbInstance } from 'jsplumb';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'lost-ng';
  nodes$: Observable<Node[]>;
  connections$: Observable<Connection[]>;
  jsPlumbInstance: jsPlumbInstance;

  constructor(
    private store: Store<fromApp.AppState>,
    private service: NodeService
  ) {
    this.nodes$ = store.select(fromApp.getAllNodes);
    this.connections$ = store.select(fromApp.getAllConnections);
    this.jsPlumbInstance = this.service.jsPlumbInstance;
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
    this.service.jsPlumbInstance.bind('connectionDetached', (info, event) => {
      if (event) {
        const { sourceId, targetId } = info;
        this.store.dispatch(
          connectionActions.deleteConnection({
            source: sourceId,
            target: targetId,
          })
        );
      }
    });
  }

  addNode() {
    this.store.dispatch(nodeActions.addNode({ mapId: 1, system: 31000718 }));
  }

  deleteNode() {
    this.store.dispatch(nodeActions.deleteNode({ id: '5e97699f9bebb0235bf8f99c' }));
  }
}
