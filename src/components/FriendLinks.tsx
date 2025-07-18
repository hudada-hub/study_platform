import { FriendLinksProps } from '@/app/page';
import React from 'react';

export interface FriendLink {
  id: number;
  title: string;
  content: string;
  link: string;
  sort: number;
}

export default function FriendLinks({ links }: FriendLinksProps) {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <h2 className="text-[16px] mb-6">友情链接</h2>
        
        <div className="flex flex-wrap gap-4">
          {links?.sort((a, b) => a.sort - b.sort).map((link) => (
            <a
              key={link.id}
              href={link.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-zinc-50 hover:bg-zinc-100 rounded-full text-sm text-gray-600 transition-colors"
              title={link.content}
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
} 