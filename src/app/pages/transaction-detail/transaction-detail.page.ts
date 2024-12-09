import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
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
    private supabaseService: SupabaseService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
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
      this.showToast('Failed to load transaction details');
    } else if (data) {
      this.transaction = data;
    } else {
      this.showToast('Transaction not found');
      this.navCtrl.back();
    }
  }

  async editTransaction() {
    const alert = await this.alertController.create({
      header: 'Edit Transaction',
      inputs: [
        { name: 'amount', type: 'number', placeholder: 'Amount', value: this.transaction.amount },
        { name: 'description', type: 'text', placeholder: 'Description', value: this.transaction.description },
        { name: 'date', type: 'date', placeholder: 'Date', value: this.transaction.date },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save',
          handler: (data) => this.updateTransaction(this.transaction.id, data),
        },
      ],
    });
    await alert.present();
  }

  async updateTransaction(id: string, transactionData: any) {
    const loading = await this.loadingController.create({ message: 'Updating transaction...' });
    await loading.present();

    try {
      const { data, error } = await this.supabaseService.updateTransaction(id, transactionData);
      if (error) throw error;
      if (data && data.length > 0) {
        this.transaction = data[0];
        this.showToast('Transaction updated successfully');
      } else {
        throw new Error('No data returned from update');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      this.showToast('Failed to update transaction');
    } finally {
      loading.dismiss();
    }
  }

  async deleteTransaction() {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this transaction?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          handler: () => this.performDelete(this.transaction.id),
        },
      ],
    });
    await alert.present();
  }

  async performDelete(id: string) {
    const loading = await this.loadingController.create({ message: 'Deleting transaction...' });
    await loading.present();

    try {
      const { error } = await this.supabaseService.deleteTransaction(id);
      if (error) throw error;
      this.showToast('Transaction deleted successfully');
      this.navCtrl.navigateBack('/tabs/transactions');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      this.showToast('Failed to delete transaction');
    } finally {
      loading.dismiss();
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }

  goBack() {
    this.navCtrl.back();
  }
}

