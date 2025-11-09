import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Users, Target, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";

const teamMembers = [
  { name: "Aviraj Sinha", role: "Team Lead & AI Developer" },
  { name: "Garv Agrawal", role: "Data Scientist" },
  { name: "Palash Ranka", role: "Full-Stack Developer" },
  { name: "Lohitaksh Bisen", role: "ML Engineer" },
  { name: "Tanvi Hardas", role: "UI/UX & Research" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Our Project</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Using AI to build climate resilience and protect vulnerable communities from heatwave risks
          </p>
        </div>
        
        {/* Mission Statement */}
        <Card className="mb-12 bg-gradient-hero text-white">
          <CardContent className="p-8 md:p-12">
            <div className="flex items-start gap-4 mb-6">
              <Target className="h-12 w-12 flex-shrink-0" />
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-lg text-white/90 leading-relaxed">
                  To reduce heatwave-related fatalities and health impacts in Pune by leveraging artificial intelligence 
                  to predict high-risk zones and deliver timely, location-specific alerts to vulnerable populations. 
                  Our goal is to build a scalable, data-driven early warning system that empowers communities and 
                  authorities to take proactive measures during extreme heat events.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* The Challenge */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-primary" />
                The Challenge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Climate change is increasing the frequency and intensity of heatwaves globally. Urban areas like 
                Pune face unique challenges due to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Urban heat island effects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Large vulnerable populations (elderly, children, outdoor workers)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Limited awareness and preparedness</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Lack of localized, real-time risk information</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          {/* Our Solution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-primary" />
                Our Solution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We've developed an AI-powered early warning system that:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Analyzes real-time weather, demographic, and health data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Predicts zone-specific heatwave health risks using machine learning</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Provides location-based alerts and safety recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Enables proactive community protection and resource allocation</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {/* Competition Info */}
        <Card className="mb-12 border-primary border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              PCCOE International Grand Challenge: 2025
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground mb-4">
              This project is our entry for the <strong>PCCOE International Grand Challenge: 2025</strong>, 
              focused on the theme <strong>"AI for Climate Change"</strong>. Our team is passionate about 
              using technology to address critical climate challenges and build resilient communities.
            </p>
            <p className="text-muted-foreground">
              We believe that AI-driven solutions can play a crucial role in climate adaptation, 
              and our heatwave prediction system demonstrates the potential of data science and machine 
              learning in saving lives and protecting public health.
            </p>
          </CardContent>
        </Card>
        
        {/* Team Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Meet Our Team</h2>
            <p className="text-muted-foreground">
              B.Tech CSE Students from MIT-WPU, Pune
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-muted-foreground text-sm">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Technology Stack */}
        <Card>
          <CardHeader>
            <CardTitle>Technology & Approach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Data Sources</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Real-time weather data (IMD)</li>
                  <li>• Demographic statistics</li>
                  <li>• Urban heat mapping</li>
                  <li>• Health infrastructure data</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">AI/ML Models</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Heat index prediction</li>
                  <li>• Risk classification</li>
                  <li>• Vulnerability mapping</li>
                  <li>• Pattern recognition</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Platform</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Web-based dashboard</li>
                  <li>• Interactive map visualization</li>
                  <li>• Real-time alerts</li>
                  <li>• Mobile-responsive design</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
