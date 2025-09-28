export interface ExpenseData {
  id: number;
  type: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
}

export interface ScoreFactors {
  paymentHistory: number;
  expenseConsistency: number;
  amountStability: number;
  diversityBonus: number;
}

export class TCSCalculator {
  private baseScore = 300;
  private maxScore = 850;

  calculateTCSScore(expenses: ExpenseData[]): { score: number; factors: ScoreFactors } {
    const factors = this.calculateFactors(expenses);
    
    // Weight each factor
    const paymentHistoryWeight = 0.35; // 35% - Most important
    const consistencyWeight = 0.25;    // 25% - Regular payments
    const stabilityWeight = 0.25;      // 25% - Amount consistency
    const diversityWeight = 0.15;      // 15% - Variety of expenses

    const weightedScore = 
      (factors.paymentHistory * paymentHistoryWeight) +
      (factors.expenseConsistency * consistencyWeight) +
      (factors.amountStability * stabilityWeight) +
      (factors.diversityBonus * diversityWeight);

    // Scale to TCS range (300-850)
    const score = Math.round(this.baseScore + (weightedScore * (this.maxScore - this.baseScore)));
    
    return {
      score: Math.min(Math.max(score, this.baseScore), this.maxScore),
      factors
    };
  }

  private calculateFactors(expenses: ExpenseData[]): ScoreFactors {
    if (expenses.length === 0) {
      return {
        paymentHistory: 0,
        expenseConsistency: 0,
        amountStability: 0,
        diversityBonus: 0
      };
    }

    return {
      paymentHistory: this.calculatePaymentHistory(expenses),
      expenseConsistency: this.calculateConsistency(expenses),
      amountStability: this.calculateAmountStability(expenses),
      diversityBonus: this.calculateDiversityBonus(expenses)
    };
  }

  private calculatePaymentHistory(expenses: ExpenseData[]): number {
    const paidExpenses = expenses.filter(e => e.status === 'paid').length;
    const overdueExpenses = expenses.filter(e => e.status === 'overdue').length;
    
    if (expenses.length === 0) return 0;
    
    const paymentRate = paidExpenses / expenses.length;
    const overdueRate = overdueExpenses / expenses.length;
    
    // Penalize overdue payments more heavily
    return Math.max(0, paymentRate - (overdueRate * 2));
  }

  private calculateConsistency(expenses: ExpenseData[]): number {
    // Group expenses by type and check for regular payments
    const expenseTypes = new Map<string, ExpenseData[]>();
    
    expenses.forEach(expense => {
      if (!expenseTypes.has(expense.type)) {
        expenseTypes.set(expense.type, []);
      }
      expenseTypes.get(expense.type)!.push(expense);
    });

    let consistencyScore = 0;
    let totalTypes = expenseTypes.size;

    expenseTypes.forEach((typeExpenses) => {
      if (typeExpenses.length >= 2) {
        // Regular payments for this type
        consistencyScore += 1;
      }
    });

    return totalTypes > 0 ? consistencyScore / totalTypes : 0;
  }

  private calculateAmountStability(expenses: ExpenseData[]): number {
    if (expenses.length < 2) return 0.5; // Neutral score for insufficient data

    // Group by expense type and calculate variance
    const expenseTypes = new Map<string, number[]>();
    
    expenses.forEach(expense => {
      if (!expenseTypes.has(expense.type)) {
        expenseTypes.set(expense.type, []);
      }
      expenseTypes.get(expense.type)!.push(expense.amount);
    });

    let stabilityScore = 0;
    let typeCount = 0;

    expenseTypes.forEach((amounts) => {
      if (amounts.length >= 2) {
        const mean = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
        const variance = amounts.reduce((sum, amt) => sum + Math.pow(amt - mean, 2), 0) / amounts.length;
        const coefficientOfVariation = Math.sqrt(variance) / mean;
        
        // Lower coefficient of variation = higher stability
        const stability = Math.max(0, 1 - coefficientOfVariation);
        stabilityScore += stability;
        typeCount++;
      }
    });

    return typeCount > 0 ? stabilityScore / typeCount : 0.5;
  }

  private calculateDiversityBonus(expenses: ExpenseData[]): number {
    const uniqueTypes = new Set(expenses.map(e => e.type)).size;
    
    // Bonus for having diverse expense types (up to 8 types)
    const maxTypes = 8;
    return Math.min(uniqueTypes / maxTypes, 1);
  }

  getScoreStatus(score: number): string {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Very Good';
    if (score >= 650) return 'Good';
    if (score >= 600) return 'Fair';
    if (score >= 550) return 'Poor';
    return 'Very Poor';
  }

  getScoreColor(score: number): string {
    if (score >= 750) return '#10b981'; // Green
    if (score >= 700) return '#22c55e'; // Light Green
    if (score >= 650) return '#84cc16'; // Lime
    if (score >= 600) return '#eab308'; // Yellow
    if (score >= 550) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  }

  getScoreRecommendations(score: number, factors: ScoreFactors): string[] {
    const recommendations: string[] = [];

    if (factors.paymentHistory < 0.8) {
      recommendations.push("Pay your bills on time to improve payment history");
    }

    if (factors.expenseConsistency < 0.6) {
      recommendations.push("Make regular payments for consistent expense tracking");
    }

    if (factors.amountStability < 0.6) {
      recommendations.push("Try to maintain consistent payment amounts");
    }

    if (factors.diversityBonus < 0.5) {
      recommendations.push("Track more types of expenses to show financial responsibility");
    }

    if (score >= 750) {
      recommendations.push("Excellent! Keep maintaining your payment habits");
    }

    return recommendations;
  }
}
