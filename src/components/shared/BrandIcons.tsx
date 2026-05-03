import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

function BaseIcon({ children, className, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
}

export function BrandHomeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M3.5 11.2L12 4l8.5 7.2v8.3a1.5 1.5 0 0 1-1.5 1.5h-4.3v-5.3a1 1 0 0 0-1-1h-3.4a1 1 0 0 0-1 1V21H5a1.5 1.5 0 0 1-1.5-1.5v-8.3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </BaseIcon>
  );
}

export function BrandJobsIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="3.5" y="6.5" width="17" height="13.5" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.2 6.5V5.2A1.7 1.7 0 0 1 9.9 3.5h4.2a1.7 1.7 0 0 1 1.7 1.7v1.3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 12h17" stroke="currentColor" strokeWidth="1.7" />
    </BaseIcon>
  );
}

export function BrandApplicationsIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M7 3.5h8.5L20.5 8v11a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M15.5 3.5V8h5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m8.8 14 2.2 2.2 4.2-4.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </BaseIcon>
  );
}

export function BrandProfileIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 19a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </BaseIcon>
  );
}

export function BrandSearchIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </BaseIcon>
  );
}

export function BrandFilterIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4.5 7h15M7.5 12h9M10 17h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="15.5" cy="7" r="1.8" fill="currentColor" />
      <circle cx="8.5" cy="12" r="1.8" fill="currentColor" />
      <circle cx="13" cy="17" r="1.8" fill="currentColor" />
    </BaseIcon>
  );
}

export function BrandBookmarkIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M7.2 4.2h9.6a1.8 1.8 0 0 1 1.8 1.8v13.8l-6.6-3.8-6.6 3.8V6a1.8 1.8 0 0 1 1.8-1.8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </BaseIcon>
  );
}

export function BrandBellIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M6.5 16.5h11L16.3 15V10a4.3 4.3 0 1 0-8.6 0v5l-1.2 1.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M10 18.5a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </BaseIcon>
  );
}

export function BrandMessagesIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M7 10h10M7 14h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M21 11.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z" stroke="currentColor" strokeWidth="1.7" />
    </BaseIcon>
  );
}
