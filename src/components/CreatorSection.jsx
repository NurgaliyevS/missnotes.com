import Image from "next/image";
import { Users, Volume2, NotebookPen, Share2 } from "lucide-react";

export var CreatorSection = function () {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Hi, I'm{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Sabyr Nurgaliyev
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              The developer of MissNotes - your meeting notes companion
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="animate-fade-up order-first lg:order-last flex lg:justify-center">
              <div className="relative">
                <div className="w-56 h-56 mx-auto lg:mx-0 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                  <Image
                    src="/creator.webp"
                    alt="Sabyr Nurgaliyev - Creator of MissNotes"
                    className="w-full h-full object-cover"
                    width={256}
                    height={256}
                  />
                </div>
              </div>
            </div>

            <div className="animate-fade-up delay-200 space-y-5">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-slate-800">
                  Why I made it ?
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  I’ve always hated taking notes during meetings because it’s
                  time-consuming and distracting. After meetings, I often forgot key points, deadlines, and action
                  items. That frustration inspired me to create MissNotes.
                </p>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-slate-800">
                  How it can help you ?
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <Volume2 className="w-3 h-3 text-blue-600" />
                    </div>
                    <p className="text-base text-muted-foreground">
                      <strong className="text-slate-800">
                        Focus on what matters:
                      </strong>{" "}
                      Stay present in the meeting while MissNotes handles the notes
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <NotebookPen className="w-3 h-3 text-blue-600" />
                    </div>
                    <p className="text-base text-muted-foreground">
                      <strong className="text-slate-800">
                        Never miss details:
                      </strong>{" "}
                      Get complete summaries with action items in just 2
                      minutes, no matter how long the meeting was.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <Share2 className="w-3 h-3 text-blue-600" />
                    </div>
                    <p className="text-base text-muted-foreground">
                      <strong className="text-slate-800">
                        Share instantly:
                      </strong>{" "}
                      Send meeting notes to your team with one click, keeping
                      everyone on the same page.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <p className="text-base text-muted-foreground leading-relaxed">
                  The most happiest moment for me is when I see people using my
                  tool and getting value from it ❤️
                </p>
              </div>

              <div className="flex items-center space-x-4 pt-1">
                <a
                  href="https://x.com/tech_nurgaliyev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
                >
                  Follow me on X
                </a>
                <span className="text-sm text-muted-foreground">
                  I share daily updates how I'm growing my MissNotes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
