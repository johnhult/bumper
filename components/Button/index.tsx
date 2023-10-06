'use client';

import Link, { LinkProps } from 'next/link';

type LinkButton = LinkProps;

type ClickButton = {
  onClick: () => void;
} & Omit<React.ComponentPropsWithRef<'button'>, 'children' | 'onClick'>;

type ButtonType = {
  children?: string;
  className?: string;
  ariaLabel?: string;
} & (ClickButton | LinkButton);

export default function Button({
  children,
  className,
  ariaLabel,
  ...rest
}: ButtonType) {
  const classes = `font-mono font-bold px-8 py-4 bg-emerald-500 rounded ${className}`;
  return 'href' in rest ? (
    <Link href={rest.href} className={classes}>
      <span aria-label={ariaLabel || children}>{children}</span>
    </Link>
  ) : (
    <button className={classes} aria-label={ariaLabel || children} {...rest}>
      {children}
    </button>
  );
}
