import {
  Activity,
  AudioLines,
  BedDouble,
  Brain,
  FlaskConical,
  Handshake,
  HeartHandshake,
  HeartPulse,
  Hospital,
  MessagesSquare,
  Pill,
  Smile,
  Sparkles,
  Stethoscope,
  Store,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Activity,
  AudioLines,
  BedDouble,
  Brain,
  FlaskConical,
  Handshake,
  HeartHandshake,
  HeartPulse,
  Hospital,
  MessagesSquare,
  Pill,
  Smile,
  Sparkles,
  Stethoscope,
  Store,
  Users,
  Video,
};

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name] ?? HeartPulse;
  return <Icon className={className} aria-hidden="true" />;
}
