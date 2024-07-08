'use client';
import { cn } from '@/lib';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarIcon, Pencil1Icon } from '@radix-ui/react-icons';

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="h-16 w-full border-gray-200 border-t bg-white">
      <div className="mx-auto grid h-full max-w-lg grid-cols-2 font-medium">
        <Link
          href="/"
          prefetch={false}
          className={cn(
            pathname === '/' ? 'bg-red-100' : '',
            'group inline-flex flex-col items-center justify-center border-gray-200 border-x px-5'
          )}
        >
          <CalendarIcon className="mb-1 h-6 w-6 text-gray-500 text-sm group-hover:text-blue-600" />
          <span className="text-gray-500 text-sm group-hover:text-blue-600">
            Koledar
          </span>
        </Link>
        <Link
          href="/termini"
          prefetch={false}
          className={cn(
            pathname === '/termini' ? 'bg-red-100' : '',
            'group inline-flex flex-col items-center justify-center border-gray-200 border-x px-5'
          )}
        >
          <Pencil1Icon className="mb-1 h-6 w-6 text-gray-500 text-sm group-hover:text-blue-600" />
          <span className="text-gray-500 text-sm group-hover:text-blue-600">
            Termini
          </span>
        </Link>
      </div>
    </div>
  );
};
