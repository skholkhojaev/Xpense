import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hasNotification = new BehaviorSubject<boolean>(false);

  constructor() {}

  setNotification(value: boolean): void {
    this.hasNotification.next(value);
  }

  getNotification(): Observable<boolean> {
    return this.hasNotification.asObservable();
  }
}

