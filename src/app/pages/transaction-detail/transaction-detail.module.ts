import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TransactionDetailPageRoutingModule } from './transaction-detail-routing.module';
import { TransactionDetailPage } from './transaction-detail.page';
import { MapComponent } from '../../components/map/map.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransactionDetailPageRoutingModule
  ],
  declarations: [TransactionDetailPage, MapComponent]
})
export class TransactionDetailPageModule {}

