import React, { useState, useEffect, useId } from 'react';
import { ServicePicker } from './ServicePicker';
import { CATEGORIES } from '../data/categories';
import { BILLING_CYCLES, getBillingCycle } from '../data/billingCycles';
import { validateSubscription } from '../utils/validation';
import { formatCurrency } from '../utils/currency';
import { normalizeMonthlyCost, normalizeAnnualCost } from '../utils/calculations';
import { getServicePreset } from '../data/services';

const COLOR_PALETTE = [
  '#E50914', '#1DB954', '#3B82F6', '#10A37F', '#0061FF',
  '#107C10', '#8B5CF6', '#F59E0B', '#EC4899', '#00C4CC',
  '#64748B', '#121212',
];

export function SubscriptionModal({
  isOpen,
  onClose,
  onSubmit,
  editingSubscription = null,
  currentCurrency = 'USD',
}) {
  const isEditing = Boolean(editingSubscription);

  // Form State
  const [name, setName] = useState('');
  const [serviceId, setServiceId] = useState(null);
  const [isCustom, setIsCustom] = useState(false);
  const [price, setPrice] = useState('');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [category, setCategory] = useState('streaming');
  const [color, setColor] = useState('#3B82F6');
  const [nextBillingDate, setNextBillingDate] = useState('');
  const [status, setStatus] = useState('active');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  // Populate form on edit or reset on open
  useEffect(() => {
    if (editingSubscription) {
      setName(editingSubscription.name || '');
      setServiceId(editingSubscription.serviceId || null);
      setIsCustom(!editingSubscription.serviceId);
      setPrice(editingSubscription.price?.toString() || '');
      setBillingCycle(editingSubscription.billingCycle || 'monthly');
      setCategory(editingSubscription.category || 'other');
      setColor(editingSubscription.color || '#3B82F6');
      setNextBillingDate(editingSubscription.nextBillingDate || '');
      setStatus(editingSubscription.status || 'active');
      setNotes(editingSubscription.notes || '');
    } else {
      // Default new subscription state
      setName('');
      setServiceId('netflix');
      setIsCustom(false);
      setPrice('');
      setBillingCycle('monthly');
      setCategory('streaming');
      setColor('#E50914');
      setNextBillingDate('');
      setStatus('active');
      setNotes('');
    }
    setErrors({});
  }, [editingSubscription, isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Preset Selection Handler
  const handleSelectPreset = (svc) => {
    setServiceId(svc.id);
    setIsCustom(false);
    setName(svc.name);
    setCategory(svc.category);
    setColor(svc.color);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleSelectCustom = () => {
    setServiceId(null);
    setIsCustom(true);
    setName('');
    setCategory('other');
    setColor('#3B82F6');
  };

  // Live Cost Preview Calculation
  const numericPrice = parseFloat(price) || 0;
  const tempSub = { price: numericPrice, billingCycle };
  const previewMonthly = normalizeMonthlyCost(tempSub);
  const previewAnnual = normalizeAnnualCost(tempSub);
  const previewDaily = previewAnnual > 0 ? previewAnnual / 365 : 0;
  const cycleMeta = getBillingCycle(billingCycle);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      name: isCustom ? name.trim() : (name || 'Subscription'),
      serviceId: isCustom ? null : serviceId,
      category,
      price: numericPrice,
      billingCycle,
      currency: currentCurrency,
      color,
      nextBillingDate: nextBillingDate || null,
      status,
      notes: notes.trim(),
    };

    const validation = validateSubscription(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modalBackdrop" onClick={onClose} role="presentation">
      <div
        className="modalContainer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="modalHeader">
          <div>
            <h2 id="modal-title" className="modalTitle">
              {isEditing ? 'Edit Subscription' : 'Add Subscription'}
            </h2>
            <p className="modalSubtitle">
              {isEditing
                ? 'Update your subscription details and recurring rate'
                : 'Enter your subscription details to compute recurring costs'}
            </p>
          </div>
          <button
            type="button"
            className="modalCloseBtn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Form */}
        <form className="modalForm" onSubmit={handleSubmit} noValidate>
          {/* Service Picker */}
          <ServicePicker
            selectedServiceId={serviceId}
            onSelectPreset={handleSelectPreset}
            isCustom={isCustom}
            onSelectCustom={handleSelectCustom}
          />

          {/* Custom Name & Color (Shown if custom) */}
          {isCustom && (
            <div className="formRow">
              <div className="formGroup fullWidth">
                <label className="formLabel" htmlFor="custom-service-name">
                  Service Name <span className="req">*</span>
                </label>
                <input
                  id="custom-service-name"
                  type="text"
                  className={`formInput ${errors.name ? 'hasError' : ''}`}
                  placeholder="e.g. Adobe Suite, Fitness Gym, Newspaper..."
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  autoFocus
                />
                {errors.name && <span className="formErrorText">{errors.name}</span>}
              </div>

              {/* Color Picker */}
              <div className="formGroup fullWidth">
                <label className="formLabel">Brand Color</label>
                <div className="colorPalette">
                  {COLOR_PALETTE.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`colorDot ${color === c ? 'selected' : ''}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setColor(c)}
                      aria-label={`Select color ${c}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pricing & Billing Cycle Row */}
          <div className="formGridTwo">
            <div className="formGroup">
              <label className="formLabel" htmlFor="sub-price">
                Price ({currentCurrency}) <span className="req">*</span>
              </label>
              <div className="inputWithPrefix">
                <span className="inputCurrencyPrefix">
                  {formatCurrency(0, currentCurrency).replace(/[0-9.,\s]/g, '')}
                </span>
                <input
                  id="sub-price"
                  type="number"
                  step="any"
                  min="0"
                  className={`formInput pl-prefix ${errors.price ? 'hasError' : ''}`}
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    if (errors.price) setErrors((prev) => ({ ...prev, price: undefined }));
                  }}
                  autoFocus={!isCustom}
                />
              </div>
              {errors.price && <span className="formErrorText">{errors.price}</span>}
            </div>

            <div className="formGroup">
              <label className="formLabel" htmlFor="sub-cycle">
                Billing Cycle <span className="req">*</span>
              </label>
              <select
                id="sub-cycle"
                className="formSelect"
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value)}
              >
                {BILLING_CYCLES.map((cycle) => (
                  <option key={cycle.id} value={cycle.id}>
                    {cycle.label} ({cycle.shortLabel})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category & Status Row */}
          <div className="formGridTwo">
            <div className="formGroup">
              <label className="formLabel" htmlFor="sub-category">
                Category
              </label>
              <select
                id="sub-category"
                className="formSelect"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="formGroup">
              <label className="formLabel" htmlFor="sub-status">
                Status / Strategy
              </label>
              <select
                id="sub-status"
                className="formSelect"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="active">Active (Essential / Keep)</option>
                <option value="review">Review (Evaluate cutting)</option>
                <option value="paused">Paused (Inactive)</option>
              </select>
            </div>
          </div>

          {/* Next Billing Date & Notes Row */}
          <div className="formGridTwo">
            <div className="formGroup">
              <label className="formLabel" htmlFor="sub-next-date">
                Next Billing Date <span className="formOptional">(Optional)</span>
              </label>
              <input
                id="sub-next-date"
                type="date"
                className="formInput"
                value={nextBillingDate}
                onChange={(e) => setNextBillingDate(e.target.value)}
              />
            </div>

            <div className="formGroup">
              <label className="formLabel" htmlFor="sub-notes">
                Notes / Plan Tier <span className="formOptional">(Optional)</span>
              </label>
              <input
                id="sub-notes"
                type="text"
                className="formInput"
                placeholder="e.g. 4K UHD Plan, Shared with family..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={200}
              />
            </div>
          </div>

          {/* Live Cost Preview Banner */}
          {numericPrice > 0 && (
            <div className="liveCostPreview">
              <div className="previewTitle">Normalized Financial Impact</div>
              <div className="previewGrid">
                <div className="previewItem">
                  <span className="previewLabel">Monthly</span>
                  <span className="previewValue highlight">
                    {formatCurrency(previewMonthly, currentCurrency)}
                  </span>
                </div>
                <div className="previewItem">
                  <span className="previewLabel">Yearly</span>
                  <span className="previewValue">
                    {formatCurrency(previewAnnual, currentCurrency)}
                  </span>
                </div>
                <div className="previewItem">
                  <span className="previewLabel">Daily Approx</span>
                  <span className="previewValue">
                    {formatCurrency(previewDaily, currentCurrency)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="modalActions">
            <button type="button" className="btn btnGhost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btnPrimary"
              disabled={!numericPrice || (isCustom && !name.trim())}
            >
              {isEditing ? 'Save Changes' : 'Add Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
