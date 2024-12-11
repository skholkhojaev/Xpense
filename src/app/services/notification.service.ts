import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor() {
    this.initializeNotifications();
  }

  private async initializeNotifications() {
    await LocalNotifications.requestPermissions();
  }

  async scheduleNotification(title: string, body: string) {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: title,
          body: body,
          id: new Date().getTime(),
          schedule: { at: new Date(Date.now() + 1000) },
          sound: undefined,
          attachments: undefined,
          actionTypeId: undefined,
          extra: null
        }
      ]
    });

    await this.saveNotification(title, body);
  }

  private async saveNotification(title: string, body: string) {
    const notifications = await this.getStoredNotifications();
    notifications.push({ title, body, date: new Date().toISOString() });
    await Preferences.set({ key: 'notifications', value: JSON.stringify(notifications) });
  }

  async getStoredNotifications() {
    const { value } = await Preferences.get({ key: 'notifications' });
    return value ? JSON.parse(value) : [];
  }

  async clearNotifications() {
    await Preferences.remove({ key: 'notifications' });
  }

  async hasUnreadNotifications() {
    const notifications = await this.getStoredNotifications();
    return notifications.length > 0;
  }
}

