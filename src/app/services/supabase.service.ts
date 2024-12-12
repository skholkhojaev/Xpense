import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { NotificationService } from './notification.service';

interface SpendingLimit {
  id: number;
  monthly_limit: number;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private notificationService: NotificationService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async getTransactions() {
    return this.supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
  }

  async getRecentTransactions() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.supabase
      .from('transactions')
      .select('*')
      .gte('date', thirtyDaysAgo.toISOString())
      .order('date', { ascending: false });
  }

  async getTransactionById(id: string) {
    return this.supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();
  }

  async addTransaction(transaction: any) {
    return this.supabase
      .from('transactions')
      .insert({
        ...transaction,
        amount: parseFloat(transaction.amount),
        date: new Date(transaction.date).toISOString(),
        latitude: transaction.latitude,
        longitude: transaction.longitude
      })
      .select();
  }

  async updateTransaction(id: string, transaction: any) {
    return this.supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id)
      .select();
  }

  async deleteTransaction(id: string) {
    return this.supabase
      .from('transactions')
      .delete()
      .eq('id', id);
  }

  async getSettings() {
    try {
      let { data, error } = await this.supabase
        .from('spending_limits')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching spending limit:', error);
        return this.createDefaultSettings();
      }

      return { data: { spending_limit: data.monthly_limit }, error: null };
    } catch (error) {
      console.error('Unexpected error in getSettings:', error);
      return { data: null, error };
    }
  }

  private async createDefaultSettings() {
    const defaultSettings: SpendingLimit = {
      id: 1,
      monthly_limit: 0
    };

    try {
      const { data, error } = await this.supabase
        .from('spending_limits')
        .upsert(defaultSettings)
        .select()
        .single();

      if (error) {
        console.error('Error creating default spending limit:', error);
        return { data: null, error };
      }

      return { data: { spending_limit: data.monthly_limit }, error: null };
    } catch (error) {
      console.error('Unexpected error in createDefaultSettings:', error);
      return { data: null, error };
    }
  }

  async updateSettings(settings: { spending_limit: number }) {
    try {
      const { data, error } = await this.supabase
        .from('spending_limits')
        .upsert({
          id: 1,
          monthly_limit: settings.spending_limit
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating spending limit:', error);
        return { data: null, error };
      }

      return { data: { spending_limit: data.monthly_limit }, error: null };
    } catch (error) {
      console.error('Unexpected error in updateSettings:', error);
      return { data: null, error };
    }
  }

  async addNotification(notification: { message: string, date: string }) {
    return this.supabase
      .from('notifications')
      .insert(notification)
      .select();
  }

  async getNotifications() {
    return this.supabase
      .from('notifications')
      .select('*')
      .order('date', { ascending: false });
  }

  async clearNotifications() {
    return this.supabase
      .from('notifications')
      .delete()
      .gte('id', 0);
  }

  async checkSpendingLimit(newTransactionAmount: number) {
    console.log('Checking spending limit for new transaction amount:', newTransactionAmount);
    const { data: settings, error } = await this.getSettings();
    if (error) {
      console.error('Error fetching settings:', error);
      return;
    }

    if (settings && settings.spending_limit > 0) {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

      const { data: transactions, error: transactionError } = await this.supabase
        .from('transactions')
        .select('amount')
        .gte('date', firstDayOfMonth.toISOString())
        .lte('date', currentDate.toISOString());

      if (transactionError) {
        console.error('Error fetching transactions:', transactionError);
        return;
      }

      const totalSpending = transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const newTotalSpending = totalSpending + Math.abs(newTransactionAmount);

      console.log('Total spending this month:', totalSpending);
      console.log('New total spending:', newTotalSpending);
      console.log('Spending limit:', settings.spending_limit);

      if (newTotalSpending > settings.spending_limit) {
        console.log('Spending limit exceeded, scheduling notification');
        await this.notificationService.scheduleLocalNotification(
          'Monthly Spending Limit Exceeded',
          `Your total spending of $${newTotalSpending.toFixed(2)} this month exceeds your limit of $${settings.spending_limit.toFixed(2)}.`
        );
      } else {
        console.log('Spending limit not exceeded');
      }
    } else {
      console.log('No spending limit set or spending limit is 0');
    }
  }
}

