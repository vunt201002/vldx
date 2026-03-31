import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye, TrendingUp, User, Zap, FileText, ShoppingBag, ClipboardList,
  ArrowUpRight, ArrowRight, Globe, Package, PenLine, LayoutGrid, Activity,
} from 'lucide-react'
import { get } from '@/lib/api'
import { Card, Table, Th, Td, Badge, ErrorAlert, EmptyState, Button } from '@/components/ui'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [topPages, setTopPages] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [auditLog, setAuditLog] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      get('/analytics/summary').then((r) => r.data || r).catch(() => null),
      get('/analytics/top-pages?days=7').then((r) => r.data || r).catch(() => []),
      get('/analytics/top-products?days=7').then((r) => r.data || r).catch(() => []),
      get('/audit-log?limit=5').then((r) => r.data?.data || r.data || []).catch(() => []),
    ])
      .then(([sum, pages, products, audit]) => {
        setSummary(sum)
        setTopPages(Array.isArray(pages) ? pages : [])
        setTopProducts(Array.isArray(products) ? products : [])
        setAuditLog(Array.isArray(audit) ? audit : [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-spinner" />
        <span>Loading dashboard...</span>
      </div>
    )
  }

  const statCards = [
    { label: 'Views Today', value: summary?.todayViews ?? 0, icon: Eye, color: 'blue', trend: '+12%' },
    { label: 'Views This Week', value: summary?.weekViews ?? 0, icon: TrendingUp, color: 'purple', trend: '+8%' },
    { label: 'Unique Visitors', value: summary?.todayUnique ?? 0, icon: User, color: 'green', trend: '+5%' },
    { label: 'Total Events', value: summary?.totalEvents ?? 0, icon: Zap, color: 'amber', trend: null },
  ]

  const formatDate = (d) => {
    if (!d) return '—'
    const date = new Date(d)
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  const actionVariant = (action) => {
    const map = { create: 'success', update: 'accent', delete: 'danger' }
    return map[action] || 'neutral'
  }

  const formatPath = (path) => {
    if (!path) return '/'
    if (path.length > 30) return path.substring(0, 30) + '...'
    return path
  }

  const quickLinks = [
    { label: 'Products', icon: Package, to: '/products', desc: 'Manage catalog' },
    { label: 'Blog', icon: PenLine, to: '/blogs', desc: 'Write articles' },
    { label: 'Blocks', icon: LayoutGrid, to: '/blocks', desc: 'Page sections' },
    { label: 'Audit Log', icon: Activity, to: '/audit-log', desc: 'View activity' },
  ]

  return (
    <div className="dashboard">
      {error && <ErrorAlert message={error} />}

      {/* Welcome banner */}
      <div className="dash-banner">
        <div className="dash-banner-content">
          <h1 className="dash-banner-title">Welcome back</h1>
          <p className="dash-banner-subtitle">Here is an overview of your store performance.</p>
        </div>
        <div className="dash-banner-decoration" />
      </div>

      {/* Stat cards */}
      <div className="dash-stats">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className={`dash-stat-card dash-stat-card--${card.color}`}>
              <div className="dash-stat-header">
                <div className={`dash-stat-icon dash-stat-icon--${card.color}`}>
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                {card.trend && (
                  <span className={`dash-stat-trend dash-stat-trend--up`}>
                    <ArrowUpRight size={12} /> {card.trend}
                  </span>
                )}
              </div>
              <div className="dash-stat-value">{card.value.toLocaleString?.() ?? card.value}</div>
              <div className="dash-stat-label">{card.label}</div>
            </div>
          )
        })}
      </div>

      {/* Main grid: 3 columns */}
      <div className="dash-grid">
        {/* Top Pages */}
        <Card className="dash-card">
          <div className="dash-card-header">
            <div className="dash-card-header-left">
              <Globe size={16} strokeWidth={1.75} className="dash-card-header-icon" />
              <h2 className="dash-card-title">Top Pages</h2>
            </div>
            <span className="dash-card-period">Last 7 days</span>
          </div>
          {topPages.length === 0 ? (
            <EmptyState icon={FileText} title="No page data yet" description="Tracking data will appear here." />
          ) : (
            <div className="dash-list">
              {topPages.slice(0, 8).map((p, i) => (
                <div key={i} className="dash-list-item">
                  <div className="dash-list-rank">{i + 1}</div>
                  <div className="dash-list-name" title={p.path}>{formatPath(p.path)}</div>
                  <div className="dash-list-bar-wrap">
                    <div
                      className="dash-list-bar"
                      style={{ width: `${Math.max(8, (p.views / topPages[0].views) * 100)}%` }}
                    />
                  </div>
                  <div className="dash-list-value">{p.views}</div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Top Products */}
        <Card className="dash-card">
          <div className="dash-card-header">
            <div className="dash-card-header-left">
              <ShoppingBag size={16} strokeWidth={1.75} className="dash-card-header-icon" />
              <h2 className="dash-card-title">Top Products</h2>
            </div>
            <span className="dash-card-period">Last 7 days</span>
          </div>
          {topProducts.length === 0 ? (
            <EmptyState icon={ShoppingBag} title="No product data" description="Product views will appear here." />
          ) : (
            <div className="dash-list">
              {topProducts.slice(0, 8).map((p, i) => (
                <div key={i} className="dash-list-item">
                  <div className="dash-list-rank">{i + 1}</div>
                  <div className="dash-list-name">{p.name}</div>
                  <div className="dash-list-bar-wrap">
                    <div
                      className="dash-list-bar dash-list-bar--purple"
                      style={{ width: `${Math.max(8, (p.views / topProducts[0].views) * 100)}%` }}
                    />
                  </div>
                  <div className="dash-list-value">{p.views}</div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Right column: Audit + Quick Links */}
        <div className="dash-right-col">
          {/* Recent Activity */}
          <Card className="dash-card">
            <div className="dash-card-header">
              <div className="dash-card-header-left">
                <Activity size={16} strokeWidth={1.75} className="dash-card-header-icon" />
                <h2 className="dash-card-title">Recent Activity</h2>
              </div>
              <Link to="/audit-log" className="dash-card-link">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            {auditLog.length === 0 ? (
              <EmptyState icon={ClipboardList} title="No activity yet" description="Actions will appear here." />
            ) : (
              <div className="dash-activity">
                {auditLog.map((entry, i) => (
                  <div key={i} className="dash-activity-item">
                    <div className={`dash-activity-dot dash-activity-dot--${actionVariant(entry.action)}`} />
                    <div className="dash-activity-content">
                      <div className="dash-activity-text">
                        <Badge variant={actionVariant(entry.action)}>{entry.action}</Badge>
                        <span className="dash-activity-entity">
                          {entry.entity}{entry.entityName ? `: ${entry.entityName}` : ''}
                        </span>
                      </div>
                      <div className="dash-activity-meta">
                        {entry.adminEmail} &middot; {formatDate(entry.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Links */}
          <Card className="dash-card">
            <div className="dash-card-header">
              <h2 className="dash-card-title">Quick Actions</h2>
            </div>
            <div className="dash-quick-links">
              {quickLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link key={link.to} to={link.to} className="dash-quick-link">
                    <div className="dash-quick-link-icon">
                      <Icon size={18} strokeWidth={1.75} />
                    </div>
                    <div>
                      <div className="dash-quick-link-label">{link.label}</div>
                      <div className="dash-quick-link-desc">{link.desc}</div>
                    </div>
                    <ArrowRight size={14} className="dash-quick-link-arrow" />
                  </Link>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
