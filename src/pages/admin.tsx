import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout';
import {
  Lock,
  Download,
  Search,
  Filter,
  Users,
  CheckCircle,
  Clock,
  ShieldCheck,
  Eye,
  Edit,
  Trash2,
  X,
  CreditCard,
  Building,
  RefreshCw,
  LogOut,
  AlertCircle,
  Save,
  User,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

const DISTRICTS = [
  'Srikakulam', 'Parvathipuram Manyam', 'Vizianagaram', 'Visakhapatnam',
  'Anakapalli', 'Alluri Sitharama Raju', 'Kurnool', 'Nandyal',
  'Sri Potti Sriramulu Nellore', 'Kakinada', 'Dr. B. R. Ambedkar Konaseema',
  'East Godavari', 'Eluru', 'Krishna', 'West Godavari', 'YSR Kadapa',
  'Anantapuramu', 'Sri Sathya Sai', 'NTR', 'Guntur', 'Bapatla',
  'Palnadu', 'Prakasam', 'Tirupati', 'Chittoor', 'Annamayya'
];

export default function AdminPortal() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const [members, setMembers] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0 });
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected member for detail view modal
  const [selectedMember, setSelectedMember] = useState<any>(null);

  // Member being edited in edit modal
  const [editingMember, setEditingMember] = useState<any>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Session persistence on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPw = sessionStorage.getItem('apsca_admin_pw');
      if (storedPw) {
        setPassword(storedPw);
        fetchMembers(storedPw);
      }
    }
  }, []);

  // Auto-refresh polling every 12 seconds when authenticated
  useEffect(() => {
    if (!isAuthenticated || !password) return;
    const interval = setInterval(() => {
      fetchMembers(password, true);
    }, 12000);
    return () => clearInterval(interval);
  }, [isAuthenticated, password, searchTerm, districtFilter, planFilter, statusFilter]);

  // Debounced auto-fetch on filter change
  useEffect(() => {
    if (!isAuthenticated || !password) return;
    const timer = setTimeout(() => {
      fetchMembers(password);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, districtFilter, planFilter, statusFilter]);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const fetchMembers = async (pw: string, silent = false) => {
    if (!silent) setLoading(true);
    else setIsRefreshing(true);

    try {
      const url = new URL('/api/admin/members', window.location.origin);
      if (searchTerm) url.searchParams.set('search', searchTerm);
      if (districtFilter) url.searchParams.set('district', districtFilter);
      if (planFilter) url.searchParams.set('plan', planFilter);
      if (statusFilter) url.searchParams.set('status', statusFilter);

      const res = await fetch(url.toString(), {
        headers: { 'x-admin-password': pw },
      });

      const data = await res.json();
      if (res.ok) {
        setMembers(data.members || []);
        if (data.stats) setStats(data.stats);
        setIsAuthenticated(true);
        setAuthError('');
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('apsca_admin_pw', pw);
        }
      } else {
        setAuthError(data.error || 'Invalid password.');
        setIsAuthenticated(false);
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('apsca_admin_pw');
        }
      }
    } catch (err: any) {
      setAuthError('Connection error: ' + err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMembers(password);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setMembers([]);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('apsca_admin_pw');
    }
  };

  // Quick Status Toggle (e.g. Mark Paid)
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/members', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ id, payment_status: newStatus, status: 'active' }),
      });

      if (res.ok) {
        fetchMembers(password, true);
        showToast(`Member #${id} marked as ${newStatus.toUpperCase()}`);
        if (selectedMember && selectedMember.id === id) {
          setSelectedMember({ ...selectedMember, payment_status: newStatus });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Full Details Update Form Submit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    setEditLoading(true);
    setEditError('');

    try {
      const res = await fetch('/api/admin/members', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify(editingMember),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update member.');
      }

      showToast(`Member "${editingMember.full_name}" details updated successfully!`);
      setEditingMember(null);
      fetchMembers(password, true);
      if (selectedMember && selectedMember.id === editingMember.id) {
        setSelectedMember(data.member);
      }
    } catch (err: any) {
      setEditError(err.message || 'Error updating member.');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete Member
  const handleDeleteMember = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete member "${name}" (ID: ${id})? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch('/api/admin/members', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        showToast(`Member "${name}" deleted.`);
        fetchMembers(password, true);
        if (selectedMember && selectedMember.id === id) setSelectedMember(null);
        if (editingMember && editingMember.id === id) setEditingMember(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    window.open(`/api/admin/export?password=${encodeURIComponent(password)}`, '_blank');
  };

  return (
    <Layout
      title="Admin Portal - APSCA"
      description="Password-protected admin portal to manage member registrations, update details, verify payment status, and export records."
    >
      {/* Toast Notification */}
      {successToast && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            backgroundColor: '#16A34A',
            color: 'white',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 700,
            fontSize: '0.9rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <CheckCircle size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <section style={{ backgroundColor: 'var(--primary-dark)', color: 'white', padding: '36px 0', borderBottom: '3px solid var(--accent)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="badge badge-accent" style={{ marginBottom: '6px' }}>
              Management Portal
            </div>
            <h1 style={{ color: 'white', fontSize: '1.9rem', margin: 0, fontWeight: 800 }}>
              APSCA Administrative Dashboard
            </h1>
          </div>

          {isAuthenticated && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => fetchMembers(password)}
                className="btn btn-outline-white btn-sm"
                title="Refresh Member List"
              >
                <RefreshCw size={14} className={isRefreshing || loading ? 'animate-spin' : ''} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="btn btn-secondary btn-sm"
                style={{ fontWeight: 700 }}
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-outline-white btn-sm"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="section" style={{ backgroundColor: 'var(--neutral-50)', minHeight: '800px', padding: '32px 0' }}>
        <div className="container">
          
          {/* Login Gate */}
          {!isAuthenticated ? (
            <div style={{ maxWidth: '440px', margin: '40px auto' }}>
              <div className="card" style={{ padding: '36px', borderTop: '4px solid var(--primary)', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <Lock size={28} color="var(--primary)" />
                </div>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '8px' }}>
                  Admin Authorization Required
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--neutral-600)', marginBottom: '20px' }}>
                  Please enter your executive administrator password to access the members database.
                </p>

                {authError && (
                  <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.85rem' }}>
                    {authError}
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <input
                      type="password"
                      required
                      placeholder="Enter Admin Password (e.g. admin123)"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ width: '100%', fontWeight: 700 }}
                  >
                    {loading ? 'Verifying...' : 'Unlock Admin Portal'}
                  </button>

                  <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--neutral-200)' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setPassword('admin123');
                        fetchMembers('admin123');
                      }}
                      style={{
                        background: 'var(--primary-soft)',
                        border: '1px dashed var(--primary)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: 'var(--primary)',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Lock size={12} />
                      <span>Click to Auto-fill: <strong>admin123</strong></span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div>
              {/* Stats KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div className="card" style={{ borderLeft: '4px solid var(--primary)', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--neutral-600)', fontWeight: 600 }}>Total Registered</span>
                    <Users size={20} color="var(--primary)" />
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginTop: '6px' }}>
                    {stats.total}
                  </div>
                </div>

                <div className="card" style={{ borderLeft: '4px solid #16A34A', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--neutral-600)', fontWeight: 600 }}>Active / Paid</span>
                    <CheckCircle size={20} color="#16A34A" />
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16A34A', marginTop: '6px' }}>
                    {stats.paid}
                  </div>
                </div>

                <div className="card" style={{ borderLeft: '4px solid var(--secondary)', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--neutral-600)', fontWeight: 600 }}>Pending Approval</span>
                    <Clock size={20} color="var(--secondary)" />
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '6px' }}>
                    {stats.pending}
                  </div>
                </div>
              </div>

              {/* Filters Toolbar */}
              <div className="card" style={{ padding: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', alignItems: 'center' }}>
                  
                  <div style={{ position: 'relative' }}>
                    <Search size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Search name, mobile, ID..."
                      className="form-control"
                      style={{ paddingLeft: '36px', height: '40px', fontSize: '0.85rem' }}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <select
                    className="form-control"
                    style={{ height: '40px', fontSize: '0.85rem' }}
                    value={districtFilter}
                    onChange={(e) => setDistrictFilter(e.target.value)}
                  >
                    <option value="">All 26 Districts</option>
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>

                  <select
                    className="form-control"
                    style={{ height: '40px', fontSize: '0.85rem' }}
                    value={planFilter}
                    onChange={(e) => setPlanFilter(e.target.value)}
                  >
                    <option value="">All Plans</option>
                    <option value="General membership">General (Free)</option>
                    <option value="State Committee membership">State Committee (₹300)</option>
                    <option value="State Executive Membership">State Executive (₹900)</option>
                  </select>

                  <select
                    className="form-control"
                    style={{ height: '40px', fontSize: '0.85rem' }}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="free">Free</option>
                    <option value="pending_verification">Pending Verification</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => fetchMembers(password)}
                    className="btn btn-primary btn-sm"
                    style={{ height: '40px', fontWeight: 600 }}
                  >
                    <RefreshCw size={13} />
                    <span>Apply Filter</span>
                  </button>

                </div>
              </div>

              {/* Members Table */}
              <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                      <tr>
                        <th style={{ padding: '12px 14px' }}>Photo</th>
                        <th style={{ padding: '12px 14px' }}>Membership ID</th>
                        <th style={{ padding: '12px 14px' }}>Member Name</th>
                        <th style={{ padding: '12px 14px' }}>Mobile & Email</th>
                        <th style={{ padding: '12px 14px' }}>District</th>
                        <th style={{ padding: '12px 14px' }}>Plan & Fee</th>
                        <th style={{ padding: '12px 14px' }}>Payment Status</th>
                        <th style={{ padding: '12px 14px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: 'var(--neutral-500)' }}>
                            No registered members match the selected filter.
                          </td>
                        </tr>
                      ) : (
                        members.map((m) => (
                          <tr key={m.id} style={{ borderBottom: '1px solid var(--neutral-200)', transition: 'background-color 0.15s ease' }}>
                            <td style={{ padding: '10px 14px' }}>
                              <div style={{ position: 'relative', width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--neutral-200)' }}>
                                {m.photo_url ? (
                                  <Image src={m.photo_url} alt={m.full_name} fill style={{ objectFit: 'cover' }} />
                                ) : (
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--neutral-600)', fontSize: '0.75rem', fontWeight: 700 }}>
                                    {m.full_name?.charAt(0) || 'M'}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--primary)' }}>
                              {m.membership_id}
                            </td>
                            <td style={{ padding: '10px 14px', fontWeight: 600 }}>
                              {m.full_name}
                            </td>
                            <td style={{ padding: '10px 14px', color: 'var(--neutral-600)' }}>
                              <div>{m.mobile}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>{m.email}</div>
                            </td>
                            <td style={{ padding: '10px 14px' }}>
                              {m.district || '-'}
                            </td>
                            <td style={{ padding: '10px 14px' }}>
                              <div style={{ fontWeight: 600, color: 'var(--neutral-800)' }}>
                                {m.membership_plan}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 700 }}>
                                ₹ {m.amount || 0}
                              </div>
                            </td>
                            <td style={{ padding: '10px 14px' }}>
                              <span
                                className="badge"
                                style={{
                                  backgroundColor:
                                    m.payment_status === 'paid' || m.payment_status === 'free'
                                      ? '#DCFCE7'
                                      : '#FEF3C7',
                                  color:
                                    m.payment_status === 'paid' || m.payment_status === 'free'
                                      ? '#166534'
                                      : '#92400E',
                                  fontSize: '0.72rem',
                                  fontWeight: 700
                                }}
                              >
                                {(m.payment_status || 'PENDING').toUpperCase()}
                              </span>
                            </td>
                            <td style={{ padding: '10px 14px' }}>
                              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                {/* View Profile */}
                                <button
                                  type="button"
                                  onClick={() => setSelectedMember(m)}
                                  className="btn btn-outline-primary btn-sm"
                                  style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                                  title="View Full Profile"
                                >
                                  <Eye size={12} /> View
                                </button>

                                {/* Edit Member Details */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingMember({ ...m });
                                    setEditError('');
                                  }}
                                  className="btn btn-outline-secondary btn-sm"
                                  style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                                  title="Edit Member Details"
                                >
                                  <Edit size={12} /> Edit
                                </button>

                                {/* Mark Paid quick action */}
                                {m.payment_status !== 'paid' && m.payment_status !== 'free' && (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateStatus(m.id, 'paid')}
                                    className="btn btn-secondary btn-sm"
                                    style={{ padding: '4px 8px', fontSize: '0.75rem', fontWeight: 700 }}
                                    title="Quick Approve / Mark Paid"
                                  >
                                    Mark Paid
                                  </button>
                                )}

                                {/* Delete Record */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMember(m.id, m.full_name)}
                                  className="btn btn-outline-danger btn-sm"
                                  style={{ padding: '4px 6px', fontSize: '0.75rem', color: '#DC2626', borderColor: '#FCA5A5' }}
                                  title="Delete Record"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* Member Profile Modal (View Only) */}
          {selectedMember && !editingMember && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000,
                padding: '20px'
              }}
            >
              <div className="card" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '30px', position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neutral-600)' }}
                >
                  <X size={22} />
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--neutral-200)', paddingBottom: '10px' }}>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)', margin: 0 }}>
                    Member Full Profile
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMember({ ...selectedMember });
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  >
                    <Edit size={12} /> Edit Details
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div style={{ position: 'relative', width: '120px', height: '140px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--neutral-300)', backgroundColor: 'var(--neutral-100)' }}>
                    {selectedMember.photo_url ? (
                      <Image src={selectedMember.photo_url} alt={selectedMember.full_name} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Users size={32} color="var(--neutral-400)" />
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem' }}>
                    <div><strong>Membership ID:</strong> <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>{selectedMember.membership_id}</span></div>
                    <div><strong>Full Name:</strong> {selectedMember.full_name}</div>
                    <div><strong>Mobile:</strong> {selectedMember.mobile}</div>
                    <div><strong>Email:</strong> {selectedMember.email}</div>
                    <div><strong>DOB / Gender:</strong> {selectedMember.dob || '-'} ({selectedMember.gender})</div>
                    <div><strong>Address:</strong> {selectedMember.address}, {selectedMember.city}, {selectedMember.district} - {selectedMember.pincode}</div>
                    <div><strong>Plan:</strong> {selectedMember.membership_plan} (Fee: ₹{selectedMember.amount})</div>
                    <div><strong>Payment Status:</strong> <span style={{ fontWeight: 700, color: selectedMember.payment_status === 'paid' ? '#16A34A' : '#D97706' }}>{(selectedMember.payment_status || 'PENDING').toUpperCase()}</span></div>
                    {selectedMember.payment_id && <div><strong>Txn Ref:</strong> {selectedMember.payment_id}</div>}
                    <div><strong>Specialization:</strong> {selectedMember.organization}</div>
                    {selectedMember.nominee_name && <div><strong>Nominee:</strong> {selectedMember.nominee_name}</div>}
                    {selectedMember.local_union_address && <div><strong>Local Union:</strong> {selectedMember.local_union_address}</div>}
                  </div>
                </div>

                {/* ID Proof Display if attached */}
                {selectedMember.id_proof_url && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--neutral-200)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '8px' }}>
                      Attached ID Proof Document:
                    </div>
                    <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--neutral-300)' }}>
                      <Image src={selectedMember.id_proof_url} alt="ID Proof" fill style={{ objectFit: 'contain' }} />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedMember(null)}
                    className="btn btn-outline-primary btn-sm"
                  >
                    Close
                  </button>

                  {selectedMember.payment_status !== 'paid' && selectedMember.payment_status !== 'free' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedMember.id, 'paid')}
                      className="btn btn-secondary btn-sm"
                    >
                      Approve & Mark Paid
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* EDIT MEMBER DETAILS MODAL */}
          {editingMember && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2100,
                padding: '20px'
              }}
            >
              <div
                className="card"
                style={{
                  maxWidth: '740px',
                  width: '100%',
                  maxHeight: '92vh',
                  overflowY: 'auto',
                  padding: '30px',
                  position: 'relative',
                  borderTop: '4px solid var(--secondary)'
                }}
              >
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neutral-600)' }}
                >
                  <X size={22} />
                </button>

                <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--neutral-200)', paddingBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', margin: 0, fontWeight: 800 }}>
                    Edit Member Details ({editingMember.membership_id})
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--neutral-600)', margin: '4px 0 0 0' }}>
                    Update member profile information, district, plan, and payment verification status.
                  </p>
                </div>

                {editError && (
                  <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={16} />
                    <span>{editError}</span>
                  </div>
                )}

                <form onSubmit={handleSaveEdit}>
                  
                  {/* Personal Fields */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '18px' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={editingMember.full_name || ''}
                        onChange={(e) => setEditingMember({ ...editingMember, full_name: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        className="form-control"
                        value={editingMember.mobile || ''}
                        onChange={(e) => setEditingMember({ ...editingMember, mobile: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        required
                        className="form-control"
                        value={editingMember.email || ''}
                        onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        className="form-control"
                        value={editingMember.dob || ''}
                        onChange={(e) => setEditingMember({ ...editingMember, dob: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <select
                        className="form-control"
                        value={editingMember.gender || 'Male'}
                        onChange={(e) => setEditingMember({ ...editingMember, gender: e.target.value })}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">District (Andhra Pradesh) *</label>
                      <select
                        className="form-control"
                        value={editingMember.district || ''}
                        onChange={(e) => setEditingMember({ ...editingMember, district: e.target.value })}
                      >
                        {DISTRICTS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Address Fields */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '18px' }}>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Street / Door No. Address</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingMember.address || ''}
                        onChange={(e) => setEditingMember({ ...editingMember, address: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">City / Town / Mandal</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingMember.city || ''}
                        onChange={(e) => setEditingMember({ ...editingMember, city: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">PIN Code</label>
                      <input
                        type="text"
                        maxLength={6}
                        className="form-control"
                        value={editingMember.pincode || ''}
                        onChange={(e) => setEditingMember({ ...editingMember, pincode: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Specialization / Profession</label>
                      <select
                        className="form-control"
                        value={editingMember.organization || 'Furniture Making'}
                        onChange={(e) => setEditingMember({ ...editingMember, organization: e.target.value })}
                      >
                        <option value="Furniture Making">Furniture Making</option>
                        <option value="Cabinet Makers">Cabinet Makers & Modular</option>
                        <option value="Wood Carving">Wood Carving Artisan</option>
                        <option value="Temple Wood Works">Temple Wood Works & Chariots</option>
                        <option value="Toys Making">Artisanal Toys Making</option>
                        <option value="Boat Making">Boat Making & Marine Woodwork</option>
                        <option value="Vehicle Interior & Exterior">Vehicle Interior & Exterior</option>
                        <option value="General Carpentry Contractor">General Carpentry Contractor</option>
                      </select>
                    </div>
                  </div>

                  {/* Plan & Payment Fields */}
                  <div style={{ backgroundColor: 'var(--neutral-100)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', border: '1px solid var(--neutral-200)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '12px', fontSize: '0.9rem' }}>
                      Membership Plan & Payment Audit
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                      <div className="form-group">
                        <label className="form-label">Membership Plan</label>
                        <select
                          className="form-control"
                          value={editingMember.membership_plan || 'State Committee membership'}
                          onChange={(e) => {
                            const p = e.target.value;
                            let amt = 300;
                            if (p === 'General membership') amt = 0;
                            if (p === 'State Executive Membership') amt = 900;
                            setEditingMember({ ...editingMember, membership_plan: p, amount: amt });
                          }}
                        >
                          <option value="General membership">General membership (Free)</option>
                          <option value="State Committee membership">State Committee membership (₹300)</option>
                          <option value="State Executive Membership">State Executive Membership (₹900)</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Fee Amount (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={editingMember.amount !== undefined ? editingMember.amount : 0}
                          onChange={(e) => setEditingMember({ ...editingMember, amount: Number(e.target.value) })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Payment Status</label>
                        <select
                          className="form-control"
                          value={editingMember.payment_status || 'pending'}
                          onChange={(e) => setEditingMember({ ...editingMember, payment_status: e.target.value })}
                        >
                          <option value="paid">PAID (Verified)</option>
                          <option value="pending">PENDING (Awaiting Payment)</option>
                          <option value="free">FREE (General Member)</option>
                          <option value="pending_verification">PENDING VERIFICATION (UPI/UTR)</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Payment ID / Transaction Ref</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. TXN-12345 / UTR..."
                          value={editingMember.payment_id || ''}
                          onChange={(e) => setEditingMember({ ...editingMember, payment_id: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Nominee & Union */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                    <div className="form-group">
                      <label className="form-label">Nominee Name (for welfare & aid)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Family Nominee Name"
                        value={editingMember.nominee_name || ''}
                        onChange={(e) => setEditingMember({ ...editingMember, nominee_name: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Local Union Name / Address</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Local Union Name"
                        value={editingMember.local_union_address || ''}
                        onChange={(e) => setEditingMember({ ...editingMember, local_union_address: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setEditingMember(null)}
                      className="btn btn-outline-primary"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={editLoading}
                      className="btn btn-secondary"
                      style={{ fontWeight: 700, minWidth: '160px' }}
                    >
                      <Save size={16} />
                      <span>{editLoading ? 'Saving Changes...' : 'Save Member Details'}</span>
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

        </div>
      </section>
    </Layout>
  );
}
