import { AfterViewInit, Component, Input } from '@angular/core';
import { jsPlumbInstance } from 'jsplumb';
import { Node } from '../graphql';
import { timer } from 'rxjs';
import { Store } from '@ngxs/store';
import { NodeActions } from '../store/map/map.actions';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
})
export class NodeComponent implements AfterViewInit {
  @Input() node: Node;

  @Input() jsPlumbInstance: jsPlumbInstance;

  clickable = true;

  constructor(private store: Store) {}

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
      start: (val) => {
        this.clickable = false;
      },
      stop: (val) => {
        this.store.dispatch(new NodeActions.MoveNode(id, val.pos[0], val.pos[1]));
        timer(500).subscribe(() => {
          this.clickable = true;
        });
      },
    });
  }

  onClick = () => {
    console.log(this.clickable);
  }
}
