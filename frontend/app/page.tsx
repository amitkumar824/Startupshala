'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Lock, TrendingUp, Users, Zap, Shield, Rocket } from 'lucide-react';
import { mockDeals } from '@/lib/mock-data';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featuredDeals = mockDeals.slice(0, 3);

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.3), transparent 50%),
                            radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.3), transparent 50%)`,
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />

        <div className="absolute inset-0">
          {mounted && (
            <>
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white/20 dark:bg-white/10 animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 100 + 50}px`,
                    height: `${Math.random() * 100 + 50}px`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${Math.random() * 10 + 10}s`,
                  }}
                />
              ))}
            </>
          )}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={`transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-2 text-sm font-medium animate-pulse"
            >
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Trusted by 2,000+ Startups
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              Exclusive Benefits for
              <br />
              <span className="relative">
                Your Startup
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="12"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 10C50 2 150 2 198 10"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#9333ea" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Access $500,000+ in exclusive deals on premium SaaS tools.
              Cloud credits, marketing tools, analytics platforms, and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/deals">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                >
                  Explore Deals
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 transform hover:scale-105 transition-all"
                >
                  Get Started Free
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { icon: Users, label: '2,000+ Startups', color: 'text-blue-600' },
                { icon: Zap, label: '50+ Partners', color: 'text-purple-600' },
                { icon: TrendingUp, label: '$500K+ Value', color: 'text-pink-600' },
                { icon: Shield, label: 'Verified Deals', color: 'text-green-600' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 delay-${index * 100} ${
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                >
                  <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                  <p className="font-semibold text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured Deals</h2>
            <p className="text-xl text-muted-foreground">
              Start saving today with our most popular offers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredDeals.map((deal, index) => (
              <Card
                key={deal.id}
                className={`group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-purple-500/50 ${
                  mounted
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="relative mb-4">
                    <div className="w-full h-48 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                      <img
                        src={deal.logoUrl}
                        alt={deal.partner}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    {deal.isLocked && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-yellow-500/90 text-white">
                          <Lock className="w-3 h-3 mr-1" />
                          Locked
                        </Badge>
                      </div>
                    )}
                  </div>

                  <Badge className="mb-3">{deal.category}</Badge>

                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
                    {deal.title}
                  </h3>

                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {deal.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-green-600">
                        {deal.discountPercentage}% OFF
                      </span>
                      {deal.originalPrice > 0 && (
                        <p className="text-sm text-muted-foreground line-through">
                          ${deal.originalPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {deal.claimCount} claimed
                    </Badge>
                  </div>

                  <Link href={`/deals/${deal.id}`}>
                    <Button className="w-full group-hover:bg-purple-600 transition-colors">
                      View Deal
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/deals">
              <Button size="lg" variant="outline" className="hover:scale-105 transition-all">
                View All Deals
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Rocket,
                title: 'Exclusive Access',
                description: 'Get access to deals not available anywhere else',
              },
              {
                icon: Shield,
                title: 'Verified Partners',
                description: 'All partners are verified and trusted by thousands',
              },
              {
                icon: Zap,
                title: 'Instant Activation',
                description: 'Claim deals and start using them immediately',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center transform hover:scale-105 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Save Big?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of startups already saving with exclusive deals
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 5s ease infinite;
        }

        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
