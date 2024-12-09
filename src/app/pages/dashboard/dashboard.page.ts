import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  monthlyIncome: number = 0;
  monthlyExpenses: number = 0;
  recentTransactions: any[] = [];

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  async loadDashboardData() {
    const { data: transactions, error } = await this.supabaseService.getTransactions();
    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      this.recentTransactions = transactions;
      this.calculateMonthlyTotals(transactions);
    }
  }

  calculateMonthlyTotals(transactions: any[]) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    this.monthlyIncome = transactions
      .filter(t => new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear && t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    this.monthlyExpenses = transactions
      .filter(t => new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }
}

