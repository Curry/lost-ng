import { Component, Input, AfterViewInit } from '@angular/core';
import { Node } from '../graphql';
import { jsPlumbInstance } from 'jsplumb';

@Component({
  selector: 'node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements AfterViewInit {
  @Input() node: Node;

  @Input() jsPlumbInstance: jsPlumbInstance;

  ngAfterViewInit() {
    const exampleDropOptions = {
      tolerance: 'touch',
      hoverClass: 'dropHover',
      activeClass: 'dragActive'
    };
    let Endpoint1 = {
      endpoint: ['Dot', { radius: 7 }],
      paintStyle: { fill: '#99cb3a' },
      isSource: true,
      scope: 'jsPlumb_DefaultScope',
      connectorStyle: { stroke: '#99cb3a', strokeWidth: 3 },
      connector: ['Bezier', { curviness: 50 }],
      maxConnections: 30,
      isTarget: false,
      connectorOverlays: [['Arrow', { location: 1 }]],
      dropOptions: exampleDropOptions
    };
    let Endpoint2 = {
      endpoint: ['Dot', { radius: 4 }],
      paintStyle: { fill: '#ffcb3a' },
      isSource: false,
      scope: 'jsPlumb_DefaultScope',
      maxConnections: 1,
      isTarget: true,
      dropOptions: exampleDropOptions
    };
    const { id } = this.node;
    // @ts-ignore
    this.jsPlumbInstance.addEndpoint(id, { anchor: 'Bottom', uuid: id + '_bottom' }, Endpoint1);
    // @ts-ignore
    this.jsPlumbInstance.addEndpoint(id, { anchor: 'Top', uuid: id + '_top' }, Endpoint2);
    this.jsPlumbInstance.draggable(id);
  }

}
