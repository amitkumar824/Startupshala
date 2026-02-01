'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  User,
  Mail,
  Building,
  Briefcase,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { mockDeals } from '@/lib/mock-data';

export default function DashboardPage() {
  const { user, claims, isLoading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const claimedDeals = (claims || []).map((claim) => ({
    claim,
    deal: mockDeals.find((d) => d.id === claim.dealId),
  }));

  const totalSavings = claimedDeals.reduce((total, { deal }) => {
    if (deal) {
      return total + (deal.originalPrice - deal.discountedPrice);
    }
    return total;
  }, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return CheckCircle2;
      case 'pending':
        return Clock;
      case 'rejected':
        return XCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="relative py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.3), transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.3), transparent 50%)`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-white/20">
              <AvatarFallback className="bg-white/20 text-white text-3xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}!</h1>
              <p className="text-white/90 text-lg">Manage your claimed deals and track your savings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 pb-20">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-xl border-2 hover:shadow-2xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Total Savings</span>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600">
                ${totalSavings.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-2 hover:shadow-2xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Claimed Deals</span>
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600">
                {claims?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-2 hover:shadow-2xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Account Status</span>
                {user.isVerified ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Clock className="w-5 h-5 text-yellow-600" />
                )}
              </div>
              <div className={`text-2xl font-bold ${user.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                {user.isVerified ? 'Verified' : 'Pending'}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 shadow-xl border-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div className="font-medium">{user.name}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{user.email}</div>
                </div>
              </div>

              {user.company && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Building className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Company</div>
                    <div className="font-medium">{user.company}</div>
                  </div>
                </div>
              )}

              {user.role && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Briefcase className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Role</div>
                    <div className="font-medium">{user.role}</div>
                  </div>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Verification Status</span>
                  {user.isVerified ? (
                    <Badge className="bg-green-600">Verified</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-yellow-500 text-white">Pending</Badge>
                  )}
                </div>
                {!user.isVerified && (
                  <p className="text-xs text-muted-foreground">
                    Verify your account to unlock premium deals
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 shadow-xl border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Claimed Deals</CardTitle>
                <Link href="/deals">
                  <Button variant="outline" size="sm">
                    Browse More Deals
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {claimedDeals.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No deals claimed yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start exploring exclusive offers for your startup
                  </p>
                  <Link href="/deals">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                      Explore Deals
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {claimedDeals.map(({ claim, deal }) => {
                    if (!deal) return null;

                    const StatusIcon = getStatusIcon(claim.status);

                    return (
                      <Card key={claim.id} className="group hover:shadow-lg transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex-shrink-0">
                              <img
                                src={deal.logoUrl}
                                alt={deal.partner}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-bold text-lg mb-1 group-hover:text-purple-600 transition-colors">
                                    {deal.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">{deal.partner}</p>
                                </div>
                                <Badge className="capitalize">{deal.category}</Badge>
                              </div>

                              <div className="flex items-center gap-4 mb-3">
                                <div className="flex items-center gap-2">
                                  <StatusIcon className={`w-4 h-4 ${getStatusColor(claim.status)}`} />
                                  <span className={`text-sm font-medium capitalize ${getStatusColor(claim.status)}`}>
                                    {claim.status}
                                  </span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  Claimed {new Date(claim.claimedAt).toLocaleDateString()}
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Savings: </span>
                                  <span className="font-bold text-green-600">
                                    ${(deal.originalPrice - deal.discountedPrice).toLocaleString()}
                                  </span>
                                </div>
                                <Link href={`/deals/${deal.id}`}>
                                  <Button variant="ghost" size="sm" className="group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    View Details
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
