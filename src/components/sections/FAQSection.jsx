import BookCallButton from "@/components/BookCallButton";

export default function FAQSection() {

  const faqs = [
    {
      question: "is Reddit good for marketing?",
      answer: "Reddit marketing stands out for its ability to reach niche audiences effectively. Users gather in specific communities based on their interests, making it easier to target the right people."
    },
    {
      question: "What's the best strategy to grow on Reddit?",
      answer: "Join subreddits you're interested in. Post about things you want to discuss and comment on topics you find interesting."
    },
    {
      question: "What is Reddit?",
      answer: "Reddit is a forum-style website where members share content and discuss specific topics and interests."
    },
    {
      question: "How to choose the right subreddit?",
      answer: "Look for subreddits that align closely with your product. For example, if your product is about technology, consider subreddits like r/technology or more specific ones like r/gadgets or r/programming."
    }
  ];

  return (
    <section className="py-16 px-4 mx-auto max-w-6xl">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">Reddit Marketing FAQs</h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {faqs.map((faq, index) => (
          <div key={index} className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">
              {faq.question}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center flex justify-center">
        <BookCallButton />
      </div>
    </section>
  );
}
