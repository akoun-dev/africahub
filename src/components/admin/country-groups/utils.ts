
export const getRingClasses = (groupColor: string, isSelected: boolean) => {
  if (!isSelected) return '';
  
  const colorMap: { [key: string]: string } = {
    '#10B981': 'ring-green-500',
    '#3B82F6': 'ring-blue-500',
    '#8B5CF6': 'ring-purple-500',
    '#F59E0B': 'ring-yellow-500'
  };
  
  return colorMap[groupColor] || 'ring-gray-500';
};

export const getBorderClasses = (groupColor: string, isSelected: boolean) => {
  if (!isSelected) return '';
  
  const colorMap: { [key: string]: string } = {
    '#10B981': 'border-green-500',
    '#3B82F6': 'border-blue-500',
    '#8B5CF6': 'border-purple-500',
    '#F59E0B': 'border-yellow-500'
  };
  
  return colorMap[groupColor] || 'border-gray-500';
};
