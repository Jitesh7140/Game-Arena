export const formatTime12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(':');
  const hour24 = parseInt(hours, 10);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minutes} ${ampm}`;
};

export const formatDateTime12Hour = (dateTime: string): string => {
  const date = new Date(dateTime);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  return date.toLocaleString('en-US', options);
};

export const isVSMatchTime = (): boolean => {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 21 && hour < 24; // 9 PM to 12 AM
};

export const getDefaultAvatar = (username: string): string => {
  const colors = ['#00d4ff', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
  const colorIndex = username.length % colors.length;
  const color = colors[colorIndex];
  
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="${color}"/>
      <text x="50" y="50" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">
        ${username.charAt(0).toUpperCase()}
      </text>
    </svg>
  `)}`;
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};