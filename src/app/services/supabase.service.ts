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
    console.log('Fetching transactions...');
    const result = await this.supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    console.log('Fetch result:', result);
    return result;
  }

  async getTransactionById(id: string) {
    console.log('Fetching transaction by ID:', id);
    const result = await this.supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();
    console.log('Fetch by ID result:', result);
    return result;
  }

  async addTransaction(transaction: any) {
    console.log('Adding transaction:', transaction);
    const result = await this.supabase
      .from('transactions')
      .insert({
        amount: parseFloat(transaction.amount),
        description: transaction.description,
        date: new Date(transaction.date).toISOString(),
        // Remove the category field if it doesn't exist in the database
        // category: transaction.category,
        latitude: transaction.latitude,
        longitude: transaction.longitude
      })
      .select();
    console.log('Add result:', result);
    return result;
  }

  async updateTransaction(id: string, transaction: any) {
    console.log('Updating transaction:', id, transaction);
    const result = await this.supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id)
      .select();
    console.log('Update result:', result);
    return result;
  }

  async deleteTransaction(id: string) {
    console.log('Deleting transaction:', id);
    const result = await this.supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    console.log('Delete result:', result);
    return result;
  }
}

