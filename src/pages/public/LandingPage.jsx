import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Users, TrendingUp, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';

const LandingPage = () => {
  const features = [
    {
      icon: Leaf,
      title: 'Direct from Farmers',
      description: 'Fresh produce directly from verified local farmers to your table',
    },
    {
      icon: Shield,
      title: 'Quality Assured',
      description: 'Every farmer is verified by agricultural extension officers',
    },
    {
      icon: TrendingUp,
      title: 'Fair Pricing',
      description: 'Transparent pricing that benefits both farmers and buyers',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Supporting local farmers and sustainable agriculture',
    },
  ];

  return (
    <div className="min-h-screen bg-primary-dark">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-primary-light/50 backdrop-blur-sm fixed w-full top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-cyan rounded-lg flex items-center justify-center">
                <span className="text-primary-dark font-bold text-2xl">A</span>
              </div>
              <span className="text-2xl font-bold gradient-text">
                AgroConnect
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 kente-pattern">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Connecting <span className="gradient-text">Farmers</span> with{' '}
              <span className="gradient-text">Buyers</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300 mb-10 max-w-3xl mx-auto">
              A digital marketplace empowering African farmers through direct 
              market access, fair pricing, and verified quality assurance
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" icon={ArrowRight} iconPosition="right">
                  Start Selling
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="secondary">
                  Start Buying
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-primary-light/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why AgroConnect?</h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Transforming agriculture through technology and community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card card-hover text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-teal/20 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-accent-cyan" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-neutral-100">
                  {feature.title}
                </h3>
                <p className="text-neutral-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="card bg-gradient-dark p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
              Join thousands of farmers and buyers transforming agriculture in Africa
            </p>
            <Link to="/register">
              <Button size="lg" icon={ArrowRight} iconPosition="right">
                Create Your Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-8 bg-primary-light/50">
        <div className="container-custom">
          <div className="text-center text-neutral-500">
            <p>© 2025 AgroConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;