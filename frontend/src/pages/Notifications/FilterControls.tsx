import React from 'react';
import { Filter, Check, Heart, UserPlus, MessageCircle, AtSign, FileText, Eye, EyeOff } from 'lucide-react';

interface FilterControlsProps {
  filters: {
    type: 'all' | 'like' | 'follow' | 'comment' | 'mention' | 'post';
    status: 'all' | 'unread' | 'read';
  };
  onFilterChange: (filters: FilterControlsProps['filters']) => void;
  unreadCount: number;
}

const FilterControls: React.FC<FilterControlsProps> = ({ filters, onFilterChange, unreadCount }) => {
  const typeOptions = [
    { value: 'all' as const, label: 'All Types', icon: Filter, count: null },
    { value: 'like' as const, label: 'Likes', icon: Heart, count: null },
    { value: 'follow' as const, label: 'Follows', icon: UserPlus, count: null },
    { value: 'comment' as const, label: 'Comments', icon: MessageCircle, count: null },
    { value: 'mention' as const, label: 'Mentions', icon: AtSign, count: null },
    { value: 'post' as const, label: 'Posts', icon: FileText, count: null },
  ];

  const statusOptions = [
    { value: 'all' as const, label: 'All', icon: Eye, count: null },
    { value: 'unread' as const, label: 'Unread', icon: EyeOff, count: unreadCount },
    { value: 'read' as const, label: 'Read', icon: Check, count: null },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Type Filter */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter by Type
          </h3>
          <div className="flex flex-wrap gap-2">
            {typeOptions.map((option) => {
              const Icon = option.icon;
              const isActive = filters.type === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => onFilterChange({ ...filters, type: option.value })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-500 shadow-md transform scale-105'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {option.label}
                  {option.count !== null && option.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      isActive ? 'bg-white/20' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {option.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Filter by Status
          </h3>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => {
              const Icon = option.icon;
              const isActive = filters.status === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => onFilterChange({ ...filters, status: option.value })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-500 shadow-md transform scale-105'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {option.label}
                  {option.count !== null && option.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      isActive ? 'bg-white/20' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {option.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;