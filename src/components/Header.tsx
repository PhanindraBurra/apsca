import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  Phone,
  Mail,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Search,
  Award,
  MapPin,
  Lock
} from 'lucide-react';

const DISTRICT_LIST = [
  { name: 'Srikakulam', slug: 'srikakulam' },
  { name: 'Parvathipuram Manyam', slug: 'parvathipuram-manyam' },
  { name: 'Vizianagaram', slug: 'vizianagaram' },
  { name: 'Visakhapatnam', slug: 'visakhapatnam' },
  { name: 'Anakapalli', slug: 'anakapalli' },
  { name: 'Alluri Sitharama Raju', slug: 'alluri-sitharama-raju' },
  { name: 'Kurnool', slug: 'kurnool' },
  { name: 'Nandyal', slug: 'nandyal' },
  { name: 'Sri Potti Sriramulu Nellore', slug: 'sri-potti-sriramulu-nellore' },
  { name: 'Kakinada', slug: 'kakinada' },
  { name: 'Dr. B. R. Ambedkar Konaseema', slug: 'dr-b-r-ambedkar-konaseema' },
  { name: 'East Godavari', slug: 'east-godavari' },
  { name: 'Eluru', slug: 'eluru' },
  { name: 'Krishna', slug: 'krishna' },
  { name: 'West Godavari', slug: 'west-godavari' },
  { name: 'YSR Kadapa', slug: 'ysr-kadapa' },
  { name: 'Anantapuramu', slug: 'anantapuramu' },
  { name: 'Sri Sathya Sai', slug: 'sri-sathya-sai' },
  { name: 'NTR', slug: 'ntr' },
  { name: 'Guntur', slug: 'guntur' },
  { name: 'Bapatla', slug: 'bapatla' },
  { name: 'Palnadu', slug: 'palnadu' },
  { name: 'Prakasam', slug: 'prakasam' },
  { name: 'Tirupati', slug: 'tirupati' },
  { name: 'Chittoor', slug: 'chittoor' },
  { name: 'Annamayya', slug: 'annamayya' },
];

const SERVICES_LIST = [
  { name: 'Furniture Making', slug: 'furniture-making' },
  { name: 'Cabinet Makers', slug: 'cabinet-makers' },
  { name: 'Wood Carving', slug: 'wood-carving' },
  { name: 'Temple Wood Works', slug: 'temple-wood-works' },
  { name: 'Toys Making', slug: 'toys-making' },
  { name: 'Boat Making', slug: 'boat-making' },
  { name: 'Vehicle Interior & Exterior', slug: 'vehicle-interior-exterior' },
];

const EVENTS_LIST = [
  { name: "India's Biggest Skill Competition", slug: 'indias-biggest-skill-competition' },
  { name: 'World Skill Competition', slug: 'world-skill-competition-2' },
];

