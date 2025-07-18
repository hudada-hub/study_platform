import Image from 'next/image';
import { clsx } from 'clsx';

interface UserAvatarProps {
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserAvatar = ({ avatarUrl, size = 'md', className }: UserAvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <div className={clsx('rounded-full overflow-hidden', sizeClasses[size], className)}>
      <Image
        width={100}
        height={100}
        src={avatarUrl || '/default-avatar.png'}
        alt="用户头像"
        
        className="object-cover"
        priority
      />
    </div>
  );
};

export default UserAvatar;