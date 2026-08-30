interface LogoIconProps {
  size?: number;
  className?: string;
}

export default function LogoIcon({ size = 8, className = '' }: LogoIconProps) {
  return (
    <div
      className={`rounded-xl flex items-center justify-center shrink-0 shadow-[0_4px_14px_-4px_rgba(0,229,255,0.45)] ${className}`}
      style={{
        width: `${size * 4}px`,
        height: `${size * 4}px`,
        background: 'linear-gradient(140deg, #00e5ff 0%, #3b82f6 55%, #8b5cf6 100%)',
      }}
    >
      <svg className="text-white" style={{ width: `${size * 2.5}px`, height: `${size * 2.5}px` }} fill="currentColor" viewBox="0 0 24 24">
        <path d="M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.34 1.68-.92L8 15h8l1.38 3.08c.36.58 1 .92 1.68.92 1.55 0 2.74-1.37 2.52-2.91zM9 10H7V8h2v2zm5 0h-2V8h2v2z" />
      </svg>
    </div>
  );
}