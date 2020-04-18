import { Component, OnInit, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { Connection, Node } from './graphql';
import { NodeService } from './node.service';
import { jsPlumbInstance } from 'jsplumb';
import { Store } from '@ngxs/store';
import { Select } from '@ngxs/store';
import { MapState } from './store/map/map.state';
import { ConnectionActions, NodeActions, Undo, Redo } from './store/map/map.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'lost-ng';
  @Select(MapState.nodes) nodes$: Observable<Node[]>;
  @Select(MapState.connections) connections$: Observable<Connection[]>;
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
    private store: Store,
    private service: NodeService,
  ) {
    this.jsPlumbInstance = this.service.jsPlumbInstance;
  }

  ngOnInit() {
    this.store.dispatch(new NodeActions.LoadNodes());
    this.store.dispatch(new ConnectionActions.LoadConnections());
    this.service.jsPlumbInstance.bind('connection', (info, event) => {
      if (event) {
        this.store.dispatch(new ConnectionActions.AddConnection(info.sourceId, info.targetId));
      }
    });
    this.service.jsPlumbInstance.bind('connectionDetached', (info, event) => {
      if (event) {
        this.store.dispatch(new ConnectionActions.RemoveConnection(info.sourceId, info.targetId));
      }
    });
  }

  addNode() {
    this.store.dispatch(new NodeActions.AddNode({
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
    }));
  }

  // deleteNode() {
  //   this.ser.remove('potato');
  // }

  undo() {
    this.store.dispatch(Undo);
  }

  redo() {
    this.store.dispatch(Redo);
  }
}
