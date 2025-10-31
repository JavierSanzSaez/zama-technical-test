import React, { useState } from 'react';
import { DEV_CONFIG } from '../constants';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectFeatureFlags, toggleFeatureFlag, type FeatureFlagKey } from '../store/featureFlagsSlice';

interface FeatureFlagToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const FeatureFlagToggle: React.FC<FeatureFlagToggleProps> = ({
  label,
  description,
  enabled,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-gray-600">
      <div className="flex-1">
        <div className="text-sm font-medium text-white">{label}</div>
        <div className="text-xs text-gray-300 mt-1">{description}</div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${enabled ? 'bg-blue-600' : 'bg-gray-500'}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out
            ${enabled ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
};

export const DevToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const featureFlags = useAppSelector(selectFeatureFlags);

  const handleToggleFeatureFlag = (flagKey: FeatureFlagKey, enabled: boolean) => {
    dispatch(toggleFeatureFlag({ flagKey, enabled }));
  };

  // Don't render if DEBUG_MODE is false
  if (!DEV_CONFIG.DEBUG_MODE) {
    return null;
  }

  return (
    <>
      {/* Toolbar */}
      <div
        className={`
          fixed right-0 top-0 h-full bg-gray-800 border-l border-gray-600 shadow-xl z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{ width: DEV_CONFIG.toolbar.width }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <h3 className="text-lg font-semibold text-white">Dev Toolbar</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-full pb-16">
          {/* Feature Flags Section */}
          <div className="p-4">
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
              Feature Flags
            </h4>
            <div className="bg-gray-700 rounded-lg overflow-hidden">
              {Object.entries(featureFlags).map(([key, flag]) => (
                <FeatureFlagToggle
                  key={key}
                  label={flag.label}
                  description={flag.description}
                  enabled={flag.enabled}
                  onChange={(enabled) => handleToggleFeatureFlag(key as FeatureFlagKey, enabled)}
                />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4">
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
              Quick Actions
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => dispatch({ type: 'featureFlags/enableAllFeatureFlags' })}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded transition-colors"
              >
                🚀 Enable All Features
              </button>
              <button
                onClick={() => dispatch({ type: 'featureFlags/disableAllFeatureFlags' })}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded transition-colors"
              >
                🛑 Disable All Features
              </button>
              <button
                onClick={() => dispatch({ type: 'featureFlags/resetFeatureFlags' })}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white text-sm py-2 px-3 rounded transition-colors"
              >
                🔄 Reset to Defaults
              </button>
            </div>
          </div>

          {/* Additional Debug Info */}
          <div className="p-4">
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
              Debug Info
            </h4>
            <div className="bg-gray-700 rounded-lg p-4 space-y-2">
              <div className="text-xs text-gray-300">
                <span className="text-gray-400">Environment:</span> Development
              </div>
              <div className="text-xs text-gray-300">
                <span className="text-gray-400">Version:</span> {DEV_CONFIG.DEBUG_MODE ? '1.0.0-dev' : '1.0.0'}
              </div>
              <div className="text-xs text-gray-300">
                <span className="text-gray-400">Build:</span> {new Date().toLocaleString()}
              </div>
              <div className="text-xs text-gray-300">
                <span className="text-gray-400">State Management:</span> Redux Toolkit
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Arrow - Always visible when DEBUG_MODE is true */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-l-lg
          shadow-lg hover:bg-gray-700 transition-all duration-200 z-40
          ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
        title="Open Dev Toolbar"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </>
  );
};