import { Quote } from "lucide-react";
export var SocialProofSection = function () {
    var testimonials = [
        {
            text: "As a freelancer, I used to spend 30 mins writing call notes. Now it's 2 mins with Miss Notes.",
            author: "Remote Designer",
            avatar: "👩‍💻"
        },
        {
            text: "No more missed tasks. Every action item is captured automatically.",
            author: "Startup Marketer",
            avatar: "👨‍💼"
        },
        {
            text: "Game changer for client calls. Professional summaries every time.",
            author: "Consultant",
            avatar: "👩‍💼"
        }
    ];
    return (<section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            Trusted by remote workers everywhere
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map(function (testimonial, index) { return (<div key={index} className="bg-card p-8 rounded-2xl shadow-soft animate-fade-up border border-border/50 hover:shadow-medium transition-all duration-300" style={{ animationDelay: "".concat(index * 150, "ms") }}>
              <Quote className="w-8 h-8 text-primary mb-4"/>
              <p className="text-lg mb-6 leading-relaxed text-muted-foreground">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{testimonial.avatar}</span>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                </div>
              </div>
            </div>); })}
        </div>
      </div>
    </section>);
};
