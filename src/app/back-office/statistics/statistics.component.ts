import { Component, OnDestroy } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import { Subscription } from 'rxjs';
import {
  EventStatistics,
  FinancialStatistics,
  OverallStatistics,
} from '../interfaces/statistics.model';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';

Chart.register(...registerables);
@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
})
export class StatisticsComponent implements OnDestroy {
  // Data
  eventStats: EventStatistics = {};
  overallStats: OverallStatistics = {};
  financialStats: FinancialStatistics = {};

  // UI states
  isLoading: boolean = false;
  errorMessage: string = '';
  activeTab: string = 'overview';
  selectedEventId: number | null = null;

  // Subscriptions
  private subscriptions: Subscription = new Subscription();

  // Chart configurations
  public categoryChartConfig: ChartConfiguration = {
    type: 'doughnut' as ChartType,
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [
            '#4e73df',
            '#1cc88a',
            '#36b9cc',
            '#f6c23e',
            '#e74a3b',
            '#6f42c1',
            '#fd7e14',
            '#20c9a6',
            '#5a5c69',
            '#858796',
          ],
          hoverBackgroundColor: [
            '#2e59d9',
            '#17a673',
            '#2c9faf',
            '#f4b619',
            '#e02d1b',
            '#5a36b3',
            '#fd6a02',
            '#1ab394',
            '#42444e',
            '#707284',
          ],
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
          },
        },
        title: {
          display: true,
          text: 'Events by Category',
        },
      },
    },
  };

  public monthChartConfig: ChartConfiguration = {
    type: 'bar' as ChartType,
    data: {
      labels: [],
      datasets: [
        {
          label: 'Events',
          data: [],
          backgroundColor: '#4e73df',
          borderColor: '#4e73df',
          borderWidth: 1,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Events by Month',
        },
      },
    },
  };

  public revenueChartConfig: ChartConfiguration = {
    type: 'pie' as ChartType,
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [
            '#4e73df',
            '#1cc88a',
            '#36b9cc',
            '#f6c23e',
            '#e74a3b',
            '#6f42c1',
            '#fd7e14',
            '#20c9a6',
            '#5a5c69',
            '#858796',
          ],
          hoverBackgroundColor: [
            '#2e59d9',
            '#17a673',
            '#2c9faf',
            '#f4b619',
            '#e02d1b',
            '#5a36b3',
            '#fd6a02',
            '#1ab394',
            '#42444e',
            '#707284',
          ],
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
          },
        },
        title: {
          display: true,
          text: 'Revenue by Category',
        },
      },
    },
  };

  public feedbackChartConfig: ChartConfiguration = {
    type: 'polarArea' as ChartType,
    data: {
      labels: ['Positive', 'Neutral', 'Negative'],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: [
            '#1cc88a', // Positive - green
            '#f6c23e', // Neutral - yellow
            '#e74a3b', // Negative - red
          ],
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
          },
        },
        title: {
          display: true,
          text: 'Feedback Sentiment',
        },
      },
    },
  };

  constructor(
    private statisticsService: StatisticsService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    // verify only ADMIN had access to this component
    if (this.loginService.getAuthLevel() < 2) this.loginService.verifyAuth();
    this.loadOverallStatistics();
    this.loadFinancialStatistics();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadOverallStatistics(): void {
    this.isLoading = true;
    this.subscriptions.add(
      this.statisticsService.getOverallStatistics().subscribe({
        next: (data) => {
          this.overallStats = data;
          this.updateCategoryChart(data['eventsByCategory']);
          this.updateMonthChart(data['eventsByMonth']);
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load overall statistics';
          this.isLoading = false;
          console.error('Error loading overall statistics:', error);
        },
      })
    );
  }

  loadFinancialStatistics(): void {
    this.subscriptions.add(
      this.statisticsService.getFinancialStatistics().subscribe({
        next: (data) => {
          this.financialStats = data;
          this.updateRevenueChart(data['revenueByCategory']);
        },
        error: (error) => {
          console.error('Error loading financial statistics:', error);
        },
      })
    );
  }

  loadEventStatistics(): void {
    if (!this.selectedEventId) return;

    this.isLoading = true;
    this.subscriptions.add(
      this.statisticsService
        .getEventStatistics(this.selectedEventId)
        .subscribe({
          next: (data) => {
            this.eventStats = data;
            this.updateFeedbackChart(data);
            this.isLoading = false;
          },
          error: (error) => {
            this.errorMessage = 'Failed to load event statistics';
            this.isLoading = false;
            console.error('Error loading event statistics:', error);
          },
        })
    );
  }

  updateCategoryChart(eventsByCategory: any): void {
    if (!eventsByCategory) return;

    const labels = Object.keys(eventsByCategory);
    const data = Object.values(eventsByCategory) as number[];

    this.categoryChartConfig = {
      ...this.categoryChartConfig,
      data: {
        ...this.categoryChartConfig.data,
        labels: labels,
        datasets: [
          {
            ...this.categoryChartConfig.data.datasets[0],
            data: data,
          },
        ],
      },
    };
  }

  updateMonthChart(eventsByMonth: any): void {
    if (!eventsByMonth) return;

    // Convert month keys to proper labels
    const monthLabels = Object.keys(eventsByMonth).map(
      (month) => month.charAt(0) + month.slice(1).toLowerCase()
    );
    const data = Object.values(eventsByMonth) as number[];

    this.monthChartConfig = {
      ...this.monthChartConfig,
      data: {
        ...this.monthChartConfig.data,
        labels: monthLabels,
        datasets: [
          {
            ...this.monthChartConfig.data.datasets[0],
            data: data,
          },
        ],
      },
    };
  }

  updateRevenueChart(revenueByCategory: any): void {
    if (!revenueByCategory) return;

    const labels = Object.keys(revenueByCategory);
    const data = Object.values(revenueByCategory) as number[];

    this.revenueChartConfig = {
      ...this.revenueChartConfig,
      data: {
        ...this.revenueChartConfig.data,
        labels: labels,
        datasets: [
          {
            ...this.revenueChartConfig.data.datasets[0],
            data: data,
          },
        ],
      },
    };
  }

  updateFeedbackChart(eventStats: any): void {
    this.feedbackChartConfig = {
      ...this.feedbackChartConfig,
      data: {
        ...this.feedbackChartConfig.data,
        datasets: [
          {
            ...this.feedbackChartConfig.data.datasets[0],
            data: [
              eventStats.positiveFeedback || 0,
              eventStats.neutralFeedback || 0,
              eventStats.negativeFeedback || 0,
            ],
          },
        ],
      },
    };
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  formatPercentage(value: number): string {
    return value.toFixed(1) + '%';
  }

  formatNumber(value: number): string {
    return value.toLocaleString();
  }

  getRatingStars(rating: number): any[] {
    return Array(Math.round(rating)).fill(0);
  }

  getEmptyRatingStars(rating: number): any[] {
    return Array(5 - Math.round(rating)).fill(0);
  }
}
