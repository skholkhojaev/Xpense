import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.page.html',
  styleUrls: ['./transaction-detail.page.scss'],
})
export class TransactionDetailPage implements OnInit {
  transaction: any;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private supabaseService: SupabaseService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTransaction(id);
    }
  }

  async loadTransaction(id: string) {
    const { data, error } = await this.supabaseService.getTransactionById(id);
    if (error) {
      console.error('Error loading transaction:', error);
    } else {
      this.transaction = data;
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}

