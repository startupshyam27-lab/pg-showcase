import { Building2, Bed, Home, Users, Database, TrendingUp, Calendar, Eye } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { initialLocations } from '@/data/initialData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function AdminDashboardPage() {
  const { locations, getTotalRooms, getTotalBeds, refreshData } = useData();
  const [isSeeding, setIsSeeding] = useState(false);

  // Analytics State
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [todayViews, setTodayViews] = useState(0);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('event_type', 'page_view')
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        setTotalViews(data.length);

        const today = new Date().toDateString();
        const todayCount = data.filter(item => new Date(item.created_at).toDateString() === today).length;
        setTodayViews(todayCount);

        // Process data for chart (last 7 days)
        const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }).reverse();

        const chartData = last7Days.map(dateStr => {
          const count = data.filter(item =>
            new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === dateStr
          ).length;
          return { name: dateStr, views: count };
        });

        setAnalyticsData(chartData);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      toast.loading("Seeding database with initial data...");

      for (const loc of initialLocations) {
        // 1. Insert Location
        const { data: locData, error: locError } = await supabase
          .from('locations')
          .insert({
            name: loc.name,
            slug: loc.slug,
            property_type: loc.propertyType,
            description: loc.description,
            address: loc.address,
            map_url: loc.mapUrl,
            phone: loc.phone,
            whatsapp: loc.whatsapp,
            image: loc.image,
          })
          .select()
          .single();

        if (locError) throw locError;

        for (const floor of loc.floors) {
          // 2. Insert Floor
          const { data: floorData, error: floorError } = await supabase
            .from('floors')
            .insert({
              location_id: locData.id,
              name: floor.name
            })
            .select()
            .single();

          if (floorError) throw floorError;

          for (const room of floor.rooms) {
            // 3. Insert Room
            const { data: roomData, error: roomError } = await supabase
              .from('rooms')
              .insert({
                floor_id: floorData.id,
                code: room.code,
                gender: room.gender,
                is_visible: room.isVisible
              })
              .select()
              .single();

            if (roomError) throw roomError;

            for (const bed of room.beds) {
              // 4. Insert Bed
              const { error: bedError } = await supabase
                .from('beds')
                .insert({
                  room_id: roomData.id,
                  label: bed.label,
                  price: bed.price
                });

              if (bedError) throw bedError;
            }
          }
        }
      }

      toast.dismiss();
      toast.success("Database seeded successfully!");
      if (refreshData) await refreshData();

    } catch (error: any) {
      console.error('Seeding error:', error);
      toast.dismiss();
      toast.error(`Failed to seed data: ${error.message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  const stats = [
    {
      icon: Eye,
      label: 'Total Page Views',
      value: totalViews,
      color: 'bg-blue-500',
    },
    {
      icon: TrendingUp,
      label: 'Views Today',
      value: todayViews,
      color: 'bg-green-500',
    },
    {
      icon: Building2,
      label: 'Total Locations',
      value: locations.length,
      color: 'bg-primary',
    },
    {
      icon: Bed,
      label: 'Total Beds',
      value: getTotalBeds(),
      color: 'bg-orange-500',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Overview of your PG properties and Traffic</p>
          </div>
          {locations.length === 0 && (
            <Button onClick={handleSeedData} disabled={isSeeding}>
              <Database className="mr-2 h-4 w-4" />
              {isSeeding ? "Seeding..." : "Initialize Database"}
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 shadow-card"
            >
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white shadow-sm" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Traffic Chart */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Visitor Traffic (Last 7 Days)
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
                <XAxis
                  dataKey="name"
                  className="text-xs text-muted-foreground"
                  tick={{ fill: 'currentColor' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  className="text-xs text-muted-foreground"
                  tick={{ fill: 'currentColor' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="views" stroke="#8884d8" fillOpacity={1} fill="url(#colorViews)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Locations Overview */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <h2 className="font-display text-xl font-semibold text-foreground mb-6">
            Locations Overview
          </h2>
          <div className="space-y-4">
            {locations.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No locations found. Click "Initialize Database" to start.</p>
            ) : (
              locations.map(location => {
                const totalRooms = location.floors.reduce((acc, f) => acc + f.rooms.length, 0);
                const totalBeds = location.floors.reduce(
                  (acc, f) => acc + f.rooms.reduce((rAcc, r) => rAcc + r.beds.length, 0),
                  0
                );

                return (
                  <div
                    key={location.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                        {location.propertyType === 'bungalow' ? (
                          <Home className="h-5 w-5 text-primary-foreground" />
                        ) : (
                          <Building2 className="h-5 w-5 text-primary-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{location.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{location.propertyType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span>{location.floors.length} Floors</span>
                      <span>{totalRooms} Rooms</span>
                      <span>{totalBeds} Beds</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
