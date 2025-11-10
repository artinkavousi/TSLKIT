import type { ReactNode } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

export interface DemoNavItem {
  readonly to: string;
  readonly label: string;
}

export interface DemoLayoutProps {
  readonly title?: string;
  readonly navItems: readonly DemoNavItem[];
  readonly toolbar?: ReactNode;
  readonly children?: ReactNode;
}

function createNavClass(isActive: boolean): string {
  return `tsl-demo__nav-link${isActive ? ' tsl-demo__nav-link--active' : ''}`;
}

export function DemoLayout({
  title = 'TSLStudio Demo',
  navItems,
  toolbar,
  children
}: DemoLayoutProps): JSX.Element {
  const location = useLocation();

  return (
    <div className="tsl-demo__layout" data-pathname={location.pathname}>
      <header className="tsl-demo__header">
        <div className="tsl-demo__brand">
          <h1>{title}</h1>
        </div>
        <nav className="tsl-demo__nav">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => createNavClass(isActive)}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        {toolbar ? <div className="tsl-demo__toolbar">{toolbar}</div> : null}
      </header>
      <main className="tsl-demo__content">
        {children}
        <Outlet />
      </main>
    </div>
  );
}
