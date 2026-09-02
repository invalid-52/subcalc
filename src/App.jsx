import React, { useState, useMemo } from 'react';
import { useSubscriptions } from './hooks/useSubscriptions';
import { useTheme } from './hooks/useTheme';
import { useCurrency } from './hooks/useCurrency';
import {
  calculateTotals,
  calculateCategoryBreakdown,
  calculatePotentialSavings,
  calculateUpcomingBills,
  generateSmartInsights,
} from './utils/calculations';

import { Header } from './components/Header';
import { SummaryHero } from './components/SummaryHero';
import { SecondaryMetrics } from './components/SecondaryMetrics';
import { SpendingBreakdown } from './components/SpendingBreakdown';
import { InsightsSection } from './components/InsightsSection';
import { SavingsAnalysis } from './components/SavingsAnalysis';
import { UpcomingBills } from './components/UpcomingBills';
import { SubscriptionList } from './components/SubscriptionList';
import { SubscriptionModal } from './components/SubscriptionModal';
import { SettingsModal } from './components/SettingsModal';
import { ConfirmDialog } from './components/ConfirmDialog';

export default function App() {
  // Theme & Currency Hooks
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();

  // Subscriptions State & CRUD Hook
  const {
    subscriptions,
    filteredSubscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    toggleStatus,
    duplicateSubscription,
    resetSubscriptions,
    importSubscriptions,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    cycleFilter,
    setCycleFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
  } = useSubscriptions();

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [subToDelete, setSubToDelete] = useState(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Financial Calculations Engine (Memoized)
  const totals = useMemo(() => calculateTotals(subscriptions), [subscriptions]);
  const categoryBreakdown = useMemo(() => calculateCategoryBreakdown(subscriptions), [subscriptions]);
  const savings = useMemo(() => calculatePotentialSavings(subscriptions), [subscriptions]);
  const upcomingBills = useMemo(() => calculateUpcomingBills(subscriptions), [subscriptions]);
  const insights = useMemo(() => generateSmartInsights(subscriptions, currency), [subscriptions, currency]);

  // Modal Handlers
  const handleOpenAddModal = () => {
    setEditingSubscription(null);
    setIsFormModalOpen(true);
  };

  const handleEditSubscription = (sub) => {
    setEditingSubscription(sub);
    setIsFormModalOpen(true);
  };

  const handleSaveSubscription = (formData) => {
    if (editingSubscription) {
      updateSubscription(editingSubscription.id, formData);
    } else {
      addSubscription(formData);
    }
  };

  const handleRequestDelete = (sub) => {
    setSubToDelete(sub);
  };

  const handleConfirmDelete = () => {
    if (subToDelete) {
      deleteSubscription(subToDelete.id);
      setSubToDelete(null);
    }
  };

  const handleConfirmReset = () => {
    resetSubscriptions();
    setIsResetConfirmOpen(false);
    setIsSettingsOpen(false);
  };

  const handleToggleThemeCycle = () => {
    const nextTheme = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark';
    setTheme(nextTheme);
  };

  const handleQuickAddSample = (sample) => {
    addSubscription({
      name: sample.name,
      serviceId: sample.serviceId,
      price: sample.price,
      billingCycle: 'monthly',
      category: sample.category,
      color: sample.color,
      status: 'active',
      currency,
    });
  };

  return (
    <div className="appLayout">
      {/* Site Header */}
      <Header
        currency={currency}
        onCurrencyChange={setCurrency}
        theme={theme}
        onToggleTheme={handleToggleThemeCycle}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* Main Dashboard Content */}
      <main className="mainContent" id="main-content">
        {/* Dominant Hero Metric Card */}
        <SummaryHero
          totals={totals}
          savings={savings}
          currency={currency}
          onOpenAddModal={handleOpenAddModal}
        />

        {/* Secondary Metric Cards Grid */}
        <SecondaryMetrics
          totals={totals}
          currency={currency}
        />

        {/* Category Spending Breakdown Bar & Chips */}
        <SpendingBreakdown
          categoryBreakdown={categoryBreakdown}
          currency={currency}
          selectedCategory={categoryFilter}
          onSelectCategory={setCategoryFilter}
        />

        {/* Real Data Smart Insights */}
        <InsightsSection insights={insights} />

        {/* Savings Planner & Optimization */}
        <SavingsAnalysis
          savings={savings}
          currency={currency}
          statusFilter={statusFilter}
          onSetStatusFilter={setStatusFilter}
        />

        {/* Upcoming Renewals Schedule */}
        <UpcomingBills
          upcomingBills={upcomingBills}
          currency={currency}
        />

        {/* Subscriptions Management List */}
        <SubscriptionList
          subscriptions={subscriptions}
          filteredSubscriptions={filteredSubscriptions}
          currency={currency}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          cycleFilter={cycleFilter}
          onCycleChange={setCycleFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onOpenAddModal={handleOpenAddModal}
          onEdit={handleEditSubscription}
          onDelete={handleRequestDelete}
          onToggleStatus={toggleStatus}
          onDuplicate={duplicateSubscription}
          onQuickAddSample={handleQuickAddSample}
        />
      </main>

      {/* Footer */}
      <footer className="siteFooter">
        <div className="footerContent">
          <span className="footerBrand">SUBCALC — Subscription Calculator</span>
          <span className="footerDot">•</span>
          <span className="footerPrivacy">Local-first & Private</span>
          <span className="footerDot">•</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footerLink"
          >
            GitHub
          </a>
        </div>
      </footer>

      {/* Add / Edit Subscription Dialog */}
      <SubscriptionModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSaveSubscription}
        editingSubscription={editingSubscription}
        currentCurrency={currency}
      />

      {/* Settings & Data Portability Dialog */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currency={currency}
        onCurrencyChange={setCurrency}
        theme={theme}
        onThemeChange={setTheme}
        subscriptions={subscriptions}
        onImportData={importSubscriptions}
        onRequestReset={() => setIsResetConfirmOpen(true)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(subToDelete)}
        title={`Delete "${subToDelete?.name}"?`}
        message="This will permanently remove this subscription from your calculator. This action cannot be undone."
        confirmLabel="Delete Subscription"
        cancelLabel="Keep Subscription"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setSubToDelete(null)}
      />

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Reset All Subscriptions?"
        message="Are you sure you want to clear all subscriptions? All local data will be erased immediately. Consider exporting a backup first."
        confirmLabel="Clear All Data"
        cancelLabel="Cancel"
        isDanger={true}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
}
