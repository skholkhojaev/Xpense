import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  notifications: any[] = [];

  constructor(private notificationService: NotificationService) { }

  async ngOnInit() {
    await this.loadNotifications();
  }

  async ionViewWillEnter() {
    await this.loadNotifications();
  }

  async loadNotifications() {
    this.notifications = await this.notificationService.getStoredNotifications();
    console.log('Loaded notifications:', this.notifications);
  }

  async clearNotifications() {
    await this.notificationService.clearNotifications();
    this.notifications = [];
  }
}

