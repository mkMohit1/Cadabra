import React, { useState } from 'react';
import { Check } from 'lucide-react';
import '../styles/PricingPage.scss';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Basic',
      price: 7,
      features: [
        { name: 'Attendance Management', included: true },
        { name: 'Leave System Management', included: true },
        { name: 'Employee Management', included: true },
        { name: 'Chat Support', included: true },
        { name: 'Expense Tracking', included: false },
        { name: 'Invoice Generate', included: false },
        { name: 'Purchase Generate', included: false },
        { name: 'Payroll', included: false },
        { name: 'App Management', included: false },
      ],
    },
    {
      name: 'Advance',
      price: 9,
      features: [
        { name: 'App Management', included: true },
        { name: 'Attendance Management', included: true },
        { name: 'Leave System Management', included: true },
        { name: 'Employee Management', included: true },
        { name: 'Expense Tracking', included: true },
        { name: 'Chat Support', included: true },
        { name: 'Invoice Generate', included: true },
        { name: 'Purchase Generate', included: false },
        { name: 'Payroll', included: false },
      ],
    },
    {
      name: 'Premium',
      price: 12,
      features: [
        { name: 'App Management', included: true },
        { name: 'Attendance Management', included: true },
        { name: 'Leave System Management', included: true },
        { name: 'Employee Management', included: true },
        { name: 'Expense Tracking', included: true },
        { name: 'Chat Support', included: true },
        { name: 'Invoice Generate', included: true },
        { name: 'Purchase Generate', included: true },
        { name: 'Payroll', included: true },
      ],
    },
  ];

  return (
    <div className="pricing-page">
      <div className="header">
        <h1>Choose Your Plan</h1>
        
        <div className="billing-toggle">
          <button
            className={`toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            className={`toggle-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly (Save 2.5%)
          </button>
        </div>

        <h2>
          <span className="text-muted">Best Plans For</span>{' '}
          <span className="text-primary">Office Management</span>
        </h2>
      </div>

      <div className="pricing-cards">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`pricing-card ${plan.name.toLowerCase()}`}
          >
            <div className="plan-badge">{plan.name}</div>
            <div className="plan-price">
              <span className="amount">£{plan.price}</span>
              <span className="period">User/Month</span>
            </div>
            <div className="features">
              {plan.features.map((feature) => (
                <div key={feature.name} className={`feature ${!feature.included ? 'disabled' : ''}`}>
                  <Check className="check-icon" />
                  <span className="feature-name">{feature.name}</span>
                </div>
              ))}
            </div>
            <button className="choose-plan-btn">
              Choose Plan
            </button>
          </div>
        ))}
      </div>

      <div className="comparison-link">
        <button className="compare-btn">
          Show Detailed Plan Comparison
          <svg
            className="arrow-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PricingPage;