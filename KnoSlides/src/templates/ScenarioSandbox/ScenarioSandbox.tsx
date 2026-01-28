/**
 * Scenario Sandbox Template
 * 
 * Manipulate variables and see different outcomes.
 * Placeholder - full implementation coming in Phase 4e.
 */

import React from 'react';
import { ScenarioSandboxProps } from '../../types';

export const ScenarioSandbox: React.FC<ScenarioSandboxProps> = ({ data, className }) => {
  return (
    <div className={className}>
      <p>ScenarioSandbox - Coming Soon</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ScenarioSandbox;
