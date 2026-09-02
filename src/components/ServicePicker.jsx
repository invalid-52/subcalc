import React, { useState } from 'react';
import { POPULAR_SERVICES } from '../data/services';
import { getCategory } from '../data/categories';

export function ServicePicker({ selectedServiceId, onSelectPreset, isCustom, onSelectCustom }) {
  const [presetSearch, setPresetSearch] = useState('');

  const filteredServices = POPULAR_SERVICES.filter((svc) =>
    svc.name.toLowerCase().includes(presetSearch.toLowerCase()) ||
    svc.category.toLowerCase().includes(presetSearch.toLowerCase())
  );

  return (
    <div className="servicePickerSection">
      <div className="servicePickerHeader">
        <label className="formLabel">Select a Service Preset or Create Custom</label>
        <div className="serviceSearchBox">
          <input
            type="text"
            className="serviceSearchInput"
            placeholder="Search 20+ preset services..."
            value={presetSearch}
            onChange={(e) => setPresetSearch(e.target.value)}
            aria-label="Filter service presets"
          />
        </div>
      </div>

      <div className="servicePresetGrid" role="radiogroup" aria-label="Popular services">
        {filteredServices.map((svc) => {
          const isSelected = !isCustom && selectedServiceId === svc.id;
          const cat = getCategory(svc.category);

          return (
            <button
              key={svc.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`serviceChip ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectPreset(svc)}
              style={{ '--brand-color': svc.color }}
            >
              <span className="serviceChipLogo" style={{ color: svc.color }}>
                {svc.logoSvg}
              </span>
              <div className="serviceChipText">
                <span className="serviceChipName">{svc.name}</span>
                <span className="serviceChipCat">{cat.label}</span>
              </div>
            </button>
          );
        })}

        {/* Custom Service Option */}
        <button
          type="button"
          role="radio"
          aria-checked={isCustom}
          className={`serviceChip customOption ${isCustom ? 'selected' : ''}`}
          onClick={onSelectCustom}
        >
          <span className="serviceChipLogo custom">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
          </span>
          <div className="serviceChipText">
            <span className="serviceChipName">Custom Service</span>
            <span className="serviceChipCat">Add any service</span>
          </div>
        </button>
      </div>
    </div>
  );
}
