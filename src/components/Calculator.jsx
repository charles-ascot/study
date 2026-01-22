import { useState } from 'react';
import { Calculator as CalcIcon, GraduationCap, MapPin, Home, User, AlertCircle, Check } from 'lucide-react';
import { LIVING_COSTS } from '../constants/universityData';

function Calculator({ onCalculate }) {
  const [formData, setFormData] = useState({
    clientName: '',
    dateOfBirth: '',
    location: 'london',
    includeAccommodation: true
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = (today - dob) / (1000 * 60 * 60 * 24 * 365.25);
      
      if (age < 0) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
      } else if (age >= 18) {
        newErrors.dateOfBirth = 'Child must be under 18 years old for planning purposes';
      } else if (age < 0.5) {
        newErrors.dateOfBirth = 'Child must be at least 6 months old';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ clientName: true, dateOfBirth: true });
    
    if (validateForm()) {
      onCalculate({
        clientName: formData.clientName.trim(),
        dateOfBirth: new Date(formData.dateOfBirth),
        location: formData.location,
        includeAccommodation: formData.includeAccommodation
      });
    }
  };

  const getMaxDate = () => {
    const today = new Date();
    today.setMonth(today.getMonth() - 6); // At least 6 months old
    return today.toISOString().split('T')[0];
  };

  const getMinDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 17); // Max 17 years ago
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="glass-panel-strong p-6 sm:p-8 max-w-2xl mx-auto fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10">
          <GraduationCap className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h2 className="font-lexend text-lg font-semibold text-white">
            Cost Projection Calculator
          </h2>
          <p className="font-nunito text-xs text-white/50">
            Enter client details to generate a comprehensive report
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Client Name */}
        <div>
          <label htmlFor="clientName" className="form-label flex items-center gap-2">
            <User className="w-3.5 h-3.5" />
            Client Name
          </label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Enter client's full name"
            className={`glass-input ${touched.clientName && errors.clientName ? 'border-red-500/50' : ''}`}
          />
          {touched.clientName && errors.clientName && (
            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.clientName}
            </p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth" className="form-label flex items-center gap-2">
            <CalcIcon className="w-3.5 h-3.5" />
            Child's Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            onBlur={handleBlur}
            min={getMinDate()}
            max={getMaxDate()}
            className={`glass-input ${touched.dateOfBirth && errors.dateOfBirth ? 'border-red-500/50' : ''}`}
          />
          {touched.dateOfBirth && errors.dateOfBirth && (
            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.dateOfBirth}
            </p>
          )}
          <p className="mt-1.5 text-xs text-white/40">
            The calculator assumes university entry at age 18
          </p>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="form-label flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            University Location
          </label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="glass-select"
          >
            {Object.entries(LIVING_COSTS).map(([key, data]) => (
              <option key={key} value={key}>
                {data.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-white/40">
            {LIVING_COSTS[formData.location].description}
          </p>
        </div>

        {/* Include Accommodation */}
        <div className="glass-panel p-4">
          <label className="glass-checkbox">
            <input
              type="checkbox"
              name="includeAccommodation"
              checked={formData.includeAccommodation}
              onChange={handleInputChange}
            />
            <span className="checkmark">
              <Check className="w-3.5 h-3.5 text-white" />
            </span>
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-white/60" />
              <div>
                <span className="font-nunito text-sm text-white">
                  Include Student Accommodation
                </span>
                <p className="text-xs text-white/40 mt-0.5">
                  {formData.includeAccommodation 
                    ? `Estimated annual cost: £${LIVING_COSTS[formData.location].withAccommodation.toLocaleString()}`
                    : `Estimated annual cost: £${LIVING_COSTS[formData.location].withoutAccommodation.toLocaleString()} (no accommodation)`
                  }
                </p>
              </div>
            </div>
          </label>
        </div>

        {/* Info Box */}
        <div className="glass-panel p-4 border-l-2 border-indigo-500/50">
          <h4 className="font-lexend text-xs font-semibold text-white/80 mb-2">
            What's Included in This Calculation
          </h4>
          <ul className="space-y-1 text-xs text-white/60 font-nunito">
            <li>• Tuition fees based on current UK regulated maximum (£9,250)</li>
            <li>• Living costs adjusted for selected region</li>
            <li>• 2.5% annual inflation applied to all projections</li>
            <li>• Projections for both 3-year and 4-year degree programmes</li>
            <li>• Multiple savings scenarios with different growth rates</li>
          </ul>
        </div>

        {/* Submit Button */}
        <button type="submit" className="glass-button w-full">
          <CalcIcon className="w-4 h-4" />
          Generate Cost Projection Report
        </button>
      </form>
    </div>
  );
}

export default Calculator;
