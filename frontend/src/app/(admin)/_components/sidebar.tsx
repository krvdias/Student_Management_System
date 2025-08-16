'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Changed from useRouter
import Image from 'next/image';
import {Class, Home, Marks, Payments, Students, Teachers} from '@/resource/icons/index';

function Sidebar() {
  const pathname = usePathname(); // Use usePathname instead of useRouter
  const currentRoute = pathname;

  const menuItems = [
    { name: 'Home', path: '/Home', icon: Home },
    { name: 'Students', path: '/Students', icon: Students },
    { name: 'Teachers', path: '/Teachers', icon: Teachers },
    { name: 'Marks', path: '/Marks', icon: Marks },
    { name: 'Classes & Subjects', path: '/Class-Subject', icon: Class },
    { name: 'Payments', path: '/Payments', icon: Payments },
  ];

  const isActive = (path: string) => {
    return currentRoute.startsWith(path);
  };

  return (
    <aside className="w-64 bg-[#09358B] shadow-sm">
      <div className="h-full overflow-y-auto">
        <nav className="px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors shadow-lg ${
                      active
                        ? 'bg-[#1346DD] text-white'
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    <Image 
                      src={item.icon}
                      alt={item.name}
                      className={`w-7 h-7 ${
                        active ? 'filter brightness-0 invert' : ''
                      }`}
                      width={20}
                      height={20}
                    />
                    <span className="ml-3 text-sm font-semibold">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;