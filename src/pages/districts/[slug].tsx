import React from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout';
import districtsData from '@/data/district_members.json';
import { query } from '@/lib/db';
import {
  MapPin,
  Calendar,
  Building,
  ShieldCheck,
  User,
  Users,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

interface DistrictMember {
  name: string;
  id: string;
  dob: string;
  city: string;
  district: string;
  img: string;
  raw_details: string[];
}

interface DistrictPageProps {
  slug: string;
  districtName: string;
  memberCount: number;
  members: DistrictMember[];
  allDistricts: { name: string; slug: string }[];
}

export default function DistrictDetail({
  slug,
  districtName,
  memberCount,
  members,
  allDistricts,
}: DistrictPageProps) {
  return (
    <Layout
      title={`${districtName} District Committee & Members - APSCA`}
      description={`Official directory of carpenters, committee members, and leaders in ${districtName} district, Andhra Pradesh State Carpenters Association.`}
    >
      {/* Header */}
      <section style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '60px 0', borderBottom: '3px solid var(--accent)' }}>
        <div className="container">
          <Link
            href="/districts"
            style={{ color: 'var(--accent)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '14px', fontWeight: 600 }}
          >
            <ArrowLeft size={14} /> Back to All 26 Districts
          </Link>
          <div className="badge badge-accent" style={{ marginBottom: '10px' }}>
            Andhra Pradesh District Portal
          </div>
          <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '10px' }}>
            {districtName} District
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: '1.05rem' }}>
            District Committee Members & Registered Carpenters ({memberCount} Members Listed)
          </p>
        </div>
      </section>

      {/* Main District Content */}
      <section className="section" style={{ backgroundColor: 'var(--neutral-50)', minHeight: '600px' }}>
        <div className="container">
          
          <div className="district-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
            {/* Left: District Members Grid */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--primary)' }}>
                  Committee Members in {districtName}
                </h2>
                <span className="badge badge-secondary" style={{ fontSize: '0.85rem' }}>
                  {members.length} Members
                </span>
              </div>

              {members.length === 0 ? (
                <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                  <Users size={40} color="var(--neutral-400)" style={{ margin: '0 auto 12px auto' }} />
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '8px' }}>
                    District Membership Updating
                  </h3>
                  <p style={{ color: 'var(--neutral-600)', fontSize: '0.9rem' }}>
                    The committee list for {districtName} is actively being synchronized. If you belong to {districtName}, register below.
                  </p>
                  <Link href="/register" className="btn btn-secondary btn-sm" style={{ marginTop: '16px' }}>
                    Register for {districtName}
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                  {members.map((member: any, index) => {
                    const imgSrc = member.img
                      ? (member.img.startsWith('data:') || member.img.startsWith('/') ? member.img : `/images/${member.img}`)
                      : '/images/worker-holding-an-electric-drill.jpg';
                    const isBase64 = imgSrc.startsWith('data:');

                    return (
                      <div
                        key={index}
                        className="card"
                        style={{
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          borderTop: member.isRegistered ? '3px solid var(--accent)' : '3px solid var(--secondary)'
                        }}
                      >
                        <div>
                          {member.isRegistered && (
                            <div style={{ marginBottom: '10px' }}>
                              <span className="badge badge-accent" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                                ★ Registered Member
                              </span>
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
                            <div
                              style={{
                                position: 'relative',
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                flexShrink: 0,
                                border: member.isRegistered ? '2.5px solid var(--accent)' : '2px solid var(--secondary)',
                                backgroundColor: 'var(--neutral-100)'
                              }}
                            >
                              {isBase64 ? (
                                <img
                                  src={imgSrc}
                                  alt={member.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                <Image
                                  src={imgSrc}
                                  alt={member.name}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                />
                              )}
                            </div>
                            <div>
                              <h3 style={{ fontSize: '1.05rem', color: 'var(--primary)', fontWeight: 700, lineHeight: 1.2 }}>
                                {member.name}
                              </h3>
                              {member.id && (
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: member.isRegistered ? 'var(--accent-hover)' : 'var(--secondary)', marginTop: '2px' }}>
                                  ID: {member.id}
                                </div>
                              )}
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--neutral-700)' }}>
                            {member.city && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Building size={14} color="var(--neutral-400)" />
                                <span>City: {member.city}</span>
                              </div>
                            )}

                            {member.dob && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Calendar size={14} color="var(--neutral-400)" />
                                <span>DOB: {member.dob}</span>
                              </div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <MapPin size={14} color="var(--neutral-400)" />
                              <span>District: {districtName}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--neutral-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--neutral-600)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ShieldCheck size={12} color="var(--secondary)" /> Verified
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                            APSCA Andhra Pradesh
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Quick Districts Sidebar */}
            <div>
              <div className="card" style={{ padding: '20px', position: 'sticky', top: '100px' }}>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid var(--neutral-200)' }}>
                  All 26 Districts
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '500px', overflowY: 'auto' }}>
                  {allDistricts.map((d) => (
                    <Link
                      key={d.slug}
                      href={`/districts/${d.slug}`}
                      style={{
                        padding: '8px 10px',
                        fontSize: '0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        color: d.slug === slug ? 'var(--secondary)' : 'var(--neutral-700)',
                        backgroundColor: d.slug === slug ? 'var(--secondary-soft)' : 'transparent',
                        fontWeight: d.slug === slug ? 700 : 500,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{d.name}</span>
                      <ChevronRight size={14} />
                    </Link>
                  ))}
                </div>

                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--neutral-200)' }}>
                  <Link href="/register" className="btn btn-secondary btn-sm" style={{ width: '100%', textAlign: 'center' }}>
                    Join as Member
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <style jsx>{`
        @media (max-width: 900px) {
          .district-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const rawSlug = (params?.slug as string) || '';
  let resolvedKey = rawSlug.toLowerCase();

  // Alias resolution for Nellore district
  if (resolvedKey === 'sri-potti-sriramulu-nellore' || resolvedKey === 'nellore') {
    resolvedKey = 'sri-potti-sriramulu-nellore-srikakulam';
  }

  // Lookup in dataset
  let dData = (districtsData as any)[resolvedKey];

  if (!dData) {
    // Try matching by district_name
    const found = Object.values(districtsData as any).find(
      (d: any) =>
        (d.district_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') === rawSlug ||
        (d.slug || '').toLowerCase() === rawSlug
    );
    if (found) {
      dData = found;
    }
  }

  if (!dData) {
    return {
      notFound: true,
    };
  }

  // Query database for members registered in this district
  let dbMembers: any[] = [];
  try {
    const rows = await query<any>(
      `SELECT membership_id, full_name, mobile, email, city, district, organization, photo_url, membership_plan, created_at
       FROM members
       WHERE (LOWER(district) = LOWER(?) OR LOWER(district) LIKE LOWER(?))
         AND (status = 'active' OR status IS NULL)
       ORDER BY id DESC`,
      [dData.district_name, `%${dData.district_name}%`]
    );
    dbMembers = rows || [];
  } catch (err) {
    console.error('Error fetching district members from SQLite:', err);
  }

  const registeredDistrictMembers: DistrictMember[] = dbMembers.map((m: any) => ({
    name: m.full_name,
    id: m.membership_id,
    dob: '',
    city: m.city || dData.district_name,
    district: m.district || dData.district_name,
    img: m.photo_url || '',
    isRegistered: true,
    plan: m.membership_plan,
    raw_details: [
      `Plan: ${m.membership_plan}`,
      `Mobile: ${m.mobile}`,
      m.organization ? `Union: ${m.organization}` : 'APSCA Registered Craftsman',
      `Registered: ${m.created_at ? m.created_at.slice(0, 10) : '2026'}`
    ],
  }));

  // Combine newly registered members with baseline committee members
  const baseMembers = dData.members || [];
  const allMembers = [...registeredDistrictMembers, ...baseMembers];

  const allDistricts = Object.keys(districtsData).map((k) => ({
    name: (districtsData as any)[k].district_name,
    slug: k === 'sri-potti-sriramulu-nellore-srikakulam' ? 'sri-potti-sriramulu-nellore' : k,
  }));

  return {
    props: {
      slug: rawSlug,
      districtName: dData.district_name,
      memberCount: allMembers.length,
      members: allMembers,
      allDistricts,
    },
  };
};
