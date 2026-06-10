interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`bg-surface-high rounded animate-pulse ${className}`}></div>
  );
}
