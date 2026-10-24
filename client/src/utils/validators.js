// Simple frontend validation helpers

export const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

export const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) errors.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter');
  if (!/[0-9]/.test(password)) errors.push('At least one number');
  if (!/[!@#$%^&*]/.test(password)) errors.push('At least one special character (!@#$%^&*)');
  return errors;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

export const difficultyBadgeColor = (difficulty) => {
  switch (difficulty) {
    case 'Beginner': return 'success';
    case 'Intermediate': return 'warning';
    case 'Advanced': return 'danger';
    default: return 'secondary';
  }
};

export const calcProgress = (completedTaskIds = [], roadmap) => {
  if (!roadmap?.learningStages) return 0;
  const total = roadmap.learningStages.reduce((sum, s) => sum + s.tasks.length, 0);
  if (total === 0) return 0;
  return Math.round((completedTaskIds.length / total) * 100);
};
