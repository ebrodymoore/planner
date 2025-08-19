'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight,
  CheckCircle,
  X,
  Sparkles,
  TrendingUp,
  Users,
  Heart,
  MapPin,
  Calendar,
  Shield,
  Target,
  Briefcase,
  GraduationCap,
  Car,
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  user?: any;
  onDashboard?: () => void;
}

export default function LandingPage({ onGetStarted, user, onDashboard }: LandingPageProps) {
  const router = useRouter();
  const [expandedFAQ, setExpandedFAQ] = React.useState<number | null>(null);

  const features = [
    {
      icon: Briefcase,
      title: "Real-Life Scenario Planning",
      question: "Should I take this job offer?",
      description: "Get instant analysis considering salary, benefits, cost of living, career trajectory, and your family situation."
    },
    {
      icon: Shield,
      title: "Healthcare Decision Support",
      question: "Which health plan saves me the most money?",
      description: "Compare plans based on your actual health needs, family situation, and financial goals."
    },
    {
      icon: Target,
      title: "401k vs. Debt Optimization",
      question: "Should I max my 401k or pay off my credit cards?",
      description: "Get personalized advice that factors in your employer match, interest rates, tax situation, and financial goals."
    },
    {
      icon: Heart,
      title: "Life Event Planning",
      question: "I'm getting married/divorced/having a baby—what should I do financially?",
      description: "Receive step-by-step guidance for major life transitions with timelines and priorities."
    },
    {
      icon: Car,
      title: "Crisis Decision Support",
      question: "My car died—repair, buy used, or lease?",
      description: "Get instant analysis based on your budget, credit, transportation needs, and financial priorities."
    },
    {
      icon: GraduationCap,
      title: "Career Transition Planning",
      question: "Should I go back to school/change careers/start a business?",
      description: "Understand the true financial impact of major career decisions before you make them."
    }
  ];

  const faqs = [
    {
      question: "How is this different from other financial planning tools?",
      answer: "Most tools give you generic advice based on numbers. We give you specific recommendations based on your actual life situation. Instead of 'save 20% of income,' we tell you whether you should prioritize your emergency fund, 401k match, or high-interest debt based on YOUR job security, family needs, and goals."
    },
    {
      question: "What if my situation is really complex?",
      answer: "Complex situations are exactly what we're built for. Our software has been trained on thousands of real-world scenarios including job changes, health issues, family dynamics, and major life transitions. The more complex your situation, the more valuable our contextual analysis becomes."
    },
    {
      question: "Do you give investment advice?",
      answer: "We provide educational guidance on financial decisions and trade-offs. For specific investment recommendations, we'll connect you with licensed professionals. Think of us as your pre-investment decision support system."
    },
    {
      question: "What if my situation changes?",
      answer: "That's the point! Our system adapts as your life evolves. New job, family changes, health issues—just update your situation and get fresh analysis. Your financial strategy should change as your life changes."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">ContextFi</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-800 transition-colors">How It Works</a>
            <a href="#features" className="text-gray-600 hover:text-gray-800 transition-colors">Scenarios</a>
            <a href="#faq" className="text-gray-600 hover:text-gray-800 transition-colors">FAQ</a>
            {user ? (
              <Button 
                onClick={onDashboard}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white"
              >
                Dashboard
              </Button>
            ) : (
              <Button 
                onClick={() => router.push('/sign-in')}
                variant="ghost" 
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-32">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-gray-600">Contextual Financial Intelligence Platform</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent mb-6 leading-tight">
            Your Continuous Finance
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Sidekick Who Actually
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Knows You
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Stop getting generic advice that ignores your real situation. Get personalized financial guidance 
            that factors in your job, family, health, and life goals—not just your bank balance.
          </p>
          
          <div className="max-w-5xl mx-auto mb-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Should you max out your 401k or pay off debt first? Which health insurance plan saves you the most money? 
              Take that job offer or stay put? Our software understands your unique situation and gives you answers 
              that actually make sense for YOUR life.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 font-medium">Real-world scenarios, not generic calculators</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 font-medium">Considers your actual job, family, and goals</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 font-medium">Adapts as your life changes</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 font-medium">Get answers in minutes, not months</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={onGetStarted}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-8 py-4 text-lg rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 border-0"
              size="lg"
            >
              Get Smart Advice for My Situation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              onClick={() => router.push('/sign-up')}
              variant="outline"
              className="bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg rounded-2xl shadow-xl transition-all duration-300"
              size="lg"
            >
              Create Free Account
            </Button>
          </div>
        </section>

        {/* Problem Section */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Tired of Financial Advice That
              <br />
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Doesn't Fit Your Life?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Every financial decision happens in context, but most tools treat you like a spreadsheet:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: X,
                title: "Generic calculators",
                description: "that assume everyone's situation is identical"
              },
              {
                icon: X,
                title: "One-size-fits-all advice",
                description: "that ignores your job, family, and goals"
              },
              {
                icon: X,
                title: "Academic theories",
                description: "that fall apart in real-world scenarios"
              },
              {
                icon: X,
                title: "Perfect world assumptions",
                description: "that don't account for life's messiness"
              }
            ].map((problem, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-red-50 border border-red-200 rounded-2xl">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <X className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{problem.title}</h4>
                  <p className="text-gray-600">{problem.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The result? You're left making major financial decisions with advice that doesn't actually apply to your situation.
            </p>
          </div>
        </section>

        {/* Solution Section */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gray-800">Introducing </span>
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Contextual Financial
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Intelligence
              </span>
            </h2>
          </div>

          <Card className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl border-gray-200 overflow-hidden">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl">
                    <Users className="w-8 h-8 text-emerald-400" />
                  </div>
                  <Plus className="w-6 h-6 text-gray-400" />
                  <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl">
                    <MapPin className="w-8 h-8 text-blue-400" />
                  </div>
                  <Plus className="w-6 h-6 text-gray-400" />
                  <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl">
                    <Heart className="w-8 h-8 text-purple-400" />
                  </div>
                  <Plus className="w-6 h-6 text-gray-400" />
                  <div className="p-3 bg-gradient-to-r from-pink-500/20 to-emerald-500/20 rounded-xl">
                    <Calendar className="w-8 h-8 text-pink-400" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  We built software that understands your actual life—not just your numbers.
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Our system considers your job situation, family dynamics, health needs, location, and life stage 
                  to give you financial guidance that actually makes sense for YOUR specific circumstances.
                </p>
                <p className="text-lg text-emerald-400 font-medium">
                  Think of it as having a brilliant financial advisor who knows everything about your situation 
                  and can instantly analyze any decision you're facing.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features Section */}
        <section id="features" className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Financial Decisions Made
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Smarter
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="group bg-white/60 backdrop-blur-xl border-gray-200 hover:bg-white/80 hover:border-emerald-500/30 transition-all duration-500">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl group-hover:from-emerald-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                        <IconComponent className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>
                    <CardTitle className="text-xl text-gray-800 mb-3">{feature.title}</CardTitle>
                    <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                      <p className="text-emerald-400 font-medium italic">"{feature.question}"</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Get Smart Answers in
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                3 Simple Steps
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: "1",
                title: "Tell Us About Your Situation",
                description: "Share your job, family, goals, and the decision you're facing. Takes 2 minutes.",
                icon: Users
              },
              {
                step: "2", 
                title: "Get Contextual Analysis",
                description: "Our software considers all aspects of your life to analyze your options and their impact.",
                icon: TrendingUp
              },
              {
                step: "3",
                title: "Make Confident Decisions", 
                description: "Receive clear recommendations with explanations of why this makes sense for YOU.",
                icon: Target
              }
            ].map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">{step.step}</span>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="p-2 bg-white rounded-lg border border-gray-200">
                        <IconComponent className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Frequently Asked
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-white/60 backdrop-blur-xl border-gray-200">
                <CardContent className="p-0">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h4 className="text-lg font-semibold text-gray-800 pr-4">{faq.question}</h4>
                    {expandedFAQ === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 border border-gray-200 backdrop-blur-xl overflow-hidden max-w-4xl mx-auto">
            <CardContent className="p-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full mb-8">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-gray-600">Ready to get started?</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Stop Making Financial
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  Decisions in the Dark
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
                Every day you wait is another day of making important financial choices without the full picture. 
                Join people who stopped guessing about money and started making smart decisions based on their actual situation.
              </p>
              
              <Button 
                onClick={onGetStarted}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-8 py-4 text-lg rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 border-0 mb-6"
                size="lg"
              >
                Get My Personalized Financial Analysis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <p className="text-gray-600">
                Try risk-free. Cancel anytime if you're not making better financial decisions.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 mt-32">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">ContextFi</span>
            </div>
            <p className="text-gray-600 mb-6">Financial intelligence that gets your life</p>
            <p className="text-sm text-gray-600 max-w-4xl mx-auto leading-relaxed">
              ContextFi provides educational content and general financial guidance based on your specific situation. 
              We do not provide investment advice or manage assets. For investment recommendations, consult with a licensed financial advisor.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}