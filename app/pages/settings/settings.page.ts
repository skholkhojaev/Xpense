import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  darkMode = false;
  categories: string[] = [];
  budget: number = 0;

  constructor(
    private supabaseService: SupabaseService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadSettings();
  }

  async loadSettings() {
    const { data: settings, error } = await this.supabaseService.getSettings();
    if (error) {
      console.error('Error fetching settings:', error);
    } else if (settings) {
      this.darkMode = settings.dark_mode;
      this.categories = settings.categories;
      this.budget = settings.budget;
    }
  }

  async toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
    await this.supabaseService.updateSettings({ dark_mode: this.darkMode });
  }

  async addCategory() {
    const alert = await this.alertController.create({
      header: 'Add Category',
      inputs: [
        {
          name: 'category',
          type: 'text',
          placeholder: 'New Category'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: async (data) => {
            if (data.category) {
              this.categories.push(data.category);
              await this.supabaseService.updateSettings({ categories: this.categories });
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async updateBudget() {
    const alert = await this.alertController.create({
      header: 'Update Budget',
      inputs: [
        {
          name: 'budget',
          type: 'number',
          placeholder: 'New Budget',
          value: this.budget
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Update',
          handler: async (data) => {
            if (data.budget) {
              this.budget = data.budget;
              await this.supabaseService.updateSettings({ budget: this.budget });
            }
          }
        }
      ]
    });

    await alert.present();
  }
}

