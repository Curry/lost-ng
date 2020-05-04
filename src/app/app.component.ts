import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostListener,
} from '@angular/core';
import { NodeService } from './node.service';
import { Store } from '@ngxs/store';
import { MapState } from './store/map/map.state';
import * as MapActions from './store/map/map.actions';
import * as NodeActions from './store/map/node.actions';
import * as ConnectionActions from './store/map/connection.actions';
import { NodeState } from './store/node/node.state';
import { HistoryState2 } from './store/history/history2.state';
import { ConnectionState } from './store/connection/connection.state';
import { HistoryState } from './store/history/history.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'lost-ng';

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'z') {
      this.history.undo();
    }
    if (event.ctrlKey && event.shiftKey && event.key === 'z') {
      this.history.redo();
    }
  }

  constructor(
    private store: Store,
    private service: NodeService,
    public state: MapState,
    public history: HistoryState,
    public node: NodeState,
    public connection: ConnectionState
  ) {
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

  ngOnInit(): void {
    this.store.dispatch(new MapActions.Load());
    this.store.dispatch(new MapActions.Watch());
  }

  addNode(): void {
    this.store.dispatch(new NodeActions.Add(1, 31000060));
  }

  deleteNode(): void {
    this.store.dispatch(new NodeActions.Delete(31000060));
  }
}
