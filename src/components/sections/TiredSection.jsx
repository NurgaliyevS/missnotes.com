import BookCallButton from "@/components/BookCallButton";

export default function TiredSection() {
  return (
    <section className="py-16 px-4 mx-auto max-w-5xl">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Column - Content */}
        <div className="space-y-6 w-full lg:w-[50%] order-1 lg:order-1">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            Every meeting feels like a nightmare?
          </h2>
          <div className="space-y-4">
            <p className="text-xl text-gray-500 italic">
              Everyone else was writing notes, asking smart questions, and you were
              just… blank
            </p>
            <p className="text-lg text-gray-700">
              Yeah, I had the same experience.
            </p>
            <p className="text-lg text-gray-700">
              I created Miss Notes to help you feel more confident and improve
              clarity.
            </p>
          </div>

          <BookCallButton />
        </div>

        {/* Right Column - Meme Image */}
        <div className="flex justify-center lg:justify-end w-full lg:w-[50%] order-2 lg:order-2">
          <img
            src="/meeting-meme.png"
            alt="Meeting meme"
            className="w-[470px] h-[310px] object-contain rounded-3xl"
          />
        </div>
      </div>
    </section>
  );
}
