import { Button } from "@/components/ui/button";
import { Upload, Zap, Share2 } from "lucide-react";
import { handleCheckout, defaultProPlan } from "@/lib/checkout";
import CallToActionButton from "./CallToActionButton";
export var DemoSection = function () {
    var steps = [
        {
            icon: Upload,
            title: "Upload your meeting recording",
            description: "Zoom, Google Meet, Teams, even your phone's voice recorder.",
            iconColor: "text-blue-500",
            bgColor: "bg-blue-500/10"
        },
        {
            icon: Zap,
            title: "Transcript, summary, and action items",
            description: "Get the whole transcript of the meeting, summary of the recording, and actions items with deadlines.",
            iconColor: "text-yellow-500",
            bgColor: "bg-yellow-500/10"
        },
        {
            icon: Share2,
            title: "Share or save notes",
            description: "Get the notes as a link or save them as a PDF. Keep everyone on the same page without extra work.",
            iconColor: "text-green-500",
            bgColor: "bg-green-500/10"
        }
    ];
    return (<section className="py-16 relative overflow-hidden" id="features">
      {/* Background decoration */}
      <div className="absolute inset-0"></div>
      <div className="absolute top-10 right-20 w-64 h-64 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-20 w-48 h-48 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            From meeting recording to actionable notes in{" "}
            <span className="">
              3 clicks
            </span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Steps Column */}
          <div className="relative flex flex-col">
            <div className="space-y-6 flex-1">
              {steps.map(function (step, index) { return (<div key={index} className="group relative animate-fade-up hover:scale-105 transition-all duration-300" style={{ animationDelay: "".concat(index * 100, "ms") }}>
                  <div className="rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 border border-border/30 hover:border-primary/20 relative">
                    <div className="flex gap-5 items-start">
                      <div className="relative">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${step.bgColor}`}>
                          <step.icon className={`w-8 h-8 ${step.iconColor}`}/>
                        </div>
                        {/* Step number badge */}
                        <div className="absolute -top-2 -right-2 w-8 h-8 text-primary-foreground text-sm font-bold rounded-full flex items-center justify-center">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">{step.title}</h3>
                        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>); })}
            </div>
          </div>
          
          {/* Video Column */}
          <div className="relative animate-fade-up delay-200 flex flex-col">
            <div className="relative group flex-1 flex flex-col">
              <div className="absolute inset-0 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl transform scale-105"></div>
              <div className="relative backdrop-blur-sm rounded-3xl p-4 shadow-large border border-border/30 flex-1 flex flex-col">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/OV1PbEGu9js?si=n4kSF9YMIgRnVWw_" 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                  className="w-full h-full rounded-2xl flex-1"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-10 items-center justify-center flex">
            <div className="my-6">
              <CallToActionButton />
            </div>
        </div>
      </div>
    </section>);
};
