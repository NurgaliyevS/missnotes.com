// import { FaArrowRight } from "react-icons/fa";

export default function PricingSection() {

  const plans = [
    {
      name: "Reddit Growth Plan",
      price: "$3,000",
      description: "Reddit marketing solution to drive targeted traffic and build genuine engagement with your ideal customers through strategic content and community building.",
      features: [
        {
          icon: "10",
          title: "Strategic Posts",
          description: "High-quality, engaging posts crafted specifically for your target subreddits. Each post is designed to spark conversations and drive traffic to your business."
        },
        {
          icon: "40",
          title: "External comments",
          description: "Commenting on other people's posts and discussions to make your brand more visible and bring in new customers (10 comments every week)."
        },
        {
          icon: "1",
          title: "ICP Analysis",
          description: "Deep-dive analysis of your Ideal Customer Profile to identify exactly who your target audience is and how to reach them on Reddit."
        },
        {
          icon: "1",
          title: "Subreddit Analysis",
          description: "Comprehensive research and analysis of the best subreddits for your niche, including posting guidelines, peak times, and community behavior."
        },
        {
          icon: "Fast",
          title: "Quick Execution",
          description: "We execute in weeks, not months. Get your Reddit marketing campaign up and running quickly with our proven strategies and experienced team."
        }
      ],
      benefits: [
        "Results-driven approach",
        "Expert Reddit marketers", 
        "Transparent reporting"
      ],
      isPopular: false,
      link: "https://buy.stripe.com/fZu6oJ3VKa5Z706gViaVa0l"
    },
    {
      name: "Reddit Premium Plan",
      price: "$5,000",
      description: "Reddit marketing solution to improve LLM ranking, drive traffic, and build genuine engagement with your ideal customers through strategic content and community building.",
      features: [
        {
          icon: "20",
          title: "Strategic Posts",
          description: "High-quality, engaging posts crafted specifically for your target subreddits. Each post is designed to spark conversations and drive traffic to your business."
        },
        {
          icon: "120",
          title: "External comments",
          description: "Commenting on other people's posts and discussions to make your brand more visible and bring in new customers (30 comments every week)."
        },
        {
          icon: "1",
          title: "ICP Analysis",
          description: "Deep-dive analysis of your Ideal Customer Profile to identify exactly who your target audience is and how to reach them on Reddit."
        },
        {
          icon: "1",
          title: "Subreddit Analysis",
          description: "Comprehensive research and analysis of the best subreddits for your niche, including posting guidelines, peak times, and community behavior."
        },
        {
          icon: "Fast",
          title: "Quick Execution",
          description: "We execute in weeks, not months. Get your Reddit marketing campaign up and running quickly with our proven strategies and experienced team."
        }
      ],
      benefits: [
        "Results-driven approach",
        "Expert Reddit marketers", 
        "Transparent reporting"
      ],
      isPopular: true,
      link: "https://buy.stripe.com/00w9AV3VKemffwCfReaVa0m"
    }
  ];

  return (
    <section id="pricing" className="py-16 px-4 mx-auto max-w-6xl">
      <h2 className="text-3xl font-bold text-center mb-12">Pricing</h2>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {plans.map((plan, index) => (
          <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg border-2 ${plan.isPopular ? '' : 'border-gray-200'}`} style={plan.isPopular ? { borderColor: '#ff4500' } : {}}>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold mb-4" style={{ color: '#ff4500' }}>{plan.price}</div>
              <p className="text-gray-600 leading-relaxed">{plan.description}</p>
            </div>

            <div className="space-y-6 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fff5f0' }}>
                    <span className="font-bold text-sm" style={{ color: '#ff4500' }}>{feature.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <div className="flex flex-wrap gap-2 mb-6">
                {plan.benefits.map((benefit, benefitIndex) => (
                  <span key={benefitIndex} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500">✓</span>
                    {benefit}
            </span>
                ))}
              </div>
              
              <a
                href={plan.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center text-white ${
                  plan.isPopular 
                    ? '' 
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
                style={plan.isPopular ? { backgroundColor: '#ff4500' } : {}}
                onMouseEnter={(e) => {
                  if (plan.isPopular) {
                    e.target.style.backgroundColor = '#e03e00';
                  }
                }}
                onMouseLeave={(e) => {
                  if (plan.isPopular) {
                    e.target.style.backgroundColor = '#ff4500';
                  }
                }}
              >
                {/* <FaArrowRight className="w-4 h-4 inline mr-2" /> */}
                Get Started Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
