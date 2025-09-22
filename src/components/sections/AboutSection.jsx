import CallToActionButton from "@/components/CallToActionButton";

export default function AboutSection() {

  return (
    <section className="pt-8 pb-4 lg:py-16 px-4 mx-auto max-w-5xl">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Column - Image */}
        <div className="flex justify-center lg:justify-start w-full lg:w-[50%] lg:h-[515px] order-2 lg:order-1">
          <img 
            src="/missnotes-screenshot.png" 
            alt="Professional photo" 
            className="w-[470px] h-[310px] object-contain rounded-3xl"
          />
        </div>

        {/* Right Column - Content */}
        <div className="space-y-6 w-full lg:w-[50%] order-1 lg:order-2">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            {/* Fast-working agency with right target */}
            Struggle going from meeting to meeting and trying to remember everything?
          </h2>
          
          <p className="text-xl text-gray-500 italic">
            Here's the best workflow:
          </p>

          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-gray-700">
                Record the meeting
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-gray-700">
                Upload the recording to MissNotes
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-gray-700">
                Get the notes, key decisions and action items in 2 minutes
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-gray-700">
                Share instantly with your meeting attendees
              </span>
            </li>
          </ul>

          <div className="my-6">
          <CallToActionButton />
          </div>
        </div>
      </div>
    </section>
  );
}
