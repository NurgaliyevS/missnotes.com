import { Button } from "@/components/ui/button";
export var ClosingCTASection = function () {
    return (<section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto animate-fade-up">
          <h2 className="text-5xl font-bold mb-6">
            Stop missing notes.{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Start saving time.
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            Join remote workers who already save hours every week with Miss Notes.
          </p>
          <Button variant="hero" size="lg" className="text-xl px-12 py-6 animate-glow">
            Start 7 Day Free Trial
          </Button>
        </div>
      </div>
    </section>);
};
