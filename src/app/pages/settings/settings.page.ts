import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { SupabaseService } from '../../services/supabase.service';
import { Subscription } from 'rxjs';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {
  darkMode: boolean = false;
  spendingLimit: number | null = null;
  private darkModeSubscription?: Subscription;

  constructor(
    private themeService: ThemeService,
    private supabaseService: SupabaseService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.darkMode = this.themeService.isDarkMode();
  }

  ngOnInit() {
    this.darkModeSubscription = this.themeService.getDarkModeObservable().subscribe(
      isDark => {
        this.darkMode = isDark;
      }
    );
    this.loadSpendingLimit();
  }

  ngOnDestroy() {
    if (this.darkModeSubscription) {
      this.darkModeSubscription.unsubscribe();
    }
  }

  toggleDarkMode() {
    this.themeService.setDarkMode(this.darkMode);
  }

  async loadSpendingLimit() {
    try {
      const { data: settings, error } = await this.supabaseService.getSettings();
      if (error) {
        throw error;
      }
      this.spendingLimit = settings?.spending_limit || null;
    } catch (error) {
      console.error('Error loading spending limit:', error);
      this.showToast('Failed to load spending limit. Please try again later.');
    }
  }

  async updateSpendingLimit() {
    const alert = await this.alertController.create({
      header: 'Update Monthly Spending Limit',
      inputs: [
        {
          name: 'limit',
          type: 'number',
          placeholder: 'Enter amount',
          value: this.spendingLimit || undefined
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: async (data) => {
            if (data.limit && !isNaN(data.limit)) {
              try {
                await this.supabaseService.updateSettings({ spending_limit: parseFloat(data.limit) });
                this.spendingLimit = parseFloat(data.limit);
                this.showToast('Spending limit updated successfully');
              } catch (error) {
                console.error('Error updating spending limit:', error);
                this.showToast('Failed to update spending limit. Please try again later.');
              }
            } else {
              this.showToast('Please enter a valid number');
            }
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}

