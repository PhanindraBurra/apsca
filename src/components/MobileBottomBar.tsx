import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Phone, Users, Award, Home, UserCheck } from 'lucide-react';

export default function MobileBottomBar() {
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === '/') return router.pathname === '/';
    return router.pathname.startsWith(path);
  };

  return (
    <div className="mobile-bottom-nav">
      <Link href="/" className={`bottom-nav-item ${isActive('/') ? 'active' : ''}`}>
        <Home size={19} />
        <span>Home</span>
      </Link>

      <Link href="/carpenters" className={`bottom-nav-item ${isActive('/carpenters') ? 'active' : ''}`}>
        <Users size={19} />
        <span>Directory</span>
      </Link>

      <a href="tel:9399980781" className="bottom-nav-item call-btn">
        <div className="call-icon-bubble">
          <Phone size={18} />
        </div>
        <span>Call President</span>
      </a>

      <Link href="/register" className={`bottom-nav-item ${isActive('/register') ? 'active' : ''}`}>
        <Award size={19} />
        <span>Join APSCA</span>
      </Link>

      <Link href="/member-login" className={`bottom-nav-item ${isActive('/member-login') ? 'active' : ''}`}>
        <UserCheck size={19} />
        <span>Login</span>
      </Link>

      <style jsx>{`
        .mobile-bottom-nav {
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 60px;
            background-color: rgba(26, 43, 76, 0.97);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-top: 2.5px solid var(--accent);
            display: flex;
            align-items: center;
            justify-content: space-around;
            padding: 0 4px;
            z-index: 9999;
            box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.25);
          }

          .bottom-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #CBD5E1;
            text-decoration: none;
            font-size: 0.68rem;
            font-weight: 600;
            gap: 3px;
            flex: 1;
            padding: 6px 0;
            transition: all 0.15s ease;
          }

          .bottom-nav-item.active {
            color: var(--accent);
            font-weight: 700;
          }

          .bottom-nav-item:active {
            transform: scale(0.95);
          }

          .call-btn {
            color: #FFFFFF;
            position: relative;
            top: -10px;
          }

          .call-icon-bubble {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--secondary) 0%, #9E1212 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            box-shadow: 0 4px 12px rgba(200, 30, 30, 0.5);
            border: 2px solid #FFFFFF;
          }

          .call-btn span {
            font-size: 0.64rem;
            color: var(--accent);
            font-weight: 700;
            margin-top: 2px;
          }
        }
      `}</style>
    </div>
  );
}
