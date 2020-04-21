import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostListener,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Connection, Node } from './graphql';
import { NodeService } from './node.service';
import { jsPlumbInstance } from 'jsplumb';
import { Store } from '@ngxs/store';
import { Select } from '@ngxs/store';
import { MapState } from './store/map/map.state';
import * as MapActions from './store/map/map.actions';
import * as NodeActions from './store/map/node.actions';
import * as ConnectionActions from './store/map/connection.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'lost-ng';
  @Select(MapState.nodes) nodes$: Observable<Node[]>;
  @Select(MapState.connections) connections$: Observable<Connection[]>;
  @Select(MapState.undoDisabled) undoDisabled$: Observable<boolean>;
  @Select(MapState.redoDisabled) redoDisabled$: Observable<boolean>;
  jsPlumbInstance: jsPlumbInstance;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'z') {
      this.undo();
    }
    if (event.ctrlKey && event.shiftKey && event.key === 'z') {
      this.redo();
    }
  }

  constructor(private store: Store, private service: NodeService) {
    this.jsPlumbInstance = this.service.jsPlumbInstance;
  }

  ngOnInit(): void {
    this.store.dispatch(new NodeActions.Load());
    this.store.dispatch(new ConnectionActions.Load());
    this.store.dispatch(new MapActions.Watch());
    this.service.jsPlumbInstance.bind('connection', (info, event) => {
      if (event) {
        this.store.dispatch(
          new ConnectionActions.Add(info.sourceId, info.targetId)
        );
      }
    });
    this.service.jsPlumbInstance.bind('connectionDetached', (info, event) => {
      if (event) {
        this.store.dispatch(
          new ConnectionActions.Delete(info.sourceId, info.targetId)
        );
      }
    });
  }

  addNode(): void {
    this.store.dispatch(new NodeActions.Add(1, 31000060));
  }

  deleteNode(): void {
    this.store.dispatch(new NodeActions.Delete(31000060));
  }

  undo(): void {
    this.store.dispatch(MapActions.Undo);
  }

  redo(): void {
    this.store.dispatch(MapActions.Redo);
  }
}
