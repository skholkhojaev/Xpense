import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  hasNotifications: boolean = false;

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.checkNotifications();
  }

  async checkNotifications() {
    try {
      const { data: notifications } = await this.supabaseService.getNotifications();
      this.hasNotifications = !!notifications && notifications.length > 0;
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  }
}

