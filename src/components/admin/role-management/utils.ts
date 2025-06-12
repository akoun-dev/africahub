
export const getRoleColor = (role: string) => {
  switch (role) {
    case 'super-admin': return 'bg-purple-100 text-purple-800';
    case 'admin': return 'bg-red-100 text-red-800';
    case 'moderator': return 'bg-yellow-100 text-yellow-800';
    case 'developer': return 'bg-blue-100 text-blue-800';
    case 'user': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getRoleIconName = (role: string) => {
  switch (role) {
    case 'super-admin': return 'Crown';
    case 'admin': return 'Shield';
    case 'moderator': return 'Users';
    case 'developer': return 'Code';
    default: return null;
  }
};
