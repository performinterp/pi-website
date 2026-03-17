import {
  Award,
  Scale,
  Crown,
  Calendar,
  GraduationCap,
  HandMetal,
  Music,
  Users,
  Shield,
  Star,
  Check,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  Zap,
  Heart,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  award: Award,
  scale: Scale,
  crown: Crown,
  calendar: Calendar,
  "graduation-cap": GraduationCap,
  "hand-metal": HandMetal,
  music: Music,
  users: Users,
  shield: Shield,
  star: Star,
  check: Check,
  "arrow-right": ArrowRight,
  phone: Phone,
  mail: Mail,
  "map-pin": MapPin,
  clock: Clock,
  "chevron-right": ChevronRight,
  zap: Zap,
  heart: Heart,
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export default function Icon({ name, size = 24, className }: IconProps) {
  const Component = icons[name];
  if (!Component) return null;
  return <Component size={size} className={className} />;
}
