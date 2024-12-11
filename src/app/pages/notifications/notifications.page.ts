import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  notifications: any[] = [];

  constructor(private supabaseService: SupabaseService) { }

  async ngOnInit() {
    await this.loadNotifications();
  }

  async loadNotifications() {
    const { data, error } = await this.supabaseService.getNotifications();
    if (error) {
      console.error('Error loading notifications:', error);
    } else {
      this.notifications = data;
    }
  }

  async clearNotifications() {
    const { error } = await this.supabaseService.clearNotifications();
    if (error) {
      console.error('Error clearing notifications:', error);
    } else {
      this.notifications = [];
    }
  }
}

