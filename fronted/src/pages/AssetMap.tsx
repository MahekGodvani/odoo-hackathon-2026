// src/pages/AssetMap.tsx
import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Icons } from '../icons';
import { theme } from '../styles/theme';
import { api } from '../utils/api';

interface Zone {
  id: string;
  name: string;
  departmentCode: string;
  coordinates: { x: number; y: number; w: number; h: number };
  color: string;
  description: string;
}

const ZONES: Zone[] = [
  { id: 'server_room', name: 'Server & IT Center', departmentCode: 'IT', coordinates: { x: 5, y: 5, w: 28, h: 42 }, color: '#4F46E5', description: 'Central servers, switches, and network hardware' },
  { id: 'eng_lab', name: 'Engineering Lab 1', departmentCode: 'LAP', coordinates: { x: 38, y: 5, w: 57, h: 25 }, color: '#06B6D4', description: 'Development rigs, engineering laptops, and test items' },
  { id: 'finance_office', name: 'Finance & Accounts', departmentCode: 'ACC', coordinates: { x: 5, y: 53, w: 28, h: 42 }, color: '#10B981', description: 'Accounting terminals, office desks, and secure assets' },
  { id: 'civil_wing', name: 'Civil Engineering Wing', departmentCode: 'CIVIL', coordinates: { x: 38, y: 35, w: 25, h: 60 }, color: '#F59E0B', description: 'Workstations, drafting equipment, and tools' },
  { id: 'admin_boardroom', name: 'Boardroom & Admin', departmentCode: 'ADM', coordinates: { x: 68, y: 35, w: 27, h: 60 }, color: '#EC4899', description: 'Conference kit, smart TVs, and administrative systems' }
];

