'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Lock, Search, Filter } from 'lucide-react';
import { mockDeals } from '@/lib/mock-data';
import { Deal } from '@/lib/types';

export default function DealsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAccess, setSelectedAccess] = useState<string>('all');

  const categories = ['all', 'cloud', 'marketing', 'analytics', 'productivity', 'design', 'development'];

  const filteredDeals = useMemo(() => {
    return mockDeals.filter((deal) => {
      const matchesSearch =
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.partner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || deal.category === selectedCategory;

      const matchesAccess =
        selectedAccess === 'all' ||
        (selectedAccess === 'locked' && deal.isLocked) ||
        (selectedAccess === 'unlocked' && !deal.isLocked);

      return matchesSearch && matchesCategory && matchesAccess;
    });
  }, [searchQuery, selectedCategory, selectedAccess]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="relative py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Explore All Deals</h1>
          <p className="text-xl text-white/90">
            Browse {mockDeals.length}+ exclusive offers for your startup
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <Card className="shadow-2xl border-2">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search deals, partners, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>

              <div className="flex gap-2">
                <Tabs value={selectedAccess} onValueChange={setSelectedAccess}>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
                    <TabsTrigger value="locked">
                      <Lock className="w-4 h-4 mr-1" />
                      Locked
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Categories:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize transition-all hover:scale-105"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 mb-6 flex items-center justify-between">
          <p className="text-lg text-muted-foreground">
            Showing <span className="font-bold text-foreground">{filteredDeals.length}</span> deals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {filteredDeals.map((deal, index) => (
            <Card
              key={deal.id}
              className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-purple-500/50 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
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

                <Badge className="mb-3 capitalize">{deal.category}</Badge>

                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {deal.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-2">
                  by <span className="font-semibold">{deal.partner}</span>
                </p>

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
                    View Details
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDeals.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No deals found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedAccess('all');
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
