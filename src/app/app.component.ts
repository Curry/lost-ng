import { Component, OnInit, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { Connection, Node } from './graphql';
import { NodeService } from './node.service';
import { NodeService as nodeServ } from './state/node/node.service';
import { jsPlumbInstance } from 'jsplumb';
import { NodeQuery } from './state/node/node.query';
import { StateHistoryPlugin } from './state/custom/stateHistoryTest';
import { ConnectionService } from './state/connection/connection.service';
import { ConnectionQuery } from './state/connection/connection.query';
import { AkitaMultiPlugin } from './state/custom/plugin';
import { Store } from '@ngrx/store';
// import { StateHistoryPlugin } from '@datorama/akita';import * as fromApp from './store';
import * as connectionActions from './store/actions/connection.action';
import * as nodeActions from './store/actions/node.action';
import * as fromApp from './store';

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
  nodeHistory: StateHistoryPlugin;
  // connHistory: StateHistoryPlugin;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // console.log(event);
    // if (event.ctrlKey && event.keyCode === 90) {
    //   this.nodeUndo();
    // }
    // if (event.ctrlKey && event.shiftKey && event.keyCode === 90) {
    //   this.nodeRedo();
    // }
  }

  constructor(
    private store: Store<fromApp.AppState>,
    private service: NodeService,
    // private ser: nodeServ,
    // private connectionService: ConnectionService,
    // private nodeQuery: NodeQuery,
    // private connQuery: ConnectionQuery
  ) {
    // this.nodes$ = nodeQuery.nodes$;
    // this.connections$ = connQuery.connections$;
    this.nodes$ = store.select(fromApp.getAllNodes);
    this.connections$ = store.select(fromApp.getAllConnections);
    this.jsPlumbInstance = this.service.jsPlumbInstance;
  }

  ngOnInit() {
    // this.nodeHistory = new StateHistoryPlugin(this.nodeQuery);
    // this.connHistory = new StateHistoryPlugin(this.connQuery);
    // this.nodeHistory.ignoreNext();
    // this.ser.get().subscribe();
    // this.connHistory.ignoreNext();
    // this.connectionService.watch().subscribe();
    // this.nodes$.subscribe(console.log);
    // this.connectionService.onAdd().subscribe();
    // const t =  new AkitaMultiPlugin([this.nodeQuery, this.connQuery]);
    this.store.dispatch(nodeActions.getNodes());
    this.store.dispatch(connectionActions.getConnections());
    this.service.jsPlumbInstance.bind('connection', (info, event) => {
      if (event) {
        const { sourceId, targetId } = info;
        this.store.dispatch(connectionActions.createConnection({ mapId: 1, source: sourceId, target: targetId }));
        // this.connectionService.add(sourceId, targetId).subscribe();
      }
    });
    this.service.jsPlumbInstance.bind('connectionDetached', (info, event) => {
      if (event) {
        const { sourceId, targetId } = info;
        // this.connectionService.remove(sourceId, targetId).subscribe();
        this.store.dispatch(connectionActions.deleteConnection({ source: sourceId, target: targetId }));
      }
    });
  }

  // addNode() {
  //   this.ser.add({
  //     id: 'potato',
  //     mapId: 1,
  //     systemId: 31000718,
  //     posX: 190,
  //     posY: 70,
  //     system: {
  //       id: 31000718,
  //       systemName: 'potato',
  //       trueSec: 0,
  //       class: null,
  //       statics: []
  //     }
  //   });
  // }

  // deleteNode() {
  //   this.ser.remove('potato');
  // }

  nodeUndo() {
    // this.nodeHistory.undo();
    this.store.dispatch({ type: 'UNDO' });
  }

  nodeRedo() {
    // this.nodeHistory.redo();
    this.store.dispatch({ type: 'REDO' });
  }

  // connUndo() {
  //   this.connHistory.undo();
  // }

  // connRedo() {
  //   this.connHistory.redo();
  // }

  // hasNodeUndo() {
  //   return this.nodeHistory.hasPast;
  // }

  // hasNodeRedo() {
  //   return this.nodeHistory.hasFuture;
  // }

//   hasConnUndo() {
//     return this.connHistory.hasPast;
//   }

//   hasConnRedo() {
//     return this.connHistory.hasFuture;
//   }
}
