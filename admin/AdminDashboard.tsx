import {
  Calendar,
  CalendarDays,
  Users,
  TrendingUp,
  Award,
  Target,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  UserCheck,
  ShoppingCart
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: 'daily' | 'weekly' | 'community' | 'plumbers' | 'market') => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const stats = [
    {
      label: 'Active Daily Challenges',
      value: '3',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      change: '+2 from yesterday',
      changeType: 'positive' as const
    },
    {
      label: 'Active Weekly Challenges',
      value: '2',
      icon: CalendarDays,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      change: 'Same as last week',
      changeType: 'neutral' as const
    },
    {
      label: 'Community Challenges',
      value: '1',
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      change: 'Active worldwide',
      changeType: 'positive' as const
    },
    {
      label: 'Pending Plumber Reviews',
      value: '3',
      icon: UserCheck,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      change: 'Requires attention',
      changeType: 'neutral' as const
    }
  ];

  const quickActions = [
    {
      title: 'Manage Daily Challenges',
      description: 'Create, edit, or deactivate daily challenges',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      action: () => onNavigate('daily')
    },
    {
      title: 'Manage Weekly Challenges',
      description: 'Control weekly challenge campaigns',
      icon: CalendarDays,
      color: 'from-purple-500 to-purple-600',
      action: () => onNavigate('weekly')
    },
    {
      title: 'Manage Community Challenges',
      description: 'Set up global community events',
      icon: Users,
      color: 'from-green-500 to-green-600',
      action: () => onNavigate('community')
    },
    {
      title: 'Verify Plumbers',
      description: 'Review and approve plumber applications',
      icon: UserCheck,
      color: 'from-orange-500 to-orange-600',
      action: () => onNavigate('plumbers')
    },
    {
      title: 'Manage Market',
      description: 'Control products, orders, and inventory',
      icon: ShoppingCart,
      color: 'from-cyan-500 to-cyan-600',
      action: () => onNavigate('market')
    }
  ];

  const recentActivity = [
    {
      type: 'created',
      challenge: 'Daily: Save 10L Challenge',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      type: 'updated',
      challenge: 'Weekly: Eco Warrior Week',
      time: '5 hours ago',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      type: 'activated',
      challenge: 'Community: Global Water Day',
      time: '1 day ago',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      type: 'expired',
      challenge: 'Daily: Leak Detection Mission',
      time: '2 days ago',
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon size={24} className={stat.iconColor} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-slate-600 mb-2">{stat.label}</p>
              <p className={`text-xs font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-slate-500'
              }`}>
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="bg-white rounded-xl border border-slate-200 p-6 text-left hover:shadow-lg hover:border-slate-300 transition-all group"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${action.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h4 className="text-base font-semibold text-slate-900 mb-2">{action.title}</h4>
                <p className="text-sm text-slate-600">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                    <Icon size={16} className={activity.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {activity.challenge}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                  </div>
                  <span className="text-xs font-medium text-slate-600 capitalize bg-slate-100 px-2 py-1 rounded">
                    {activity.type}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Challenge Performance */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Challenge Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Daily Completion Rate</span>
                <span className="text-sm font-bold text-blue-600">78%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Weekly Completion Rate</span>
                <span className="text-sm font-bold text-purple-600">65%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Community Participation</span>
                <span className="text-sm font-bold text-green-600">92%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600">Average Points Awarded</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">450<span className="text-sm text-slate-500">/day</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-600">Active Users</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">1.2K</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
