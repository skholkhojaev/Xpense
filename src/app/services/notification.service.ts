import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private platform: Platform) {
    this.initializeNotifications();
  }

  public async initializeNotifications() {
    await this.platform.ready();
    if (this.platform.is('capacitor')) {
      await this.initializeLocalNotifications();
      await this.initializePushNotifications();
    }
  }

  private async initializeLocalNotifications() {
    try {
      const result = await LocalNotifications.requestPermissions();
      console.log('Local Notification permissions:', result);
      if (result.display !== 'granted') {
        console.warn('Local Notification permissions not granted');
      }
    } catch (error) {
      console.error('Error requesting Local Notification permissions:', error);
    }
  }

  private async initializePushNotifications() {
    try {
      let permStatus = await PushNotifications.checkPermissions();
      
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }
      
      if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
      }
      
      await PushNotifications.register();
      
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token: ' + token.value);
        // Here you would typically send this token to your server
      });

      PushNotifications.addListener('registrationError', (error: any) => {
        console.error('Error on registration: ' + JSON.stringify(error));
      });

      PushNotifications.addListener('pushNotificationReceived', (notification: any) => {
        console.log('Push notification received: ' + JSON.stringify(notification));
        this.saveNotification(notification.title, notification.body, Date.now());
      });

    } catch (error) {
      console.error('Error initializing Push Notifications:', error);
    }
  }

  async scheduleLocalNotification(title: string, body: string) {
    try {
      const notificationId = Date.now();
      await LocalNotifications.schedule({
        notifications: [
          {
            title: title,
            body: body,
            id: notificationId,
            schedule: { at: new Date(Date.now() + 1000) },
            sound: undefined,
            attachments: undefined,
            actionTypeId: "",
            extra: null
          }
        ]
      });

      await this.saveNotification(title, body, notificationId);
      console.log('Local Notification scheduled successfully');
    } catch (error) {
      console.error('Error scheduling Local Notification:', error);
    }
  }

  private async saveNotification(title: string, body: string, id: number) {
    const notifications = await this.getStoredNotifications();
    notifications.push({ id, title, body, date: new Date().toISOString() });
    await Preferences.set({
      key: 'notifications',
      value: JSON.stringify(notifications)
    });
    console.log('Notification saved:', { id, title, body, date: new Date().toISOString() });
  }

  async getStoredNotifications() {
    const { value } = await Preferences.get({ key: 'notifications' });
    const notifications = value ? JSON.parse(value) : [];
    console.log('Retrieved notifications:', notifications);
    return notifications;
  }

  async clearNotifications() {
    await Preferences.remove({ key: 'notifications' });
    await LocalNotifications.cancel({ notifications: await this.getScheduledNotificationIds() });
    console.log('Notifications cleared');
  }

  private async getScheduledNotificationIds() {
    const scheduledNotifications = await LocalNotifications.getPending();
    return scheduledNotifications.notifications.map(notification => ({ id: notification.id }));
  }

  async hasUnreadNotifications() {
    const notifications = await this.getStoredNotifications();
    return notifications.length > 0;
  }
}

