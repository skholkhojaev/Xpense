import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  notifications = [
    {
      title: 'Transaction Reminder',
      message: 'Dont forget to log your expenses for today.',
      hasNotification: false
    },
    {
      title: 'Spending Limit Reached',
      message: 'Youve reached your spending limit for the month.',
      hasNotification: true
    }
  ];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {}
}

