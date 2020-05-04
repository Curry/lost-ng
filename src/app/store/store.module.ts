import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { CommonModule } from '@angular/common';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { environment as env } from '../../environments/environment';
import { MapState } from './map/map.state';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { HistoryState } from './history/history.state';
import { NodeState } from './node/node.state';
import { HistoryState2 } from './history/history2.state';
import { ConnectionState } from './connection/connection.state';

@NgModule({
  imports: [
    CommonModule,
    NgxsReduxDevtoolsPluginModule.forRoot({ disabled: env.production }),
    NgxsModule.forRoot(
      [MapState, HistoryState, NodeState, HistoryState2, ConnectionState],
      {
        developmentMode: !env.production,
      }
    ),
    NgxsDataPluginModule.forRoot(),
  ],
  providers: [
    // {
    //   provide: NGXS_PLUGINS,
    //   useClass: MapPlugin,
    //   multi: true,
    // },
  ],
  exports: [NgxsReduxDevtoolsPluginModule, NgxsModule],
})
export class NgxsStoreModule {}