export default function Header() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [districtsDropdownOpen, setDistrictsDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);

  // Mobile drawer accordions
  const [mobileDistrictsOpen, setMobileDistrictsOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileEventsOpen, setMobileEventsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDistrictsDropdownOpen(false);
    setServicesDropdownOpen(false);
    setEventsDropdownOpen(false);
    setMobileDistrictsOpen(false);
    setMobileServicesOpen(false);
    setMobileEventsOpen(false);
  }, [router.asPath]);

  const isActive = (path: string) => {
    if (path === '/') return router.pathname === '/';
    return router.pathname.startsWith(path);
  };

  return (
    <header className="header-wrapper" style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%' }}>
      {/* Top Notification Bar - Sleek on Phones, Detailed on Desktop */}
      <div
        style={{
          backgroundColor: 'var(--primary)',
          color: '#E2E8F0',
          fontSize: '0.80rem',
          padding: '6px 0',
          borderBottom: '1px solid rgba(255,255,255,0.12)'
        }}
      >
        <div
          className="header-container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {/* Contact Numbers */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a
              href="tel:9399980781"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontWeight: 600,
                whiteSpace: 'nowrap'
              }}
            >
              <Phone size={13} color="var(--accent)" />
              <span>9399980781</span>
            </a>
            <span className="hide-on-mobile" style={{ opacity: 0.35 }}>|</span>
            <span className="hide-on-mobile" style={{ whiteSpace: 'nowrap' }}>92901 24303, 9866820997</span>
            <span className="hide-on-mobile" style={{ opacity: 0.35 }}>|</span>
            <a
              href="mailto:apscapresident@gmail.com"
              className="hide-on-mobile"
              style={{ color: '#E2E8F0', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#E2E8F0')}
            >
              apscapresident@gmail.com
            </a>
          </div>

          {/* Govt Recognition & Admin Portal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', whiteSpace: 'nowrap' }}>
            <span
              className="hide-on-mobile"
              style={{
                color: 'var(--accent)',
                fontWeight: 600,
                fontSize: '0.80rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ShieldCheck size={13} /> Govt. Recognized AP Carpenters Association
            </span>
            <span className="hide-on-mobile" style={{ display: 'inline-block', opacity: 0.35 }}>|</span>
            <Link
              href="/admin"
              style={{
                color: '#CBD5E1',
                fontSize: '0.80rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#CBD5E1')}
            >
              <Lock size={12} /> Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        style={{
          backgroundColor: 'var(--neutral-white)',
          boxShadow: isScrolled ? '0 4px 16px rgba(26,43,76,0.10)' : '0 2px 8px rgba(26,43,76,0.06)',
          transition: 'all 0.25s ease',
          borderBottom: '3px solid var(--accent)'
        }}
      >
        <div
          className="header-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '8px',
            paddingBottom: '8px',
            gap: '10px'
          }}
        >
          {/* Logo & Identity */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              flexShrink: 0
            }}
          >
            <div style={{ position: 'relative', width: '44px', height: '44px', flexShrink: 0 }}>
              <Image
                src="/logo.png"
                alt="APSCA Official Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  fontSize: '1.30rem',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  lineHeight: 1,
                  letterSpacing: '-0.3px',
                  whiteSpace: 'nowrap'
                }}
              >
                APSCA
              </div>
              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: 'var(--secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  whiteSpace: 'nowrap'
                }}
              >
                AP State Carpenters Association
              </div>
              <div
                style={{
                  fontSize: '0.62rem',
                  color: 'var(--neutral-600)',
                  whiteSpace: 'nowrap',
                  lineHeight: 1.15
                }}
                className="telugu-text hide-on-mobile"
              >
                ఆంధ్రప్రదేశ్ రాష్ట్ర కార్పెంటర్స్ అసోసియేషన్
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links (>= 1080px) */}
          <div
            className="desktop-nav"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(3px, 0.75vw, 12px)',
              flexShrink: 0
            }}
          >
            <Link
              href="/"
              style={{
                whiteSpace: 'nowrap',
                fontSize: '0.86rem',
                fontWeight: isActive('/') ? 700 : 600,
                color: isActive('/') ? 'var(--secondary)' : 'var(--neutral-800)',
                padding: '6px 8px',
                borderRadius: '6px',
                borderBottom: isActive('/') ? '2.5px solid var(--secondary)' : '2.5px solid transparent',
                transition: 'all 0.15s ease'
              }}
            >
              Home
            </Link>

            <Link
              href="/about-us"
              style={{
                whiteSpace: 'nowrap',
                fontSize: '0.86rem',
                fontWeight: isActive('/about-us') ? 700 : 600,
                color: isActive('/about-us') ? 'var(--secondary)' : 'var(--neutral-800)',
                padding: '6px 8px',
                borderRadius: '6px',
                borderBottom: isActive('/about-us') ? '2.5px solid var(--secondary)' : '2.5px solid transparent',
                transition: 'all 0.15s ease'
              }}
            >
              About Us
            </Link>

            {/* Districts (26) Dropdown */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setDistrictsDropdownOpen(true)}
              onMouseLeave={() => setDistrictsDropdownOpen(false)}
            >
              <Link
                href="/districts"
                style={{
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  fontSize: '0.86rem',
                  fontWeight: isActive('/districts') ? 700 : 600,
                  color: isActive('/districts') ? 'var(--secondary)' : 'var(--neutral-800)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  cursor: 'pointer',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  borderBottom: isActive('/districts') ? '2.5px solid var(--secondary)' : '2.5px solid transparent'
                }}
              >
                <span>Districts (26)</span>
                <ChevronDown size={13} />
              </Link>

              {districtsDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '-100px',
                    width: '640px',
                    backgroundColor: 'var(--neutral-white)',
                    boxShadow: '0 12px 32px rgba(26,43,76,0.18)',
                    borderRadius: '12px',
                    padding: '18px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '6px 14px',
                    border: '1px solid var(--neutral-200)',
                    borderTop: '3px solid var(--secondary)',
                    zIndex: 1000
                  }}
                >
                  <div style={{ gridColumn: 'span 3', paddingBottom: '8px', borderBottom: '1px solid var(--neutral-200)', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link
                      href="/districts"
                      style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', textDecoration: 'none' }}
                    >
                      All 26 Districts of Andhra Pradesh →
                    </Link>
                    <span style={{ fontSize: '0.74rem', color: 'var(--neutral-600)' }}>
                      District Committee & Members
                    </span>
                  </div>
                  {DISTRICT_LIST.map((dist) => (
                    <Link
                      key={dist.slug}
                      href={`/districts/${dist.slug}`}
                      style={{
                        fontSize: '0.83rem',
                        color: router.asPath === `/districts/${dist.slug}` ? 'var(--secondary)' : 'var(--neutral-700)',
                        padding: '5px 7px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--primary-soft)';
                        e.currentTarget.style.color = 'var(--primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--neutral-700)';
                      }}
                    >
                      <MapPin size={12} color="var(--secondary)" />
                      {dist.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/members"
              style={{
                whiteSpace: 'nowrap',
                fontSize: '0.86rem',
                fontWeight: isActive('/members') ? 700 : 600,
                color: isActive('/members') ? 'var(--secondary)' : 'var(--neutral-800)',
                padding: '6px 8px',
                borderRadius: '6px',
                borderBottom: isActive('/members') ? '2.5px solid var(--secondary)' : '2.5px solid transparent'
              }}
            >
              Members
            </Link>

            <Link
              href="/carpenters"
              style={{
                whiteSpace: 'nowrap',
                fontSize: '0.86rem',
                fontWeight: isActive('/carpenters') ? 700 : 600,
                color: isActive('/carpenters') ? 'var(--secondary)' : 'var(--neutral-800)',
                padding: '6px 8px',
                borderRadius: '6px',
                borderBottom: isActive('/carpenters') ? '2.5px solid var(--secondary)' : '2.5px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Search size={13} color="var(--primary)" />
              <span>Carpenters Directory</span>
            </Link>

            {/* Services Dropdown */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  whiteSpace: 'nowrap',
                  fontSize: '0.86rem',
                  fontWeight: isActive('/services') ? 700 : 600,
                  color: isActive('/services') ? 'var(--secondary)' : 'var(--neutral-800)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  cursor: 'pointer',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  borderBottom: isActive('/services') ? '2.5px solid var(--secondary)' : '2.5px solid transparent'
                }}
              >
                <span>Services</span>
                <ChevronDown size={13} />
              </button>

              {servicesDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '240px',
                    backgroundColor: 'var(--neutral-white)',
                    boxShadow: '0 10px 25px rgba(26,43,76,0.15)',
                    borderRadius: '10px',
                    padding: '8px',
                    border: '1px solid var(--neutral-200)',
                    borderTop: '3px solid var(--primary)',
                    zIndex: 1000
                  }}
                >
                  {SERVICES_LIST.map((svc) => (
                    <Link
                      key={svc.slug}
                      href={`/services/${svc.slug}`}
                      style={{
                        display: 'block',
                        fontSize: '0.84rem',
                        color: 'var(--neutral-700)',
                        padding: '7px 10px',
                        borderRadius: '6px',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--primary-soft)';
                        e.currentTarget.style.color = 'var(--primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--neutral-700)';
                      }}
                    >
                      {svc.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Events Dropdown */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setEventsDropdownOpen(true)}
              onMouseLeave={() => setEventsDropdownOpen(false)}
            >
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  whiteSpace: 'nowrap',
                  fontSize: '0.86rem',
                  fontWeight: isActive('/events') ? 700 : 600,
                  color: isActive('/events') ? 'var(--secondary)' : 'var(--neutral-800)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  cursor: 'pointer',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  borderBottom: isActive('/events') ? '2.5px solid var(--secondary)' : '2.5px solid transparent'
                }}
              >
                <span>Events</span>
                <ChevronDown size={13} />
              </button>

              {eventsDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '270px',
                    backgroundColor: 'var(--neutral-white)',
                    boxShadow: '0 10px 25px rgba(26,43,76,0.15)',
                    borderRadius: '10px',
                    padding: '8px',
                    border: '1px solid var(--neutral-200)',
                    borderTop: '3px solid var(--primary)',
                    zIndex: 1000
                  }}
                >
                  {EVENTS_LIST.map((ev) => (
                    <Link
                      key={ev.slug}
                      href={`/events/${ev.slug}`}
                      style={{
                        display: 'block',
                        fontSize: '0.84rem',
                        color: 'var(--neutral-700)',
                        padding: '7px 10px',
                        borderRadius: '6px',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--primary-soft)';
                        e.currentTarget.style.color = 'var(--primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--neutral-700)';
                      }}
                    >
                      {ev.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/contact-us"
              style={{
                whiteSpace: 'nowrap',
                fontSize: '0.86rem',
                fontWeight: isActive('/contact-us') ? 700 : 600,
                color: isActive('/contact-us') ? 'var(--secondary)' : 'var(--neutral-800)',
                padding: '6px 8px',
                borderRadius: '6px',
                borderBottom: isActive('/contact-us') ? '2.5px solid var(--secondary)' : '2.5px solid transparent'
              }}
            >
              Contact Us
            </Link>
          </div>

          {/* Action Buttons & Mobile Menu Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Member Login Button (Always visible) */}
            <Link
              href="/member-login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap',
                padding: '6px 12px',
                fontSize: '0.80rem',
                fontWeight: 600,
                color: 'var(--primary)',
                backgroundColor: 'transparent',
                border: '1.5px solid var(--primary)',
                borderRadius: '6px',
                textDecoration: 'none',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--primary)';
              }}
            >
              <UserCheck size={14} />
              <span>Login</span>
            </Link>

            {/* Become a Member Button (Desktop & Tablet) */}
            <Link
              href="/register"
              className="hide-on-mobile"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap',
                padding: '7px 15px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#FFFFFF',
                backgroundColor: 'var(--secondary)',
                border: '1.5px solid var(--secondary)',
                borderRadius: '6px',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(200, 30, 30, 0.28)',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--secondary-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--secondary)';
              }}
            >
              <Award size={14} />
              <span>Become a Member</span>
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                lineHeight: 1
              }}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Phone Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderTop: '2px solid var(--accent)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {/* Top Prominent CTA Buttons for Phone */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              <Link
                href="/register"
                className="btn btn-secondary"
                style={{ width: '100%', height: '44px', fontWeight: 700, fontSize: '0.92rem', boxShadow: '0 3px 10px rgba(200,30,30,0.3)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Award size={18} />
                <span>Become a Member (Join Now)</span>
              </Link>
              <Link
                href="/member-login"
                className="btn btn-outline-primary"
                style={{ width: '100%', height: '42px', fontWeight: 600, fontSize: '0.88rem' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserCheck size={16} />
                <span>Member Profile Login / ID Card</span>
              </Link>
            </div>

            {/* Primary Page Navigation */}
            <Link
              href="/"
              style={{
                padding: '10px 12px',
                fontSize: '1rem',
                fontWeight: 600,
                color: isActive('/') ? 'var(--secondary)' : 'var(--primary)',
                borderRadius: '8px',
                backgroundColor: isActive('/') ? 'var(--secondary-soft)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Home</span>
              <ChevronRight size={16} color="var(--neutral-400)" />
            </Link>

            <Link
              href="/about-us"
              style={{
                padding: '10px 12px',
                fontSize: '1rem',
                fontWeight: 600,
                color: isActive('/about-us') ? 'var(--secondary)' : 'var(--primary)',
                borderRadius: '8px',
                backgroundColor: isActive('/about-us') ? 'var(--secondary-soft)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>About Us (శ్రీ విశ్వకర్మ చరిత్ర)</span>
              <ChevronRight size={16} color="var(--neutral-400)" />
            </Link>

            <Link
              href="/members"
              style={{
                padding: '10px 12px',
                fontSize: '1rem',
                fontWeight: 600,
                color: isActive('/members') ? 'var(--secondary)' : 'var(--primary)',
                borderRadius: '8px',
                backgroundColor: isActive('/members') ? 'var(--secondary-soft)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>State Leadership Team</span>
              <ChevronRight size={16} color="var(--neutral-400)" />
            </Link>

            <Link
              href="/carpenters"
              style={{
                padding: '10px 12px',
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--secondary)',
                borderRadius: '8px',
                backgroundColor: 'rgba(200,30,30,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Search size={16} /> Carpenters Directory (4,614)
              </span>
              <span className="badge badge-secondary" style={{ fontSize: '0.70rem' }}>SEARCH</span>
            </Link>

            {/* Collapsible Mobile Accordion: Districts (26) */}
            <div style={{ borderTop: '1px solid var(--neutral-200)', marginTop: '6px', paddingTop: '6px' }}>
              <button
                type="button"
                onClick={() => setMobileDistrictsOpen(!mobileDistrictsOpen)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  borderRadius: '8px'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="var(--secondary)" />
                  <span>Andhra Pradesh Districts (26)</span>
                </span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: mobileDistrictsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }}
                />
              </button>

              {mobileDistrictsOpen && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '6px',
                    padding: '8px 12px',
                    backgroundColor: 'var(--neutral-50)',
                    borderRadius: '8px',
                    marginTop: '4px'
                  }}
                >
                  <Link
                    href="/districts"
                    style={{
                      gridColumn: '1 / -1',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: 'var(--secondary)',
                      padding: '6px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--secondary-soft)',
                      textAlign: 'center',
                      marginBottom: '4px',
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    View All 26 Districts Directory →
                  </Link>
                  {DISTRICT_LIST.map((dist) => (
                    <Link
                      key={dist.slug}
                      href={`/districts/${dist.slug}`}
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--neutral-800)',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'white',
                        border: '1px solid var(--neutral-200)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <MapPin size={10} color="var(--secondary)" />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dist.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Collapsible Mobile Accordion: Services (7) */}
            <div style={{ borderTop: '1px solid var(--neutral-200)', paddingTop: '6px' }}>
              <button
                type="button"
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  borderRadius: '8px'
                }}
              >
                <span>Carpentry Services (7)</span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: mobileServicesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }}
                />
              </button>

              {mobileServicesOpen && (
                <div style={{ padding: '6px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {SERVICES_LIST.map((svc) => (
                    <Link
                      key={svc.slug}
                      href={`/services/${svc.slug}`}
                      style={{
                        padding: '6px 8px',
                        fontSize: '0.85rem',
                        color: 'var(--neutral-700)',
                        borderRadius: '4px'
                      }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      • {svc.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Collapsible Mobile Accordion: Events & Competitions */}
            <div style={{ borderTop: '1px solid var(--neutral-200)', paddingTop: '6px' }}>
              <button
                type="button"
                onClick={() => setMobileEventsOpen(!mobileEventsOpen)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  borderRadius: '8px'
                }}
              >
                <span>Competitions & Events (2)</span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: mobileEventsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }}
                />
              </button>

              {mobileEventsOpen && (
                <div style={{ padding: '6px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {EVENTS_LIST.map((ev) => (
                    <Link
                      key={ev.slug}
                      href={`/events/${ev.slug}`}
                      style={{
                        padding: '6px 8px',
                        fontSize: '0.85rem',
                        color: 'var(--neutral-700)',
                        borderRadius: '4px'
                      }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      • {ev.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/contact-us"
              style={{
                padding: '10px 12px',
                fontSize: '1rem',
                fontWeight: 600,
                color: isActive('/contact-us') ? 'var(--secondary)' : 'var(--primary)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--neutral-200)',
                marginTop: '6px'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Contact Us</span>
              <ChevronRight size={16} color="var(--neutral-400)" />
            </Link>

            <Link
              href="/admin"
              style={{
                padding: '8px 12px',
                fontSize: '0.85rem',
                color: 'var(--neutral-600)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Lock size={14} />
              <span>Admin Management Portal</span>
            </Link>

            {/* Quick Mobile Call Assistance */}
            <div style={{ marginTop: '12px', padding: '14px', backgroundColor: 'var(--primary-soft)', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.80rem', color: 'var(--neutral-600)', marginBottom: '6px' }}>Need immediate carpenter assistance?</div>
              <a
                href="tel:9399980781"
                className="btn btn-primary btn-sm"
                style={{ width: '100%', fontWeight: 700 }}
              >
                <Phone size={14} /> Call President: 9399980781
              </a>
            </div>
          </div>
        )}
      </nav>

      <style jsx>{`
        @media (max-width: 1080px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}
