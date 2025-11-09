import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, CloudRain, Brain, MapPin, Droplets, Sun, Users } from "lucide-react";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Real-Time Heatwave Alerts for a Safer Pune
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Our AI-powered system predicts high-risk zones to protect our most vulnerable communities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 text-lg px-8">
              <Link to="/dashboard">View Live Risk Map</Link>
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Enter your Pincode or Locality"
                className="pl-12 h-14 text-lg bg-white"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-muted-foreground mb-16 text-lg">
            Our AI system combines multiple data sources to predict heatwave risks in real-time
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CloudRain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Analyze Real-Time Data</h3>
                <p className="text-muted-foreground">
                  We collect and analyze weather, demographic, and health data continuously
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Risk Prediction</h3>
                <p className="text-muted-foreground">
                  Our AI model identifies high-risk zones and vulnerable population groups
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Location-Based Alerts</h3>
                <p className="text-muted-foreground">
                  Get zone-specific alerts and actionable safety recommendations
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Safety Tips Preview */}
      <section className="py-20 px-4 bg-secondary/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Essential Safety Tips</h2>
          <p className="text-center text-muted-foreground mb-16 text-lg">
            Quick actions to protect yourself and others during extreme heat
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-8">
                <Droplets className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Stay Hydrated</h3>
                <p className="text-muted-foreground">
                  Drink water every 15-20 minutes, even if you don't feel thirsty. Avoid alcohol and caffeine.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-8">
                <Sun className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Avoid Direct Sun</h3>
                <p className="text-muted-foreground">
                  Stay indoors during peak hours (11 AM - 4 PM). Use umbrellas, hats, and light-colored clothing.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-8">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Check on Neighbors</h3>
                <p className="text-muted-foreground">
                  Regularly check on elderly family members, neighbors, and those living alone.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link to="/safety">View All Safety Guidelines</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-foreground text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-lg mb-4">
            PCCOE International Grand Challenge: 2025 - AI for Climate Change
          </p>
          <p className="text-white/70">
            Built by Team MIT-WPU | Protecting communities through AI innovation
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
