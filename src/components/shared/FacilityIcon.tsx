import { Tv, Wifi, Droplets, ChefHat, Bed, Archive, Sparkles } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Tv,
  Wifi,
  Droplets,
  ChefHat,
  Bed,
  Archive,
  Sparkles,
};

// Custom icons for facilities not in Lucide
const CustomRefrigeratorIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="9" y1="5" x2="9" y2="7" />
    <line x1="9" y1="12" x2="9" y2="16" />
  </svg>
);

const CustomWashingMachineIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="2" width="18" height="20" rx="2" />
    <circle cx="12" cy="13" r="5" />
    <circle cx="12" cy="13" r="2" />
    <line x1="7" y1="5" x2="7" y2="5" />
    <line x1="10" y1="5" x2="10" y2="5" />
  </svg>
);

interface FacilityIconProps {
  icon: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function FacilityIcon({ icon, name, size = 'md' }: FacilityIconProps) {
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-14 w-14',
    lg: 'h-16 w-16',
  };

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-7 w-7',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const renderIcon = () => {
    if (icon === 'Refrigerator') return <CustomRefrigeratorIcon />;
    if (icon === 'WashingMachine') return <CustomWashingMachineIcon />;

    // Check if icon is a URL (uploaded image)
    if (icon.startsWith('http') || icon.includes('supabase')) {
      return (
        <img
          src={icon}
          alt={name}
          className="h-full w-full object-contain p-2"
        />
      );
    }

    const IconComponent = iconMap[icon];
    if (IconComponent) {
      return <IconComponent className={iconSizeClasses[size]} />;
    }
    return <Sparkles className={iconSizeClasses[size]} />;
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${sizeClasses[size]} rounded-xl bg-secondary flex items-center justify-center text-primary`}>
        {renderIcon()}
      </div>
      <span className={`${textSizeClasses[size]} text-muted-foreground font-medium`}>{name}</span>
    </div>
  );
}
