import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout';
import servicesData from '@/data/services_and_events.json';
import {
  Hammer,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Phone
} from 'lucide-react';

interface ServicePageProps {
  slug: string;
  title: string;
  paragraphs: string[];
  images: string[];
  allServices: { name: string; slug: string }[];
}

const SERVICE_IMAGES: Record<string, string> = {
  'furniture-making': '/images/service-furniture-making.jpg',
  'cabinet-makers': '/images/service-cabinet-makers.jpg',
  'wood-carving': '/images/service-wood-carving.jpg',
  'temple-wood-works': '/images/service-temple-wood-works.jpg',
  'toys-making': '/images/service-toys-making.jpg',
  'boat-making': '/images/service-boat-making.jpg',
  'vehicle-interior-exterior': '/images/service-vehicle-interior.jpg',
};

export default function ServiceDetail({
  slug,
  title,
  paragraphs,
  images,
  allServices,
}: ServicePageProps) {
  const heroImg = SERVICE_IMAGES[slug] || '/images/hero-carpenter.jpg';

  return (
    <Layout
      title={`${title} - APSCA Carpentry Services`}
      description={`Learn about ${title} craftsmanship by certified carpenters in Andhra Pradesh, backed by the Andhra Pradesh State Carpenters Association.`}
    >
      {/* Header */}
      <section style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '60px 0', borderBottom: '3px solid var(--accent)' }}>
        <div className="container">
          <div className="badge badge-accent" style={{ marginBottom: '12px' }}>
            APSCA Craftsmanship Discipline
          </div>
          <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '10px' }}>
            {title}
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: '1.05rem' }}>
            Home / Services / {title}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="section" style={{ backgroundColor: 'var(--neutral-50)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '36px' }}>
            
            {/* Left Main Article */}
            <div>
              <div className="card" style={{ padding: '36px', marginBottom: '32px' }}>
                <div style={{ position: 'relative', height: '360px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '28px', boxShadow: 'var(--shadow-md)' }}>
                  <Image
                    src={heroImg}
                    alt={title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                <div className="badge badge-secondary" style={{ marginBottom: '14px' }}>
                  Professional Standards & Heritage
                </div>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '20px' }}>
                  Empowering Carpentry for Future Generations in Andhra Pradesh
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '1.05rem', color: 'var(--neutral-800)', lineHeight: 1.8 }}>
                  {paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </div>

              {/* Callout Card */}
              <div className="card" style={{ backgroundColor: 'var(--primary-soft)', borderLeft: '4px solid var(--secondary)', padding: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '8px' }}>
                  Need a Master Carpenter for {title}?
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--neutral-700)', marginBottom: '16px' }}>
                  Access our verified directory of 4,614 skilled carpenters across Andhra Pradesh with direct phone numbers and local union registration.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link href="/carpenters" className="btn btn-primary btn-sm">
                    Search Carpenters Directory
                  </Link>
                  <Link href="/contact-us" className="btn btn-outline-primary btn-sm">
                    Contact State Association
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div>
              <div className="card" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--neutral-200)' }}>
                  All Carpentry Services
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {allServices.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      style={{
                        padding: '10px 12px',
                        fontSize: '0.9rem',
                        borderRadius: 'var(--radius-sm)',
                        color: s.slug === slug ? 'var(--secondary)' : 'var(--neutral-700)',
                        backgroundColor: s.slug === slug ? 'var(--secondary-soft)' : 'transparent',
                        fontWeight: s.slug === slug ? 700 : 500,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{s.name}</span>
                      <ChevronRight size={14} />
                    </Link>
                  ))}
                </div>

                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--neutral-200)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, marginBottom: '6px', fontSize: '0.9rem' }}>
                    <Phone size={16} color="var(--secondary)" /> State Helpline
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--neutral-600)' }}>
                    9399980781 / 92901 24303
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 320px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const serviceSlugs = [
    'furniture-making',
    'cabinet-makers',
    'wood-carving',
    'temple-wood-works',
    'toys-making',
    'boat-making',
    'vehicle-interior-exterior'
  ];

  return {
    paths: serviceSlugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const sData = (servicesData as any)[slug] || {
    title: slug.replace(/-/g, ' ').toUpperCase(),
    paragraphs: [],
    images: [],
  };

  const allServices = [
    { name: 'Furniture Making', slug: 'furniture-making' },
    { name: 'Cabinet Makers', slug: 'cabinet-makers' },
    { name: 'Wood Carving', slug: 'wood-carving' },
    { name: 'Temple Wood Works', slug: 'temple-wood-works' },
    { name: 'Toys Making', slug: 'toys-making' },
    { name: 'Boat Making', slug: 'boat-making' },
    { name: 'Vehicle Interior & Exterior', slug: 'vehicle-interior-exterior' },
  ];

  return {
    props: {
      slug,
      title: sData.title || slug.replace(/-/g, ' ').toUpperCase(),
      paragraphs: sData.paragraphs || [],
      images: sData.images || [],
      allServices,
    },
  };
};
