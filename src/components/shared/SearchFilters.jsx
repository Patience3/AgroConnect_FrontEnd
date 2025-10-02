import { useState } from 'react';
import { Search, Filter, X, MapPin, SlidersHorizontal, Leaf } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import clsx from 'clsx';
import { PRODUCT_CATEGORIES, QUALITY_GRADES } from '@/types';

const SearchFilters = ({ onFilterChange, onSearch, initialFilters = {} }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: initialFilters.category || 'all',
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
    location: initialFilters.location || '',
    isOrganic: initialFilters.isOrganic || false,
    qualityGrade: initialFilters.qualityGrade || 'all',
    sortBy: initialFilters.sortBy || 'newest',
    inStock: initialFilters.inStock !== undefined ? initialFilters.inStock : true,
    harvestDateFrom: initialFilters.harvestDateFrom || '',
    harvestDateTo: initialFilters.harvestDateTo || ''
  });

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'name_desc', label: 'Name: Z to A' }
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const resetFilters = () => {
    const defaultFilters = {
      category: 'all',
      minPrice: '',
      maxPrice: '',
      location: '',
      isOrganic: false,
      qualityGrade: 'all',
      sortBy: 'newest',
      inStock: true,
      harvestDateFrom: '',
      harvestDateTo: ''
    };
    setFilters(defaultFilters);
    setSearchTerm('');
    if (onFilterChange) {
      onFilterChange(defaultFilters);
    }
    if (onSearch) {
      onSearch('');
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.location) count++;
    if (filters.isOrganic) count++;
    if (filters.qualityGrade !== 'all') count++;
    if (filters.harvestDateFrom || filters.harvestDateTo) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            icon={Search}
          />
        </div>
        
        <Button
          variant={showFilters ? 'primary' : 'secondary'}
          icon={SlidersHorizontal}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters
          {getActiveFiltersCount() > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-accent-cyan text-primary-dark rounded-full text-xs font-bold">
              {getActiveFiltersCount()}
            </span>
          )}
        </Button>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(PRODUCT_CATEGORIES).slice(0, 4).map(([key, value]) => (
          <button
            key={key}
            onClick={() => handleFilterChange('category', value)}
            className={clsx(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-colors capitalize',
              filters.category === value
                ? 'bg-accent-cyan text-primary-dark'
                : 'bg-primary-light text-neutral-300 hover:bg-neutral-800 border border-neutral-700'
            )}
          >
            {value}
          </button>
        ))}
        <button
          onClick={() => handleFilterChange('isOrganic', !filters.isOrganic)}
          className={clsx(
            'flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
            filters.isOrganic
              ? 'bg-success text-white'
              : 'bg-primary-light text-neutral-300 hover:bg-neutral-800 border border-neutral-700'
          )}
        >
          <Leaf size={16} />
          Organic
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="card animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Advanced Filters</h3>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={resetFilters}
                icon={X}
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                <Filter className="inline w-4 h-4 mr-1" />
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input"
              >
                <option value="all">All Categories</option>
                {Object.entries(PRODUCT_CATEGORIES).map(([key, value]) => (
                  <option key={key} value={value} className="capitalize">
                    {value}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                💰 Price Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="input w-1/2"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="input w-1/2"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Location
              </label>
              <input
                type="text"
                placeholder="Enter location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="input"
              />
            </div>

            {/* Quality Grade */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Quality Grade
              </label>
              <select
                value={filters.qualityGrade}
                onChange={(e) => handleFilterChange('qualityGrade', e.target.value)}
                className="input"
              >
                <option value="all">All Grades</option>
                {Object.entries(QUALITY_GRADES).map(([key, value]) => (
                  <option key={key} value={value} className="capitalize">
                    {value.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Harvest Date From */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                📅 Harvest From
              </label>
              <input
                type="date"
                value={filters.harvestDateFrom}
                onChange={(e) => handleFilterChange('harvestDateFrom', e.target.value)}
                className="input"
              />
            </div>

            {/* Harvest Date To */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                📅 Harvest To
              </label>
              <input
                type="date"
                value={filters.harvestDateTo}
                onChange={(e) => handleFilterChange('harvestDateTo', e.target.value)}
                className="input"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="input"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* In Stock Only */}
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                  className="w-4 h-4 text-accent-cyan border-neutral-700 rounded focus:ring-accent-teal bg-primary-light"
                />
                <span className="text-sm font-medium text-neutral-300">In Stock Only</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;