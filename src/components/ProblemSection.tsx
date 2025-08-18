import { CheckCircle, Clock, FileText, Users } from "lucide-react";

export const ProblemSection = () => {
  const painPoints = [
    {
      icon: Clock,
      text: "Tired of rewatching long Zoom recordings?"
    },
    {
      icon: Users,
      text: "Forgetting action items from client calls?"
    },
    {
      icon: FileText,
      text: "Forgetting what was discussed?"
    }
  ];

  const benefits = [
    "Clean summary",
    "Key decisions", 
    "Action items with deadlines"
  ];

  return (
    <section className="py-24 bg-gradient-subtle relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
            Why remote workers love Miss Notes
          </h2>
        </div>

        {/* Pain Points Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className="group relative animate-fade-up hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-soft hover:shadow-large transition-all duration-300 border border-border/50 hover:border-primary/30">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow group-hover:animate-glow">
                    <point.icon className="w-10 h-10 text-primary-foreground" />
                  </div>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed font-medium">{point.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="bg-card/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-medium border border-border/50">
            <p className="text-xl md:text-2xl mb-10 text-foreground font-medium leading-relaxed">
              Miss Notes does the most boring work for you - upload your call, and in 2 minutes you'll get:
            </p>
            <div className="grid sm:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-center sm:justify-start gap-4 animate-fade-up hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${(index + 3) * 150}ms` }}
                >
                  <div className="relative">
                    <CheckCircle className="w-8 h-8 text-primary flex-shrink-0 drop-shadow-sm" />
                    <div className="absolute inset-0 w-8 h-8 bg-primary/20 rounded-full blur-sm group-hover:scale-110 transition-transform"></div>
                  </div>
                  <span className="text-lg font-semibold text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};