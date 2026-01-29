
import React, { useEffect, useState } from 'react';
import { getStats, AppStats } from '../services/statsService';
import { Lock, Users, Camera, RefreshCw } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AppStats | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple PIN protection (Not secure for high-value data, but fine for analytics viewing)
    if (pin === '8888') {
      setIsAuthenticated(true);
      fetchStats();
    } else {
      alert('パスワードが違います');
      setPin('');
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    const data = await getStats();
    setStats(data);
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-[Fredoka]">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gray-100 rounded-full">
              <Lock className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-center mb-6 text-gray-700">Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              pattern="[0-9]*"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN Code"
              className="w-full p-4 text-center text-xl tracking-widest border-2 border-gray-200 rounded-xl mb-4 focus:border-indigo-500 outline-none transition-colors"
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-[Fredoka] p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-bold text-gray-800">Popsnap Dashboard</h1>
          <button 
            onClick={fetchStats}
            className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Count Card */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Users size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-500">Total Users</h3>
            </div>
            <div className="text-5xl font-bold text-gray-800">
              {stats ? stats.total_visitors.toLocaleString() : '-'}
            </div>
            <p className="text-sm text-gray-400 mt-2">Unique visitors (Browser based)</p>
          </div>

          {/* Snap Count Card */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-pink-100 text-pink-600 rounded-xl">
                <Camera size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-500">Total Snaps</h3>
            </div>
            <div className="text-5xl font-bold text-gray-800">
              {stats ? stats.total_snaps.toLocaleString() : '-'}
            </div>
            <p className="text-sm text-gray-400 mt-2">Images generated successfully</p>
          </div>
        </div>
        
        {!stats && !loading && (
          <div className="mt-8 p-4 bg-yellow-50 text-yellow-700 rounded-xl text-center">
            Stats not found. Make sure Supabase is connected and the 'app_stats' table exists.
          </div>
        )}
      </div>
    </div>
  );
};
