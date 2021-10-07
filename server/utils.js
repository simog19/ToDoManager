export const serializeDate = date => date.toISOString()
  .replace('T', ' ')
  .replace(/:\d\d\..+$/, '');
