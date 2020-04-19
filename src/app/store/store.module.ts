import { NgModule } from '@angular/core';
import { NgxsModule, NGXS_PLUGINS } from '@ngxs/store';
import { CommonModule } from '@angular/common';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
// import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { environment as env } from '../../environments/environment';
import { MapState } from './map/map.state';
import { MapPlugin } from './map/map.plugin';


@NgModule({
  imports: [
    CommonModule,
    NgxsReduxDevtoolsPluginModule.forRoot({ disabled: env.production }),
    NgxsModule.forRoot([MapState], { developmentMode: !env.production }),
    // NgxsDataPluginModule.forRoot()
  ],
  providers: [{
    provide: NGXS_PLUGINS,
    useClass: MapPlugin,
    multi: true
  }],
  exports: [
    NgxsReduxDevtoolsPluginModule,
    NgxsModule
  ]
})
export class NgxsStoreModule {}
