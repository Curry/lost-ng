import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { jsPlumbInstance } from 'jsplumb';
import { Node } from '../graphql';
import { AppState } from '../store';
import * as NodeActions from '../store/actions/node.action';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeComponent implements AfterViewInit {
  @Input() node: Node;

  @Input() jsPlumbInstance: jsPlumbInstance;

  constructor(private store: Store<AppState>) {}

  createEndpoints = () => {
    const exampleDropOptions = {
      tolerance: 'touch',
      hoverClass: 'dropHover',
      activeClass: 'dragActive',
    };
    const Endpoint1 = {
      endpoint: ['Dot', { radius: 6 }],
      paintStyle: { fill: '#3f51b5' },
      isSource: true,
      scope: 'jsPlumb_DefaultScope',
      connectorStyle: { stroke: '#3f51b5', strokeWidth: 3 },
      connector: ['Bezier', { curviness: 50 }],
      maxConnections: 30,
      isTarget: false,
      dropOptions: exampleDropOptions,
    };
    const Endpoint2 = {
      endpoint: ['Dot', { radius: 6 }],
      paintStyle: { fill: '#ff4081' },
      isSource: false,
      scope: 'jsPlumb_DefaultScope',
      maxConnections: 10,
      isTarget: true,
      dropOptions: exampleDropOptions,
    };
    const { id } = this.node;
    this.jsPlumbInstance.addEndpoint(
      id,
      // @ts-ignore
      { anchor: 'Right', uuid: id + '_bottom' },
      Endpoint1
    );
    this.jsPlumbInstance.addEndpoint(
      id,
      // @ts-ignore
      { anchor: 'Left', uuid: id + '_top' },
      Endpoint2
    );
  }

  ngAfterViewInit() {
    const { id } = this.node;
    this.createEndpoints();
    this.jsPlumbInstance.draggable(id, {
      stop: (val) =>
        this.store.dispatch(
          NodeActions.startMoveNode({
            id,
            posX: val.pos[0],
            posY: val.pos[1],
          })
        ),
    });
  }
}