export default function AssetMap() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState<Zone>(ZONES[0]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await api.get<any>('/assets?limit=100');
        setAssets(res.assets || []);
      } catch (error) {
        console.error('Failed to load map assets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  // Helper to count assets in a department zone
  const getAssetsForZone = (deptCode: string) => {
    return assets.filter(asset => {
      // Check if Category code or Department code matches
      const assetDeptCode = asset.Department?.code?.toUpperCase();
      const assetCatCode = asset.Category?.code?.toUpperCase();
      return assetDeptCode === deptCode.toUpperCase() || assetCatCode === deptCode.toUpperCase();
    });
  };

  // Find where searched asset is located
  const searchMatchZone = ZONES.find(zone => {
    if (!searchQuery) return false;
    const zoneAssets = getAssetsForZone(zone.departmentCode);
    return zoneAssets.some(a => 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const activeZone = searchMatchZone || selectedZone;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.02em' }}>
            Asset Location Map
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: theme.colors.text.muted }}>
            Visual floor plan tracking and spatial mapping of organizational assets.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" icon={<Icons.Download />}>Export Layout</Button>
          <Button variant="primary" icon={<Icons.Plus />}>Add Location Node</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24, alignItems: 'start' }}>
        
        {/* Floor Plan Card */}
        <Card padding="24px" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: theme.colors.text.primary }}>HQ Office - 1st Floor Plan</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: theme.colors.background, padding: '6px 12px', borderRadius: 8, border: `1px solid ${theme.colors.border}` }}>
              <Icons.Search />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Find asset on map..."
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: theme.colors.text.primary, width: 160 }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: theme.colors.text.muted }}>
                  <Icons.X />
                </button>
              )}
            </div>
          </div>

          {/* Styled Interactive SVG Map Layout */}
          <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#F8FAFC', borderRadius: 12, border: `1px solid ${theme.colors.border}` }}>
            <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', userSelect: 'none' }}>
              {/* Outer walls / floor boundaries */}
              <rect x="1" y="1" width="98" height="98" fill="none" stroke="#CBD5E1" strokeWidth="2" rx="3" strokeDasharray="3 3" />
              
              {/* Internal walkways grid */}
              <line x1="33" y1="5" x2="33" y2="95" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="5" y1="48" x2="95" y2="48" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="2 2" />

              {/* Dynamic rendering of zones */}
              {ZONES.map((zone) => {
                const zoneAssets = getAssetsForZone(zone.departmentCode);
                const count = zoneAssets.length;
                const isSelected = activeZone?.id === zone.id;
                const isHighlighted = searchMatchZone?.id === zone.id;

                return (
                  <g key={zone.id} onClick={() => setSelectedZone(zone)} style={{ cursor: 'pointer' }}>
                    {/* Room Block */}
                    <rect
                      x={zone.coordinates.x}
                      y={zone.coordinates.y}
                      width={zone.coordinates.w}
                      height={zone.coordinates.h}
                      fill={isSelected ? `${zone.color}15` : '#FFFFFF'}
                      stroke={isSelected ? zone.color : '#94A3B8'}
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                      rx="6"
                      style={{ transition: 'all 0.2s ease-in-out' }}
                    />
                    
                    {/* Pulse overlay if search matches */}
                    {isHighlighted && (
                      <rect
                        x={zone.coordinates.x - 0.5}
                        y={zone.coordinates.y - 0.5}
                        width={zone.coordinates.w + 1}
                        height={zone.coordinates.h + 1}
                        fill="none"
                        stroke={zone.color}
                        strokeWidth="3"
                        rx="6"
                        style={{
                          animation: 'pulse 1.5s infinite alternate'
                        }}
                      />
                    )}

                    {/* Room Name Label */}
                    <text
                      x={zone.coordinates.x + zone.coordinates.w / 2}
                      y={zone.coordinates.y + zone.coordinates.h / 2 - 2}
                      textAnchor="middle"
                      fontSize="3.5"
                      fontWeight={isSelected ? '800' : '600'}
                      fill={isSelected ? zone.color : '#334155'}
                      style={{ transition: 'fill 0.2s' }}
                    >
                      {zone.name}
                    </text>

                    {/* Asset Count Badge overlay */}
                    <rect
                      x={zone.coordinates.x + zone.coordinates.w / 2 - 5}
                      y={zone.coordinates.y + zone.coordinates.h / 2 + 3}
                      width="10"
                      height="5.5"
                      rx="3"
                      fill={isSelected ? zone.color : '#E2E8F0'}
                      style={{ transition: 'all 0.2s' }}
                    />
                    <text
                      x={zone.coordinates.x + zone.coordinates.w / 2}
                      y={zone.coordinates.y + zone.coordinates.h / 2 + 7}
                      textAnchor="middle"
                      fontSize="3"
                      fontWeight="800"
                      fill={isSelected ? '#FFFFFF' : '#475569'}
                    >
                      {count} items
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div style={{ marginTop: 14, display: 'flex', gap: 16, fontSize: 12, color: theme.colors.text.muted }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, border: '2px solid #4F46E5', background: '#4F46E515', borderRadius: 3 }} /> Selected
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, border: '1.5px solid #94A3B8', background: '#FFFFFF', borderRadius: 3 }} /> Inactive Room
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 99, background: '#10B981' }} /> Active items in database
            </div>
          </div>
        </Card>

        {/* Side Inspector Details Card */}
        <Card padding="20px">
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: theme.colors.text.muted }}>
              Loading map data...
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${activeZone.color}15`, color: activeZone.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.MapPin />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: theme.colors.text.primary }}>
                    {activeZone.name}
                  </h3>
                  <div style={{ fontSize: 12, color: theme.colors.text.muted }}>
                    Dept/Code: <strong style={{ color: activeZone.color }}>{activeZone.departmentCode}</strong>
                  </div>
                </div>
              </div>
              <p style={{ margin: '0 0 20px', fontSize: 13, color: theme.colors.text.muted, lineHeight: 1.4 }}>
                {activeZone.description}
              </p>

              <div style={{ borderBottom: `1px solid ${theme.colors.borderLight}`, paddingBottom: 8, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: theme.colors.text.primary }}>Mapped Assets</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: theme.colors.text.muted }}>
                  {getAssetsForZone(activeZone.departmentCode).length} active items
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 360, overflowY: 'auto', paddingRight: 4 }}>
                {getAssetsForZone(activeZone.departmentCode).length === 0 ? (
                  <div style={{ padding: 30, textAlign: 'center', fontSize: 13, color: theme.colors.text.muted }}>
                    No assets mapped in this zone yet.
                  </div>
                ) : (
                  getAssetsForZone(activeZone.departmentCode).map((asset) => (
                    <div
                      key={asset.id}
                      style={{
                        padding: 12, borderRadius: 8, background: '#FAFBFC', border: `1px solid ${theme.colors.borderLight}`,
                        display: 'flex', flexDirection: 'column', gap: 4
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: theme.colors.text.primary }}>
                          {asset.name}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: theme.colors.primary, background: '#EEF2FF', padding: '1px 6px', borderRadius: 4 }}>
                          {asset.serialNumber || `AST-${asset.id}`}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: theme.colors.text.muted }}>
                        Model: {asset.model || 'N/A'}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: theme.colors.text.secondary }}>
                          ${asset.purchaseCost}
                        </span>
                        <Badge variant={asset.status === 'Available' ? 'success' : 'info'}>
                          {asset.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </Card>

      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.3; stroke-width: 2.5px; }
          100% { opacity: 1; stroke-width: 4.5px; }
        }
      `}</style>
    </div>
  );
}
