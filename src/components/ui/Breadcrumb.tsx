import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="hidden sm:flex items-center gap-2 text-label-sm text-slate-medium mb-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-primary transition-colors uppercase"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={
                index === items.length - 1
                  ? 'text-primary uppercase'
                  : 'text-slate-light uppercase'
              }
            >
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <span className="text-slate-light">{'>'}</span>
          )}
        </div>
      ))}
    </div>
  );
}
