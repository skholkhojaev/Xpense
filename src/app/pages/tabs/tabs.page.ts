import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  hasNotifications: boolean = false;
  hasUnreadNotifications: boolean = false;

  constructor(
    private supabaseService: SupabaseService,
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    await this.checkNotifications();
  }

  async checkNotifications() {
    try {
      this.hasUnreadNotifications = await this.notificationService.hasUnreadNotifications();
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  }
}

