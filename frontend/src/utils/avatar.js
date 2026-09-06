export function getAvatarUrl(userOrSeed, role = 'student') {
  // If an object with avatar_url was passed
  if (userOrSeed && typeof userOrSeed === 'object') {
    if (userOrSeed.avatar_url) {
      return userOrSeed.avatar_url;
    }
    userOrSeed = userOrSeed.avatar_seed;
  }

  // If already a local or http URL
  if (typeof userOrSeed === 'string' && (userOrSeed.startsWith('/') || userOrSeed.startsWith('http'))) {
    return userOrSeed;
  }

  // Fallback realistic headshot based on seed hash or DiceBear
  const safeSeed = userOrSeed || 'scholar';
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(safeSeed)}&backgroundColor=e0e7ff,c7d2fe,ddd6fe`;
}
