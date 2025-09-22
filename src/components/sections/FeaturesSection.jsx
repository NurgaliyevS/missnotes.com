import CallToActionButton from "@/components/CallToActionButton";

export default function FeaturesSection() {
  return (
    <section className="pt-8 pb-4 lg:py-16 px-4 mx-auto max-w-5xl">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Column - Content */}
        <div className="space-y-6 w-full lg:w-[50%]">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            Why people with ADHD use Miss Notes
          </h2>

          <div className="space-y-4">
            <h3 className="text-xl text-gray-500 italic">
              Does this sound like you?
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-gray-700">
                  Meetings sucking the life out of you?
                </span>
              </li>
              <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-gray-700">
                  Can't take notes and pay attention at the same time?
                </span>
              </li>
              <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-gray-700">
                  Managers asking you to follow up after calls and you have
                  nothing?
                </span>
              </li>
              <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-gray-700">
                  Can't keep details of a meeting?
                </span>
              </li>
              <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-gray-700">
                  Never be able to remember anything ?
                </span>
              </li>
            </ul>
          </div>

          <div className="my-6 ">
          <CallToActionButton />
          </div>
        </div>

        <div className="flex justify-center w-full lg:w-[50%]">
          <img
            src="/adhd-confused-man.webp"
            alt="ADHD confused man"
            className="w-[470px] h-[310px] object-contain rounded-3xl"
          />
        </div>
      </div>
    </section>
  );
}
