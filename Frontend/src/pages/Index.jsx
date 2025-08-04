import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Users, 
  Video, 
  Calendar, 
  TrendingUp, 
  Star,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Globe
} from 'lucide-react';

const Index = () => {
  useAuth();
  const features = [
    {
      icon: Video,
      title: 'HD Video Streaming',
      description: 'Crystal clear video quality with adaptive bitrate streaming'
    },
    {
      icon: Users,
      title: 'Live Interaction',
      description: 'Real-time chat and engagement with speakers and attendees'
    },
    {
      icon: Calendar,
      title: 'Event Management',
      description: 'Complete event lifecycle management from planning to execution'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights and analytics for all your events'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with end-to-end encryption'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Reach audiences worldwide with our global CDN network'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Event Manager',
      company: 'TechCorp',
      content: 'EventStream transformed how we host virtual events. The platform is intuitive and our engagement rates increased by 300%.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Marketing Director',
      company: 'InnovateLab',
      content: 'The analytics and reporting features give us incredible insights into our audience behavior and event performance.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Learning & Development',
      company: 'FutureTech',
      content: 'Our training sessions have never been more engaging. The interactive features keep our employees actively participating.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Play className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">EventStream</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-primary">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
                <Zap className="h-3 w-3 mr-1" />
                Next-Generation Event Platform
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Stream Events<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                  Like Never Before
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
                Professional event streaming platform that delivers exceptional experiences 
                for hosts and attendees with enterprise-grade features.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-elegant">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-white/80">Events Hosted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">100K+</div>
                <div className="text-white/80">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">99.9%</div>
                <div className="text-white/80">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to create, manage, and deliver exceptional event experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-gradient-primary rounded-lg">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-muted-foreground">
              See what our customers have to say about EventStream
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Transform Your Events?
          </h2>
          <p className="text-xl text-white/80">
            Join thousands of organizations already using EventStream to deliver 
            world-class virtual experiences.
          </p>
          
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Play className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">EventStream</span>
            </div>
            <div className="text-muted-foreground">
              © 2024 EventStream. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
