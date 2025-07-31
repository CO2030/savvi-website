import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";

interface UnsubscribeAnalytics {
  totalUnsubscribed: number;
  totalActive: number;
  monthlyData: Array<{
    month: string;
    unsubscribed: number;
    active: number;
    signups: number;
    unsubscribeRate: string;
  }>;
}

export function UnsubscribeAnalytics() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/admin/unsubscribe-analytics'],
    queryFn: () => apiRequest('/api/admin/unsubscribe-analytics') as Promise<UnsubscribeAnalytics>,
    refetchInterval: 30000, // Update every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return <div className="p-6 text-gray-500">No unsubscribe data available</div>;
  }

  const totalUsers = analytics.totalActive + analytics.totalUnsubscribed;
  const overallUnsubscribeRate = totalUsers > 0 ? ((analytics.totalUnsubscribed / totalUsers) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          📊 Unsubscribe Analytics
        </h2>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{analytics.totalActive}</div>
              <p className="text-xs text-muted-foreground">Currently subscribed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Unsubscribed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{analytics.totalUnsubscribed}</div>
              <p className="text-xs text-muted-foreground">No longer receiving emails</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">All time signups</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overall Unsubscribe Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${parseFloat(overallUnsubscribeRate) < 5 ? 'text-green-600' : parseFloat(overallUnsubscribeRate) < 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                {overallUnsubscribeRate}%
              </div>
              <p className="text-xs text-muted-foreground">
                {parseFloat(overallUnsubscribeRate) < 5 ? 'Excellent' : parseFloat(overallUnsubscribeRate) < 10 ? 'Good' : 'Needs attention'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Monthly Breakdown */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-4">Monthly Breakdown (Last 12 Months)</h3>
          <div className="space-y-3">
            {analytics.monthlyData.map((month, index) => (
              <div key={index} className="grid grid-cols-2 md:grid-cols-5 gap-4 py-2 border-b border-gray-200 last:border-b-0">
                <div>
                  <div className="font-medium text-sm">{month.month}</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{month.signups}</div>
                  <div className="text-xs text-gray-500">New Signups</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{month.active}</div>
                  <div className="text-xs text-gray-500">Still Active</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">{month.unsubscribed}</div>
                  <div className="text-xs text-gray-500">Unsubscribed</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${parseFloat(month.unsubscribeRate) < 5 ? 'text-green-600' : parseFloat(month.unsubscribeRate) < 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {month.unsubscribeRate}
                  </div>
                  <div className="text-xs text-gray-500">Unsubscribe Rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Insights */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-800">📈 Analytics Insights</h4>
          <div className="space-y-2 text-sm text-blue-700">
            <div>
              <strong>Retention Rate:</strong> {totalUsers > 0 ? ((analytics.totalActive / totalUsers) * 100).toFixed(1) : 0}% of users remain subscribed
            </div>
            <div>
              <strong>Email Health:</strong> {parseFloat(overallUnsubscribeRate) < 5 ? 'Excellent email engagement' : parseFloat(overallUnsubscribeRate) < 10 ? 'Good email performance' : 'Consider reviewing email content and frequency'}
            </div>
            <div>
              <strong>Growth Status:</strong> {analytics.totalActive > analytics.totalUnsubscribed ? 'Positive growth - more active than unsubscribed users' : 'Review needed - high unsubscribe rate detected'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}