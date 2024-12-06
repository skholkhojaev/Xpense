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
    return this.supabase
      .from('transactions')
      .select('*')
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
      .insert(transaction)
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
}

