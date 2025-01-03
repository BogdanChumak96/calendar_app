import { FC, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <header className='bg-gray-800 text-white p-4'>
        <nav className='flex justify-between items-center max-w-7xl mx-auto'>
          <div className='text-xl font-semibold'>CalendarApp</div>
          <div className='space-x-4'>
            <a href='/' className='hover:text-gray-400'>
              Home
            </a>
            <a href='/about' className='hover:text-gray-400'>
              About
            </a>
            <a href='/contact' className='hover:text-gray-400'>
              Contact
            </a>
          </div>
        </nav>
      </header>

      <main className='flex-1 bg-gray-100 p-4'>
        <div className='max-w-7xl mx-auto'>{children}</div>
      </main>

      <footer className='bg-gray-800 text-white text-center py-4'>
        <p>&copy; 2025 CalendarApp. All Rights Reserved.</p>
      </footer>
    </div>
  );
};
