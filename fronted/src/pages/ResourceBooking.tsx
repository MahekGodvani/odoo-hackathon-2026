// src/pages/ResourceBooking.tsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card } from '../components/ui/Card';
import { Badge, getStatusVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Icons } from '../icons';
import { theme } from '../styles/theme';
import { api } from '../utils/api';
import type { RootState } from '../store';

const ResourceBooking: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal form states
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [resource, setResource] = useState('');
  const [type, setType] = useState('Room');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get<any[]>('/bookings');
      setBookings(res || []);
    } catch (e) {
      console.error('Failed to load bookings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStartEdit = (booking: any) => {
    setEditingItem(booking);
    setResource(booking.resourceId || booking.resource || '');
    setType(booking.type || 'Room');
    setDate(booking.startDate || booking.date || '');
    setTime(booking.time || '');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setResource('');
    setType('Room');
    setDate('');
    setTime('');
    setErrorMsg('');
  };

  const handleDeleteBooking = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel and delete this resource booking?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      fetchBookings();
    } catch (e: any) {
      alert(e.message || 'Failed to cancel booking.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resource.trim() || !time.trim() || !date) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const body = {
        resourceId: resource,
        type,
        bookedBy: user?.name || 'System User',
        startDate: date,
        endDate: date,
        time,
        notes: `Time slots: ${time}`,
      };

      if (editingItem) {
        await api.put(`/bookings/${editingItem.id}`, body);
      } else {
        await api.post('/bookings', body);
      }
      handleCloseModal();
      fetchBookings();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process booking.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.02em' }}>Resource Booking</h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: theme.colors.text.muted }}>Book and manage shared organizational resources</p>
        </div>
        <Button variant="primary" icon={<Icons.Plus />} onClick={() => setShowModal(true)}>New Booking</Button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: "Today's Bookings", value: bookings.length, color: '#06B6D4', bg: '#ECFEFF', icon: Icons.Booking },
          { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed' || b.status === 'Approved').length, color: '#10B981', bg: '#ECFDF5', icon: Icons.CheckCircle },
          { label: 'Pending Approval', value: bookings.filter(b => b.status === 'pending' || b.status === 'Pending').length, color: '#F59E0B', bg: '#FFFBEB', icon: Icons.Clock },
          { label: 'Available Resources', value: '24', color: '#8B5CF6', bg: '#F5F3FF', icon: Icons.Package },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: theme.radius.lg, padding: '16px 20px', boxShadow: theme.shadow.sm, border: `1px solid ${theme.colors.borderLight}`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
              <s.icon />
            </div>
            <div>
              <div style={{ fontSize: 12, color: theme.colors.text.muted }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: theme.colors.text.primary }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bookings List */}
      <Card padding="0">
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${theme.colors.borderLight}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: theme.colors.text.primary }}>
            {loading ? 'Searching bookings...' : `All Bookings (${bookings.length})`}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" icon={<Icons.Filter />} size="sm">Filter</Button>
          </div>
        </div>
        <div>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: theme.colors.text.muted }}>
              Loading bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: theme.colors.text.muted }}>
              No bookings active in catalog.
            </div>
          ) : (
            bookings.map((booking, i) => (
              <div key={booking.id} style={{
                display: 'flex', alignItems: 'center', padding: '16px 20px',
                borderBottom: i < bookings.length - 1 ? `1px solid ${theme.colors.borderLight}` : 'none',
                transition: 'background 0.1s', cursor: 'pointer',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#FAFBFC'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ECFEFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0891B2', marginRight: 16, flexShrink: 0 }}>
                  {booking.type === 'Vehicle' ? <Icons.Truck /> : booking.type === 'Equipment' ? <Icons.Package /> : <Icons.Organization />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: theme.colors.text.primary }}>{booking.resourceId || booking.resource}</span>
                    <Badge variant="default">{booking.type || 'Room'}</Badge>
                  </div>
                  <div style={{ fontSize: 12, color: theme.colors.text.muted, marginTop: 2, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icons.User /> {booking.bookedBy}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icons.Clock /> {booking.time || 'All Day'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icons.Calendar /> {booking.startDate || booking.date}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#4F46E5', background: '#EEF2FF', padding: '2px 8px', borderRadius: 6 }}>BKG-{booking.id}</span>
                  <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => handleStartEdit(booking)} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${theme.colors.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.colors.text.muted }}>
                      <Icons.Edit />
                    </button>
                    <button onClick={() => handleDeleteBooking(booking.id)} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid #FCA5A5`, background: '#FEF2F2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                      <Icons.Trash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* New/Edit Booking Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: theme.font
        }}>
          <form onSubmit={handleSubmit} style={{
            background: '#fff', borderRadius: 16, width: '100%', maxWidth: 460,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            padding: '24px 28px', border: `1px solid ${theme.colors.borderLight}`,
            display: 'flex', flexDirection: 'column', gap: 18
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: theme.colors.text.primary }}>
                {editingItem ? 'Edit Resource Booking' : 'New Resource Booking'}
              </h3>
              <button type="button" onClick={handleCloseModal} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: theme.colors.text.muted, display: 'flex', alignItems: 'center', padding: 4 }}>
                <Icons.X />
              </button>
            </div>

            {errorMsg && (
              <div style={{ fontSize: 13, color: '#EF4444', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: 8, padding: '10px 14px', fontWeight: 500 }}>
                {errorMsg}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Resource Name *</label>
              <input type="text" value={resource} onChange={e => setResource(e.target.value)} placeholder="e.g. Conference Room A, Team Van" style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Resource Type *</label>
              <select value={type} onChange={e => setType(e.target.value)} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', background: '#fff' }}>
                <option value="Room">Conference Room / Hall</option>
                <option value="Vehicle">Fleet Vehicle</option>
                <option value="Equipment">Hardware Equipment</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Date *</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Time Slot / Hours *</label>
              <input type="text" value={time} onChange={e => setTime(e.target.value)} placeholder="e.g. 10:00 AM - 12:00 PM" style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 10, justifyContent: 'flex-end' }}>
              <Button variant="secondary" type="button" onClick={handleCloseModal}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? 'Booking...' : editingItem ? 'Update Booking' : 'Book Resource'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ResourceBooking;
