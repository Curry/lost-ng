import { Component, OnInit, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { Connection, Node } from './graphql';
import { NodeService } from './node.service';
import { jsPlumbInstance } from 'jsplumb';
import { Store } from '@ngrx/store';
import * as connectionActions from './store/actions/connection.action';
import * as nodeActions from './store/actions/node.action';
import * as fromApp from './store';
import { take } from 'rxjs/operators';

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

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.keyCode === 90) {
      this.undo();
    }
    if (event.ctrlKey && event.shiftKey && event.keyCode === 90) {
      this.redo();
    }
  }

  constructor(
    private store: Store<fromApp.AppState>,
    private service: NodeService,
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
        this.store.dispatch(connectionActions.addConnection({
          connection: {
            id: Math.random().toString(),
            mapId: 1,
            source: sourceId,
            target: targetId,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        }));
        // this.store.dispatch(connectionActions.createConnection({ mapId: 1, source: sourceId, target: targetId }));
      }
    });
    this.service.jsPlumbInstance.bind('connectionDetached', (info, event) => {
      if (event) {
        const { sourceId, targetId } = info;
        this.store.select(fromApp.getConnectionByEndpoints, { source: sourceId, target: targetId }).pipe(take(1)).subscribe(val => {
          this.store.dispatch(connectionActions.deleteConnection({ id: val.id }));
        }).unsubscribe();
      }
    });
  }

  // addNode() {
  //   this.store.dispatch(nodeActions.ad).add({
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

  undo() {
    this.store.dispatch({ type: 'UNDO' });
  }

  redo() {
    this.store.dispatch({ type: 'REDO' });
  }
}
