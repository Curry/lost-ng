import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { NodeComponent } from './node/node.component';
import { NodesContainerComponent } from './nodes-container/nodes-container.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgxsStoreModule } from './store/store.module';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    DragDropModule,
    MatButtonModule,
    MatCardModule,
    NgxsStoreModule
  ],
  declarations: [AppComponent, NodeComponent, NodesContainerComponent],
  entryComponents: [NodeComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
