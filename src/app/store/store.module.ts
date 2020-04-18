import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { CommonModule } from '@angular/common';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

import { environment as env } from '../../environments/environment';
import { MapState } from './map/map.state';

@NgModule({
  imports: [
    CommonModule,
    NgxsReduxDevtoolsPluginModule.forRoot({ disabled: env.production }),
    NgxsModule.forRoot([MapState], { developmentMode: !env.production })
  ],
  exports: [
    NgxsReduxDevtoolsPluginModule,
    NgxsModule
  ]
})
export class NgxsStoreModule {}
