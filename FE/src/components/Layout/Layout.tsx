import { FC, ReactNode } from "react";
import { Navigation } from "../Navigation/Navigation";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children = null }) => {
  return (
    <div className='flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300'>
      <header className='bg-primary  text-primary-foreground'>
        <Navigation />
      </header>

      <main className='flex-1 '>
        <div className='max-w-7.5xl mx-auto'>{children}</div>
      </main>
    </div>
  );
};
