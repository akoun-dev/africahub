
import React from 'react';
import { TestSummary } from '../types/TestTypes';

interface TestSummaryCardProps {
  summary: TestSummary;
  productTypesCount?: number;
  productCriteriaValuesCount?: number;
}

export const TestSummaryCard: React.FC<TestSummaryCardProps> = ({
  summary,
  productTypesCount = 0,
  productCriteriaValuesCount = 0
}) => {
  return (
    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 className="font-semibold text-blue-800 mb-2">État du Système</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-blue-700">Types de produits: {productTypesCount}</div>
          <div className="text-blue-700">Valeurs de critères: {productCriteriaValuesCount}</div>
        </div>
        <div>
          <div className="text-blue-700">Cache multi-niveaux: ✅ Actif</div>
          <div className="text-blue-700">Système de résilience: ✅ Actif</div>
        </div>
      </div>
      <div className="flex gap-4 text-sm mt-3">
        <span className="text-green-600">✅ Réussis: {summary.passed}</span>
        <span className="text-red-600">❌ Échoués: {summary.failed}</span>
        <span className="text-gray-600">Total: {summary.total}</span>
      </div>
    </div>
  );
};
