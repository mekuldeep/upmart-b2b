import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  User, LogOut, Package, Settings, ChevronRight,
  Loader2, Eye, EyeOff, CheckCircle, Clock, Truck, XCircle, AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authApi, ordersApi, Order } from '@/lib/api';
import { toast } from 'sonner';

type Tab = 'profile' | 'orders' | 'security' | 'settings';

const ORDER_STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: 'Pending', icon: Clock, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  processing: { label: 'Processing', icon: AlertCircle, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  shipped: { label: 'Shipped', icon: Truck, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200' },
};

const AccountPage = () => {
  const { user, logout, updateProfile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>(
    location.pathname.endsWith('/orders') ? 'orders' : 'profile'
  );

  // Sync tab with URL if it changes (e.g. clicking My Orders in header while on Profile)
  useEffect(() => {
    if (location.pathname.endsWith('/orders')) {
      setActiveTab('orders');
    }
  }, [location.pathname]);

  // Profile state
  const [profileData, setProfileData] = useState({
    name: '', phone: '', company: '', address: '', city: '', state: '', zip: '', country: 'India'
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Security state
  const [pwData, setPwData] = useState({ current: '', new_pw: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Initialize profile form from user
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        company: user.company || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zip: user.zip || '',
        country: user.country || 'India',
      });
    }
  }, [user]);

  // Fetch orders when tab selected
  useEffect(() => {
    if (activeTab === 'orders' && user) {
      setOrdersLoading(true);
      ordersApi.list()
        .then(res => setOrders(res.orders))
        .catch(() => toast.error('Failed to load orders'))
        .finally(() => setOrdersLoading(false));
    }
  }, [activeTab, user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const handleProfileSave = async () => {
    setProfileLoading(true);
    try {
      await updateProfile(profileData);
      toast.success('Profile updated successfully!');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pwData.current || !pwData.new_pw || !pwData.confirm) {
      toast.error('All password fields are required');
      return;
    }
    if (pwData.new_pw !== pwData.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (pwData.new_pw.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setPwLoading(true);
    try {
      await authApi.changePassword(pwData.current, pwData.new_pw);
      setPwData({ current: '', new_pw: '', confirm: '' });
      toast.success('Password changed successfully!');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'profile', label: 'My Profile', icon: User },
    { key: 'orders', label: 'My Orders', icon: Package },
    { key: 'security', label: 'Security', icon: Settings },
  ];

  const inputCls = "w-full px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-primary transition-all";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold mb-8">My Account</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-card rounded-2xl p-5 shadow-soft sticky top-24">
            {/* Avatar */}
            <div className="text-center mb-6 pb-6 border-b border-border">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="font-display font-bold text-2xl text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="font-display font-semibold text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground font-body mt-0.5">{user.email}</p>
              {user.company && (
                <p className="text-xs text-muted-foreground font-body mt-0.5">{user.company}</p>
              )}
            </div>

            <nav className="space-y-1">
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-display font-semibold transition-all ${activeTab === t.key
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-foreground hover:bg-secondary'
                    }`}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                  {activeTab !== t.key && <ChevronRight className="w-3 h-3 ml-auto opacity-40" />}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-display font-semibold text-destructive hover:bg-destructive/10 transition-all mt-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-card rounded-2xl p-6 shadow-soft animate-fade-in">
              <h2 className="font-display text-lg font-bold mb-6">Edit Profile</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', field: 'name', placeholder: 'John Doe' },
                  { label: 'Company', field: 'company', placeholder: 'Your Business Name' },
                  { label: 'Phone', field: 'phone', placeholder: '+91 98765 43210' },
                  { label: 'City', field: 'city', placeholder: 'Mumbai' },
                  { label: 'State', field: 'state', placeholder: 'Maharashtra' },
                  { label: 'ZIP Code', field: 'zip', placeholder: '400001' },
                  { label: 'Country', field: 'country', placeholder: 'India' },
                ].map(({ label, field, placeholder }) => (
                  <div key={field}>
                    <label className="font-display text-sm font-semibold text-foreground block mb-1.5">{label}</label>
                    <input
                      type="text"
                      value={profileData[field as keyof typeof profileData]}
                      onChange={e => setProfileData(prev => ({ ...prev, [field]: e.target.value }))}
                      placeholder={placeholder}
                      className={inputCls}
                    />
                  </div>
                ))}

                {/* Full-width address */}
                <div className="sm:col-span-2">
                  <label className="font-display text-sm font-semibold text-foreground block mb-1.5">Address</label>
                  <textarea
                    value={profileData.address}
                    onChange={e => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Street address, locality..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-primary transition-all resize-none"
                  />
                </div>

                {/* Read-only email */}
                <div className="sm:col-span-2">
                  <label className="font-display text-sm font-semibold text-foreground block mb-1.5">Email</label>
                  <input type="email" value={user.email} disabled
                    className="w-full px-4 py-3 rounded-xl bg-muted text-muted-foreground font-body text-sm cursor-not-allowed border border-transparent" />
                  <p className="text-xs text-muted-foreground font-body mt-1">Email cannot be changed</p>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleProfileSave}
                  disabled={profileLoading}
                  id="save-profile-btn"
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-display font-semibold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {profileLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-card rounded-2xl p-6 shadow-soft animate-fade-in">
              <h2 className="font-display text-lg font-bold mb-6">My Orders</h2>

              {selectedOrder ? (
                <OrderDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />
              ) : ordersLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="font-display font-semibold text-foreground mb-2">No Orders Yet</p>
                  <p className="text-sm text-muted-foreground font-body mb-6">Start shopping to see your orders here.</p>
                  <Link to="/products" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-display font-semibold hover:opacity-90 transition-opacity">
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map(order => {
                    const status = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG['pending'];
                    const StatusIcon = status.icon;
                    return (
                      <button
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className="w-full text-left bg-secondary hover:bg-border rounded-xl p-4 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-display font-semibold ${status.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {status.label}
                            </div>
                            <div>
                              <p className="font-display font-semibold text-foreground text-sm">{order.order_number}</p>
                              <p className="text-xs text-muted-foreground font-body">
                                {order.item_count} item{order.item_count !== 1 ? 's' : ''} ·{' '}
                                {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-display font-bold text-primary">₹{order.total.toLocaleString('en-IN')}</p>
                            <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-card rounded-2xl p-6 shadow-soft animate-fade-in">
              <h2 className="font-display text-lg font-bold mb-6">Security Settings</h2>
              <div className="max-w-sm space-y-4">
                <div>
                  <label className="font-display text-sm font-semibold text-foreground block mb-1.5">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={pwData.current}
                      onChange={e => setPwData(p => ({ ...p, current: e.target.value }))}
                      placeholder="Enter current password"
                      className={inputCls + ' pr-12'}
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="font-display text-sm font-semibold text-foreground block mb-1.5">New Password</label>
                  <input type={showPw ? 'text' : 'password'} value={pwData.new_pw} onChange={e => setPwData(p => ({ ...p, new_pw: e.target.value }))} placeholder="Enter new password" className={inputCls} />
                </div>
                <div>
                  <label className="font-display text-sm font-semibold text-foreground block mb-1.5">Confirm New Password</label>
                  <input type={showPw ? 'text' : 'password'} value={pwData.confirm} onChange={e => setPwData(p => ({ ...p, confirm: e.target.value }))} placeholder="Repeat new password" className={inputCls} />
                </div>
                <button
                  onClick={handleChangePassword}
                  disabled={pwLoading}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-display font-semibold hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {pwLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : 'Update Password'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Order Detail Component
const OrderDetail = ({ order, onBack }: { order: Order; onBack: () => void }) => {
  const [details, setDetails] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.get(order.id)
      .then(res => setDetails(res.order))
      .catch(() => setDetails(order))
      .finally(() => setLoading(false));
  }, [order.id]);

  const o = details || order;
  const status = ORDER_STATUS_CONFIG[o.status] || ORDER_STATUS_CONFIG['pending'];
  const StatusIcon = status.icon;

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-6 transition-colors">
        ← Back to Orders
      </button>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display font-bold text-xl text-foreground">{o.order_number}</h3>
              <p className="text-sm text-muted-foreground font-body mt-0.5">
                Placed on {new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-display font-semibold ${status.color}`}>
              <StatusIcon className="w-4 h-4" />
              {status.label}
            </div>
          </div>

          {/* Items */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-3">Items Ordered</h4>
            <div className="bg-secondary rounded-xl divide-y divide-border">
              {o.items.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-display font-semibold text-foreground text-sm">{item.product_name}</p>
                    <p className="text-xs text-muted-foreground font-body">Qty: {item.quantity} × ₹{item.unit_price.toLocaleString('en-IN')}</p>
                  </div>
                  <p className="font-display font-bold text-foreground">₹{item.line_total.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-secondary rounded-xl p-4">
            <div className="flex justify-between font-display font-bold text-lg text-foreground">
              <span>Total</span>
              <span className="text-primary">₹{o.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Payments */}
          {o.payments && o.payments.length > 0 && (
            <div>
              <h4 className="font-display font-semibold text-foreground mb-3">Payment History</h4>
              <div className="bg-secondary rounded-xl divide-y divide-border">
                {o.payments.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-display font-semibold text-foreground text-sm capitalize">{p.payment_method.replace('_', ' ')}</p>
                        <p className="text-xs text-muted-foreground font-body">
                          {new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <p className="font-display font-bold text-foreground">₹{p.amount.toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order History */}
          {(o as any).history && (o as any).history.length > 0 && (
            <div>
              <h4 className="font-display font-semibold text-foreground mb-3">Order Timeline</h4>
              <div className="space-y-3">
                {(o as any).history.map((h: any) => (
                  <div key={h.id} className="flex gap-4">
                    <div className="flex-shrink-0 w-3 h-3 rounded-full bg-primary mt-1" />
                    <div>
                      <p className="font-display font-semibold text-foreground text-sm capitalize">{h.status}</p>
                      {h.notes && <p className="text-xs text-muted-foreground font-body">{h.notes}</p>}
                      <p className="text-xs text-muted-foreground font-body mt-0.5">
                        {new Date(h.created_at).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountPage;
