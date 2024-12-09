import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy {
  hasNotification = false;
  private notificationSubscription: Subscription | undefined;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationSubscription = this.notificationService.getNotification().subscribe(hasNotification => {
      this.hasNotification = hasNotification;
    });
  }

  ngOnDestroy() {
    this.notificationSubscription?.unsubscribe();
  }
}

