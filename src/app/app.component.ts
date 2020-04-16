import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Connection, Node } from './graphql';
import { NodeService } from './node.service';
import { NodeService as nodeServ } from './state/node/node.service';
import { jsPlumbInstance } from 'jsplumb';
import { NodeQuery } from './state/node/node.query';
import { StateHistoryPlugin } from '@datorama/akita';
import { ConnectionService } from './state/connection/connection.service';
import { ConnectionQuery } from './state/connection/connection.query';

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
  connHistory: StateHistoryPlugin;

  constructor(
    private service: NodeService,
    private ser: nodeServ,
    private connectionService: ConnectionService,
    private nodeQuery: NodeQuery,
    private connQuery: ConnectionQuery
  ) {
    this.nodes$ = nodeQuery.nodes$;
    this.connections$ = connQuery.connections$;
    this.connections$.subscribe(val => console.log(val));
    this.jsPlumbInstance = this.service.jsPlumbInstance;
  }

  ngOnInit() {
    this.nodeHistory = new StateHistoryPlugin(this.nodeQuery);
    this.connHistory = new StateHistoryPlugin(this.connQuery);
    this.nodeHistory.ignoreNext();
    this.ser.watch().subscribe();
    this.connHistory.ignoreNext();
    this.connectionService.watch().subscribe();
    this.service.jsPlumbInstance.bind('connection', (info, event) => {
      if (event) {
        const { sourceId, targetId } = info;
        this.connectionService.add(sourceId, targetId).subscribe();
      }
    });
    this.service.jsPlumbInstance.bind('connectionDetached', (info, event) => {
      if (event) {
        const { sourceId, targetId } = info;
        this.connectionService.remove(sourceId, targetId).subscribe();
      }
    });
  }

  addNode() {
    this.ser.add({
      id: 'potato',
      mapId: 1,
      systemId: 31000718,
      posX: 190,
      posY: 70,
      system: {
        id: 31000718,
        systemName: 'potato',
        trueSec: 0,
        class: null,
        statics: []
      }
    });
  }

  deleteNode() {
    this.ser.remove('potato');
  }

  nodeUndo() {
    this.nodeHistory.undo();
  }

  nodeRedo() {
    this.nodeHistory.redo();
  }

  connUndo() {
    this.connHistory.undo();
  }

  connRedo() {
    this.connHistory.redo();
  }
}
