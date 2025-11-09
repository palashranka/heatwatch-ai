import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Droplets, 
  Sun, 
  Users, 
  AlertCircle, 
  Heart, 
  Home,
  Baby,
  Phone
} from "lucide-react";
import Navbar from "@/components/Navbar";

const Safety = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Safety & Prevention</h1>
          <p className="text-xl text-muted-foreground">
            Essential guidelines to protect yourself and your loved ones during heatwaves
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Recognizing Heatstroke */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-risk-danger" />
                Recognizing Heatstroke
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium">Warning Signs:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-risk-danger mt-1">•</span>
                  <span>High body temperature (40°C or higher)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-risk-danger mt-1">•</span>
                  <span>Confusion, altered mental state, or slurred speech</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-risk-danger mt-1">•</span>
                  <span>Hot, dry skin or profuse sweating</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-risk-danger mt-1">•</span>
                  <span>Nausea, vomiting, or rapid breathing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-risk-danger mt-1">•</span>
                  <span>Rapid or irregular heartbeat</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          {/* First Aid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-risk-danger" />
                First Aid for Heatstroke
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium text-risk-danger">Call emergency services immediately (108)</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">1.</span>
                  <span>Move person to a cool, shaded area</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">2.</span>
                  <span>Remove excess clothing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">3.</span>
                  <span>Cool with wet cloths or fanning</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">4.</span>
                  <span>Apply ice packs to neck, armpits, and groin</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">5.</span>
                  <span>If conscious, give small sips of cool water</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Stay Cool */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-6 w-6 text-primary" />
                How to Stay Cool
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Sun className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Avoid Peak Hours</p>
                  <p className="text-sm text-muted-foreground">Stay indoors between 11 AM - 4 PM when sun is strongest</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Home className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Keep Your Home Cool</p>
                  <p className="text-sm text-muted-foreground">Use fans, close curtains during day, open windows at night</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Droplets className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Take Cool Showers</p>
                  <p className="text-sm text-muted-foreground">Multiple cool baths or showers throughout the day</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sun className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Wear Light Clothing</p>
                  <p className="text-sm text-muted-foreground">Loose, light-colored, breathable fabrics like cotton</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Hydration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-6 w-6 text-primary" />
                Stay Hydrated
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Droplets className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Drink Water Regularly</p>
                  <p className="text-sm text-muted-foreground">Every 15-20 minutes, even if not thirsty (2-4 glasses per hour)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-risk-danger mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Avoid Certain Drinks</p>
                  <p className="text-sm text-muted-foreground">No alcohol, caffeine, or very sugary drinks - they dehydrate</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Droplets className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Eat Water-Rich Foods</p>
                  <p className="text-sm text-muted-foreground">Fruits like watermelon, cucumber, oranges</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Droplets className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Oral Rehydration Solution</p>
                  <p className="text-sm text-muted-foreground">ORS or electrolyte drinks for heavy sweating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Protecting Children & Elderly */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="h-6 w-6 text-primary" />
                Protecting Children & Elderly
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Vulnerable groups need extra care during extreme heat:
              </p>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Check on them frequently</p>
                  <p className="text-sm text-muted-foreground">Visit or call elderly neighbors and relatives daily</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Baby className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Never leave in vehicles</p>
                  <p className="text-sm text-muted-foreground">Cars heat up rapidly - never leave children or pets inside</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sun className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Limit outdoor activities</p>
                  <p className="text-sm text-muted-foreground">Schedule outdoor play early morning or evening</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Monitor medications</p>
                  <p className="text-sm text-muted-foreground">Some medications affect heat tolerance - consult doctor</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Emergency Contacts */}
          <Card className="bg-risk-danger/5 border-risk-danger">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-risk-danger">
                <Phone className="h-6 w-6" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-bold text-2xl mb-1">108</p>
                <p className="text-sm text-muted-foreground">Emergency Medical Services</p>
              </div>
              <div>
                <p className="font-bold text-2xl mb-1">102</p>
                <p className="text-sm text-muted-foreground">Medical Helpline</p>
              </div>
              <div>
                <p className="font-bold text-2xl mb-1">1075</p>
                <p className="text-sm text-muted-foreground">National Disaster Helpline</p>
              </div>
              <div className="pt-4 border-t">
                <p className="font-medium mb-2">When to Call:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Symptoms of heatstroke</li>
                  <li>• Person becomes unconscious</li>
                  <li>• Seizures or difficulty breathing</li>
                  <li>• Confusion or behavioral changes</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Safety;
