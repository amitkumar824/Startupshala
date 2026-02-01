'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Lock,
  Check,
  Clock,
  Users,
  AlertCircle,
  Sparkles,
  Shield,
} from 'lucide-react';
import { mockDeals } from '@/lib/mock-data';
import { useApp } from '@/lib/context/AppContext';
import { useToast } from '@/hooks/use-toast';

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, claims, claimDeal, isLoading } = useApp();
  const { toast } = useToast();
  const [claiming, setClaiming] = useState(false);

  const deal = mockDeals.find((d) => d.id === params.id);

  if (!deal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Deal Not Found</h1>
          <Link href="/deals">
            <Button>
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Deals
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const hasAlreadyClaimed = claims.some((claim) => claim.dealId === deal.id);
  const canClaim = user && (!deal.isLocked || user.isVerified);

  const handleClaim = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (deal.isLocked && !user.isVerified) {
      toast({
        title: 'Verification Required',
        description: 'This deal requires account verification. Please verify your account first.',
        variant: 'destructive',
      });
      return;
    }

    if (hasAlreadyClaimed) {
      toast({
        title: 'Already Claimed',
        description: 'You have already claimed this deal.',
      });
      return;
    }

    setClaiming(true);
    try {
      await claimDeal(deal.id);
      toast({
        title: 'Deal Claimed Successfully!',
        description: 'Check your dashboard to view your claimed deals.',
      });
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to claim deal. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/deals">
          <Button variant="ghost" className="mb-6 hover:scale-105 transition-all">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Deals
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 shadow-xl overflow-hidden">
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                  <img
                    src={deal.logoUrl}
                    alt={deal.partner}
                    className="w-full h-full object-cover"
                  />
                </div>
                {deal.isLocked && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-yellow-500 text-white text-base py-2 px-4">
                      <Lock className="w-4 h-4 mr-2" />
                      Verification Required
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge className="mb-3 capitalize">{deal.category}</Badge>
                    <h1 className="text-4xl font-bold mb-2">{deal.title}</h1>
                    <p className="text-xl text-muted-foreground">by {deal.partner}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-green-600 mb-1">
                      {deal.discountPercentage}%
                    </div>
                    <div className="text-sm text-muted-foreground">OFF</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center text-muted-foreground">
                    <Users className="w-5 h-5 mr-2" />
                    <span>{deal.claimCount} claimed</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>Valid until {new Date(deal.validUntil).toLocaleDateString()}</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-3">About This Deal</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {deal.fullDescription}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-3 flex items-center">
                      <Sparkles className="w-6 h-6 mr-2 text-yellow-500" />
                      What's Included
                    </h2>
                    <ul className="space-y-2">
                      {deal.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-5 h-5 mr-3 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {deal.isLocked && (
                    <div>
                      <h2 className="text-2xl font-bold mb-3 flex items-center">
                        <Shield className="w-6 h-6 mr-2 text-blue-600" />
                        Eligibility Requirements
                      </h2>
                      <ul className="space-y-2">
                        {deal.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <AlertCircle className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-2 shadow-xl sticky top-24">
              <CardHeader>
                <CardTitle>Claim This Deal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 text-center">
                  {deal.originalPrice > 0 && (
                    <div className="text-sm text-muted-foreground mb-2">
                      Regular Price
                    </div>
                  )}
                  {deal.originalPrice > 0 && (
                    <div className="text-2xl line-through text-muted-foreground mb-2">
                      ${deal.originalPrice.toLocaleString()}
                    </div>
                  )}
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {deal.discountedPrice === 0
                      ? 'FREE'
                      : `$${deal.discountedPrice.toLocaleString()}`}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Save ${(deal.originalPrice - deal.discountedPrice).toLocaleString()}
                  </div>
                </div>

                {!user && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      You need to be logged in to claim this deal
                    </AlertDescription>
                  </Alert>
                )}

                {deal.isLocked && user && !user.isVerified && (
                  <Alert variant="destructive">
                    <Lock className="h-4 w-4" />
                    <AlertDescription>
                      This deal requires account verification. Please verify your account first.
                    </AlertDescription>
                  </Alert>
                )}

                {hasAlreadyClaimed && (
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-600 dark:text-green-400">
                      You have already claimed this deal. Check your dashboard for details.
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  className="w-full text-lg py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={handleClaim}
                  disabled={claiming || isLoading || hasAlreadyClaimed || Boolean(deal.isLocked && user && !user.isVerified)}
                >
                  {hasAlreadyClaimed ? (
                    <>
                      <Check className="mr-2 w-5 h-5" />
                      Already Claimed
                    </>
                  ) : claiming ? (
                    'Claiming...'
                  ) : !user ? (
                    'Login to Claim'
                  ) : (
                    <>
                      <Sparkles className="mr-2 w-5 h-5" />
                      Claim Deal Now
                    </>
                  )}
                </Button>

                {user && (
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full">
                      View My Deals
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
