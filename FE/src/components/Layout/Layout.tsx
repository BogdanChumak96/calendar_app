import { FC, ReactNode } from "react";
import { Navigation } from "../Navigation/Navigation";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className='flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300'>
      <header className='bg-primary text-primary-foreground'>
        <Navigation />
      </header>

      <main className='flex-1 p-4'>
        <div className='max-w-7xl mx-auto'>{children}</div>
      </main>

      <footer className='bg-primary text-primary-foreground text-center py-4'>
        <p>
          &copy; {new Date().getFullYear()} CalendarApp. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};
