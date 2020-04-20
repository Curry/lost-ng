import { Component, OnInit, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { Connection, Node } from './graphql';
import { NodeService } from './node.service';
import { jsPlumbInstance } from 'jsplumb';
import { Store } from '@ngxs/store';
import { Select } from '@ngxs/store';
import { MapState } from './store/map/map.state';
import { ConnectionActions, NodeActions, Undo, Redo } from './store/map/map.actions';
import { NodeState } from './store/node/node.state';
import { AppService } from './app.service';

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
    if (event.ctrlKey && event.key === 'z') {
      this.undo();
    }
    if (event.ctrlKey && event.shiftKey && event.key === 'z') {
      this.redo();
    }
  }

  constructor(
    private store: Store,
    private service: NodeService,
    private appService: AppService,
    private state: NodeState,
  ) {
    this.jsPlumbInstance = this.service.jsPlumbInstance;
  }

  ngOnInit() {
    this.store.dispatch(new NodeActions.Load());
    this.store.dispatch(new ConnectionActions.Load());
    this.service.jsPlumbInstance.bind('connection', (info, event) => {
      if (event) {
        this.store.dispatch(new ConnectionActions.Add(info.sourceId, info.targetId));
      }
    });
    this.service.jsPlumbInstance.bind('connectionDetached', (info, event) => {
      if (event) {
        this.store.dispatch(new ConnectionActions.Remove(info.sourceId, info.targetId));
      }
    });
    this.appService.watchMap(1).subscribe(val => {
      console.log(val);
      this.store.dispatch(val);
    });
  }

  addNode() {
    this.store.dispatch(new NodeActions.Add(1, 31000060));
  }

  deleteNode() {
    this.store.dispatch(new NodeActions.Remove(31000060));
  }

  undo() {
    this.store.dispatch(Undo);
  }

  redo() {
    this.store.dispatch(Redo);
  }
}
