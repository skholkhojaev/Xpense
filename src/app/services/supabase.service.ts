import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async getTransactions() {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  }

  async getTransactionById(id: string) {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  }

  async addTransaction(transaction: any) {
    const { data, error } = await this.supabase
      .from('transactions')
      .insert({
        amount: parseFloat(transaction.amount),
        description: transaction.description,
        date: new Date(transaction.date).toISOString(),
        latitude: transaction.latitude,
        longitude: transaction.longitude
      })
      .select();
    return { data, error };
  }

  async updateTransaction(id: string, transaction: any) {
    const { data, error } = await this.supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id)
      .select();
    return { data, error };
  }

  async deleteTransaction(id: string) {
    const { error } = await this.supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    return { error };
  }

  async setSpendingLimit(limit: number) {
    try {
      const { data, error } = await this.supabase
        .from('spending_limits')
        .upsert({ id: 1, monthly_limit: limit })
        .select();
      
      if (error) {
        console.error('Error setting spending limit:', error);
        throw new Error(`Failed to set spending limit: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Error in setSpendingLimit:', error);
      throw error;
    }
  }

  async getSpendingLimit() {
    try {
      const { data, error } = await this.supabase
        .from('spending_limits')
        .select('monthly_limit')
        .eq('id', 1)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No data found, return default limit
          return 0;
        }
        console.error('Error getting spending limit:', error);
        throw new Error(`Failed to get spending limit: ${error.message}`);
      }
      
      return data?.monthly_limit || 0;
    } catch (error) {
      console.error('Error in getSpendingLimit:', error);
      throw error;
    }
  }
}

