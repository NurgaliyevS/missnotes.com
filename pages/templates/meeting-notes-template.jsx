import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function MeetingNotesTemplate() {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingDOCX, setIsGeneratingDOCX] = useState(false);
  
  // Generate today's date in the required format
  const today = new Date();
  const todayFormatted = today.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
  
  // Generate next week's date for follow-up meeting
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const nextWeekFormatted = nextWeek.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
  
  // Generate tomorrow's date for action items
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowFormatted = tomorrow.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
  
  // Generate day after tomorrow for other action items
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);
  const dayAfterTomorrowFormatted = dayAfterTomorrow.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
  
  // Generate day after day after tomorrow for final action items
  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(today.getDate() + 3);
  const threeDaysLaterFormatted = threeDaysLater.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });


  const generatePDFForTemplate = async (templateKey) => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    setIsGeneratingPDF(true);
    
    try {
      // Dynamically import html2pdf.js only on client side
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = document.getElementById(`meeting-notes-content-${templateKey}`);
      if (!element) {
        throw new Error('Content element not found');
      }
      
      const opt = {
        margin: 0.5,
        filename: `meeting-notes-${templateKey}-template.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait' 
        },
        pagebreak: { mode: ['css', 'legacy'] }
      };
      
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const generateDOCXForTemplate = async (templateKey) => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    setIsGeneratingDOCX(true);
    
    try {
      // Import and use the DOCX generator
      const { generateMeetingNotesDOCX } = await import('../../src/lib/docxGenerator');
      await generateMeetingNotesDOCX(templateKey);
    } catch (error) {
      console.error('Error generating DOCX:', error);
      alert('Error generating DOCX. Please try again.');
    } finally {
      setIsGeneratingDOCX(false);
    }
  };

  const faqData = [
    {
      question: "What is the best template for meeting notes?",
      answer: "The best meeting notes template includes essential information such as date, time, and attendees, the meeting's purpose and agenda, detailed summaries of discussions and decisions, and clearly assigned action items with owners and deadlines."
    },
    {
      question: "How do you write a good meeting note?",
      answerList: [
        "A summary of the meeting agenda and outcomes.",
        "Action items assigned to specific teams/individuals, with deadlines.",
        "Items to discuss in future meetings.",
        "Answers to questions that came up during the meeting.",
        "Open-ended questions (specifying who to follow up with)."
      ]
    },
    {
      question: "What are the 4 P's of a meeting agenda??",
      answer: "The \"4 Ps\" of a meeting agenda are Purpose, Product, People, and Process."
    },
    {
      question: "How detailed should meeting notes be?",
      answer: "The minutes should follow the order of the agenda, with a basic, almost vague, summary sentence or two for each item, along with the name of the person who presented it."
    }
  ];

  return (
    <>
      <Head>
        <title>Free Meeting Notes Template - Download PDF & DOCX | Professional Meeting Minutes</title>
        <meta name="description" content="Download our free meeting notes template in PDF and DOCX formats. Professional meeting minutes template with action items, agenda structure, and follow-up tracking." />
        <meta property="og:title" content="Free Meeting Notes Template - Professional Meeting Minutes" />
        <meta property="og:description" content="Download our free meeting notes template in PDF and DOCX formats. Perfect for professional meetings with action items and follow-up tracking." />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Meeting Notes Template",
              "description": "Free professional meeting notes template for download",
              "mainEntity": {
                "@type": "FAQPage",
                "mainEntity": faqData.map(faq => ({
                  "@type": "Question",
                  "name": faq.question,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": Array.isArray(faq.answerList)
                      ? faq.answerList.join("\n")
                      : Array.isArray(faq.answer)
                        ? faq.answer.join("\n")
                        : faq.answer
                  }
                }))
              }
            })
          }}
        />
      </Head>
      <style jsx global>{`
        [id^="meeting-notes-content-"] .mb-3 { page-break-inside: avoid; break-inside: avoid; }
        [id^="meeting-notes-content-"] h2 { page-break-after: avoid; }
      `}</style>

      <div className="min-h-screen bg-[#F3F4EF]">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Template Gallery */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Meeting Notes Templates Gallery</h1>
            <p className="text-lg text-gray-600 text-center mb-8">Choose from our professional meeting notes templates designed for different industries</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Office Team Template */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-3xl mr-3">🏢</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Office Team Meeting</h3>
                        <p className="text-sm text-gray-600">Team Meeting</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => generatePDFForTemplate('office')}
                        disabled={isGeneratingPDF}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingPDF ? 'Generating...' : 'PDF'}
                      </button>
                      <button
                        onClick={() => generateDOCXForTemplate('office')}
                        disabled={isGeneratingDOCX}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingDOCX ? 'Generating...' : 'DOCX'}
                      </button>
                    </div>
                  </div>
                  
                  <div id="meeting-notes-content-office" className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-sm">
                    {/* Document Header */}
                    <div className="text-center mb-4 pb-2 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Meeting Notes</h3>
                      <p className="text-xs text-gray-600">Professional Meeting Minutes</p>
                    </div>

                    {/* Meeting Details */}
                    <div className="mb-3">
                      <div className="grid grid-cols-1 gap-2 mb-2">
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Date:</span>
                          <span className="text-gray-600 text-xs">{todayFormatted}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Time:</span>
                          <span className="text-gray-600 text-xs">10:00 AM</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-14 text-xs">Location:</span>
                          <span className="text-gray-600 text-xs">Dunder Mifflin Scranton Conference Room</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Type:</span>
                          <span className="text-gray-600 text-xs">Team Meeting</span>
                        </div>
                      </div>
                    </div>

                    {/* Attendees */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Attendees
                      </h2>
                      <div className="space-y-1">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Michael Scott – Regional Manager</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Jim Halpert – Sales Representative</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Pam Beesly – Receptionist</span>
                        </div>
                        <div className="text-xs text-gray-500">+3 more</div>
                      </div>
                    </div>

                    {/* Agenda Items */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-2">
                        Agenda Items
                      </h2>
                      
                      {/* First Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-blue-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">1. Improving Office Morale</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Michael proposed an "Office Olympics" to boost morale.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Jim and Pam suggested simple games with items around the office.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on team building activities and workplace improvements.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Proceed with Office Olympics during lunch break.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Implement monthly team building activities.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Create list of games – Jim & Pam ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Schedule Office Olympics event – Michael ({dayAfterTomorrowFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Second Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-blue-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">2. Sales Performance & Customer Relations</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Q3 sales targets exceeded by 12%.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Customer satisfaction scores improved to 4.3/5.0.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on client retention strategies and new business opportunities.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Increase Q4 sales targets by 15%.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Implement weekly client check-in calls.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Update Q4 sales targets – Michael ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Create client check-in schedule – Jim ({threeDaysLaterFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Decisions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Key Decisions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">1.</span>
                          <span className="text-xs leading-4 align-middle">Office Olympics will take place during lunch.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">2.</span>
                          <span className="text-xs leading-4 align-middle">Q4 sales targets increased by 15%.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">3.</span>
                          <span className="text-xs leading-4 align-middle">Monthly team building activities implemented.</span>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Next Steps
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Create list of games for Office Olympics.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Schedule Office Olympics event.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Update Q4 sales targets.</span>
                        </div>
                      </div>
                    </div>

                    {/* Follow-up Actions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Follow-up Actions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Send meeting notes to all team members</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Schedule office team meeting for {nextWeekFormatted}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Update team goals and objectives</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-600">
                        <div>
                          <span className="font-semibold">Prepared by:</span> Pam Beesly
                        </div>
                        <div>
                          <span className="font-semibold">Date:</span> {todayFormatted}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tech Startup Template */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-3xl mr-3">🚀</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Product Development Sprint</h3>
                        <p className="text-sm text-gray-600">Sprint Planning</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => generatePDFForTemplate('startup')}
                        disabled={isGeneratingPDF}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingPDF ? 'Generating...' : 'PDF'}
                      </button>
                      <button
                        onClick={() => generateDOCXForTemplate('startup')}
                        disabled={isGeneratingDOCX}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingDOCX ? 'Generating...' : 'DOCX'}
                      </button>
                    </div>
                  </div>
                  
                  <div id="meeting-notes-content-startup" className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-sm">
                    {/* Document Header */}
                    <div className="text-center mb-4 pb-2 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Meeting Notes</h3>
                      <p className="text-xs text-gray-600">Professional Meeting Minutes</p>
                    </div>

                    {/* Meeting Details */}
                    <div className="mb-3">
                      <div className="grid grid-cols-1 gap-2 mb-2">
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Date:</span>
                          <span className="text-gray-600 text-xs">{todayFormatted}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Time:</span>
                          <span className="text-gray-600 text-xs">10:00 AM</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-14 text-xs">Location:</span>
                          <span className="text-gray-600 text-xs">TechHub Innovation Center</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Type:</span>
                          <span className="text-gray-600 text-xs">Sprint Planning</span>
                        </div>
                      </div>
                    </div>

                    {/* Attendees */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Attendees
                      </h2>
                      <div className="space-y-1">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Sarah Chen – Product Manager</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Alex Rodriguez – Lead Developer</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Emma Thompson – UX Designer</span>
                        </div>
                        <div className="text-xs text-gray-500">+3 more</div>
                      </div>
                    </div>

                    {/* Agenda Items */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-2">
                        Agenda Items
                      </h2>
                      
                      {/* First Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-purple-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">1. Mobile App Redesign</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Emma presented new wireframes for the mobile interface.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Alex raised concerns about development timeline.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on user feedback and market research findings.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Proceed with the new design system.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Extend development timeline by 2 weeks for quality assurance.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Finalize design mockups – Emma ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Create detailed technical specifications – Alex ({dayAfterTomorrowFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Second Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-purple-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">2. Product Roadmap & Feature Prioritization</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Review of current product roadmap and milestone progress.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on feature requests from user feedback.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Evaluation of competitive landscape and market opportunities.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Prioritize social sharing features for Q4 release.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Postpone advanced analytics to Q1 next year.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Update product roadmap with new priorities – Sarah ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Create feature specification for social sharing – Alex ({threeDaysLaterFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Decisions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Key Decisions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">1.</span>
                          <span className="text-xs leading-4 align-middle">Mobile app redesign will proceed with new design system.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">2.</span>
                          <span className="text-xs leading-4 align-middle">Social sharing features prioritized for Q4 release.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">3.</span>
                          <span className="text-xs leading-4 align-middle">Development timeline extended by 2 weeks for quality assurance.</span>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Next Steps
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Finalize design mockups.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Create detailed technical specifications.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Update product roadmap with new priorities.</span>
                        </div>
                      </div>
                    </div>

                    {/* Follow-up Actions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Follow-up Actions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Share meeting notes with development team</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Schedule sprint planning meeting for {nextWeekFormatted}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Update project management tools with new timeline</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-600">
                        <div>
                          <span className="font-semibold">Prepared by:</span> Sarah Chen
                        </div>
                        <div>
                          <span className="font-semibold">Date:</span> {todayFormatted}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Healthcare Template */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-3xl mr-3">🏥</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Patient Care Coordination</h3>
                        <p className="text-sm text-gray-600">Medical Team Meeting</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => generatePDFForTemplate('healthcare')}
                        disabled={isGeneratingPDF}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingPDF ? 'Generating...' : 'PDF'}
                      </button>
                      <button
                        onClick={() => generateDOCXForTemplate('healthcare')}
                        disabled={isGeneratingDOCX}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingDOCX ? 'Generating...' : 'DOCX'}
                      </button>
                    </div>
                  </div>
                  
                  <div id="meeting-notes-content-healthcare" className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-sm">
                    {/* Document Header */}
                    <div className="text-center mb-4 pb-2 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Meeting Notes</h3>
                      <p className="text-xs text-gray-600">Professional Meeting Minutes</p>
                    </div>

                    {/* Meeting Details */}
                    <div className="mb-3">
                      <div className="grid grid-cols-1 gap-2 mb-2">
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Date:</span>
                          <span className="text-gray-600 text-xs">{todayFormatted}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Time:</span>
                          <span className="text-gray-600 text-xs">10:00 AM</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-14 text-xs">Location:</span>
                          <span className="text-gray-600 text-xs">City General Hospital - Conference Room A</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Type:</span>
                          <span className="text-gray-600 text-xs">Medical Team Meeting</span>
                        </div>
                      </div>
                    </div>

                    {/* Attendees */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Attendees
                      </h2>
                      <div className="space-y-1">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Dr. Jennifer Martinez – Chief of Medicine</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Dr. Robert Wilson – Cardiologist</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Nurse Patricia Brown – Head Nurse</span>
                        </div>
                        <div className="text-xs text-gray-500">+3 more</div>
                      </div>
                    </div>

                    {/* Agenda Items */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-2">
                        Agenda Items
                      </h2>
                      
                      {/* First Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-red-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">1. Patient Safety Protocols</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Dr. Martinez reviewed recent safety incidents.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Nurse Brown highlighted staffing challenges during peak hours.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on emergency response procedures and training needs.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Implement mandatory safety briefings before each shift.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Update emergency response time targets to under 3 minutes.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Create safety briefing template – Nurse Brown ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Schedule emergency response training – Dr. Martinez ({dayAfterTomorrowFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Second Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-red-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">2. Staff Training & Development</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Review of current staff training programs and certification status.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on continuing education requirements and opportunities.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Evaluation of performance metrics and improvement areas.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Implement monthly training sessions for all clinical staff.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Establish peer mentoring program for new staff members.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Develop monthly training curriculum – Dr. Thompson ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Create peer mentoring guidelines – Nurse Brown ({threeDaysLaterFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Decisions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Key Decisions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">1.</span>
                          <span className="text-xs leading-4 align-middle">Mandatory safety briefings will be implemented before each shift.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">2.</span>
                          <span className="text-xs leading-4 align-middle">Emergency response time targets updated to under 3 minutes.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">3.</span>
                          <span className="text-xs leading-4 align-middle">Monthly training sessions and peer mentoring program approved.</span>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Next Steps
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Create safety briefing template.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Schedule emergency response training.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Develop monthly training curriculum.</span>
                        </div>
                      </div>
                    </div>

                    {/* Follow-up Actions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Follow-up Actions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Share meeting notes with all medical staff</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Schedule healthcare team meeting for {nextWeekFormatted}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Update medical protocols and training materials</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-600">
                        <div>
                          <span className="font-semibold">Prepared by:</span> Dr. Jennifer Martinez
                        </div>
                        <div>
                          <span className="font-semibold">Date:</span> {todayFormatted}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Template */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-3xl mr-3">🎓</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Faculty Development Meeting</h3>
                        <p className="text-sm text-gray-600">Academic Planning</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => generatePDFForTemplate('education')}
                        disabled={isGeneratingPDF}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingPDF ? 'Generating...' : 'PDF'}
                      </button>
                      <button
                        onClick={() => generateDOCXForTemplate('education')}
                        disabled={isGeneratingDOCX}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingDOCX ? 'Generating...' : 'DOCX'}
                      </button>
                    </div>
                  </div>
                  
                  <div id="meeting-notes-content-education" className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-sm">
                    {/* Document Header */}
                    <div className="text-center mb-4 pb-2 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Meeting Notes</h3>
                      <p className="text-xs text-gray-600">Professional Meeting Minutes</p>
                    </div>

                    {/* Meeting Details */}
                    <div className="mb-3">
                      <div className="grid grid-cols-1 gap-2 mb-2">
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Date:</span>
                          <span className="text-gray-600 text-xs">{todayFormatted}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Time:</span>
                          <span className="text-gray-600 text-xs">10:00 AM</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-14 text-xs">Location:</span>
                          <span className="text-gray-600 text-xs">University of Excellence - Faculty Lounge</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Type:</span>
                          <span className="text-gray-600 text-xs">Academic Planning</span>
                        </div>
                      </div>
                    </div>

                    {/* Attendees */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Attendees
                      </h2>
                      <div className="space-y-1">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Dr. Elizabeth Foster – Department Head</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Prof. James Mitchell – Computer Science</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Dr. Maria Santos – Mathematics</span>
                        </div>
                        <div className="text-xs text-gray-500">+3 more</div>
                      </div>
                    </div>

                    {/* Agenda Items */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-2">
                        Agenda Items
                      </h2>
                      
                      {/* First Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-indigo-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">1. Curriculum Modernization</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Dr. Foster presented industry feedback on current curriculum.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Prof. Mitchell emphasized the need for more practical programming courses.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on emerging technologies and industry trends.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Add new elective courses in AI and data science.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Update existing programming courses with modern frameworks.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Design new AI course syllabus – Prof. Mitchell ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Update programming course materials – Dr. Santos ({dayAfterTomorrowFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Second Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-indigo-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">2. Student Assessment & Learning Outcomes</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Review of current assessment methods and student performance metrics.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on learning outcome standards and accreditation requirements.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Evaluation of student feedback and course evaluation results.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Implement project-based assessments for practical courses.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Establish peer review system for student projects.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Create project-based assessment guidelines – Dr. Foster ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Develop peer review rubric – Prof. Mitchell ({threeDaysLaterFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Decisions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Key Decisions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">1.</span>
                          <span className="text-xs leading-4 align-middle">New AI and data science courses will be added to curriculum.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">2.</span>
                          <span className="text-xs leading-4 align-middle">Project-based assessments implemented for practical courses.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">3.</span>
                          <span className="text-xs leading-4 align-middle">Peer review system established for student projects.</span>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Next Steps
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Design new AI course syllabus.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Update programming course materials.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Create project-based assessment guidelines.</span>
                        </div>
                      </div>
                    </div>

                    {/* Follow-up Actions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Follow-up Actions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Share meeting notes with all faculty members</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Schedule education team meeting for {nextWeekFormatted}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Update academic calendar and course catalog</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-600">
                        <div>
                          <span className="font-semibold">Prepared by:</span> Dr. Elizabeth Foster
                        </div>
                        <div>
                          <span className="font-semibold">Date:</span> {todayFormatted}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Board Meeting Template */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-3xl mr-3">🏛️</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Board Meeting Notes</h3>
                        <p className="text-sm text-gray-600">Strategic Governance</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => generatePDFForTemplate('board')}
                        disabled={isGeneratingPDF}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingPDF ? 'Generating...' : 'PDF'}
                      </button>
                      <button
                        onClick={() => generateDOCXForTemplate('board')}
                        disabled={isGeneratingDOCX}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingDOCX ? 'Generating...' : 'DOCX'}
                      </button>
                    </div>
                  </div>
                  
                  <div id="meeting-notes-content-board" className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-sm">
                    {/* Document Header */}
                    <div className="text-center mb-4 pb-2 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Meeting Notes</h3>
                      <p className="text-xs text-gray-600">Professional Meeting Minutes</p>
                    </div>

                    {/* Meeting Details */}
                    <div className="mb-3">
                      <div className="grid grid-cols-1 gap-2 mb-2">
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Date:</span>
                          <span className="text-gray-600 text-xs">{todayFormatted}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Time:</span>
                          <span className="text-gray-600 text-xs">2:00 PM</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-14 text-xs">Location:</span>
                          <span className="text-gray-600 text-xs">Corporate Headquarters - Boardroom</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Type:</span>
                          <span className="text-gray-600 text-xs">Board Meeting</span>
                        </div>
                      </div>
                    </div>

                    {/* Attendees */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Attendees
                      </h2>
                      <div className="space-y-1">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Margaret Thompson – Board Chair</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">David Chen – CEO</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Sarah Williams – CFO</span>
                        </div>
                        <div className="text-xs text-gray-500">+5 more</div>
                      </div>
                    </div>

                    {/* Agenda Items */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-2">
                        Agenda Items
                      </h2>
                      
                      {/* First Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-yellow-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">1. Financial Reports & Performance</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Q3 revenue exceeded projections by 8%.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Operating margins improved to 15.2%.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on Q4 budget allocation for strategic initiatives.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Approve Q4 budget allocation for strategic initiatives.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Proceed with European market expansion.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Present detailed Q4 budget proposal – Sarah Williams ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Develop European market entry strategy – David Chen ({dayAfterTomorrowFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Second Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-yellow-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">2. Strategic Initiatives & Governance</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Review of governance policies for remote work.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on board composition and succession planning.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Evaluation of risk management frameworks.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Update governance policies for remote work.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Appoint new board member by end of quarter.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Update governance policy documents – Margaret Thompson ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Initiate board member search process – Robert Kim ({threeDaysLaterFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Decisions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Key Decisions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">1.</span>
                          <span className="text-xs leading-4 align-middle">Approved expansion into European markets.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">2.</span>
                          <span className="text-xs leading-4 align-middle">Updated governance policies for remote work.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">3.</span>
                          <span className="text-xs leading-4 align-middle">Q4 budget allocation approved for strategic initiatives.</span>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Next Steps
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Present detailed Q4 budget proposal.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Develop European market entry strategy.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Update governance policy documents.</span>
                        </div>
                      </div>
                    </div>

                    {/* Follow-up Actions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Follow-up Actions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Distribute meeting minutes to all board members</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Schedule next board meeting for {nextWeekFormatted}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Update corporate governance documents</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-600">
                        <div>
                          <span className="font-semibold">Prepared by:</span> Margaret Thompson
                        </div>
                        <div>
                          <span className="font-semibold">Date:</span> {todayFormatted}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sales Meeting Template */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-3xl mr-3">💰</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Sales Meeting Notes</h3>
                        <p className="text-sm text-gray-600">Sales Team Meeting</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => generatePDFForTemplate('sales')}
                        disabled={isGeneratingPDF}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingPDF ? 'Generating...' : 'PDF'}
                      </button>
                      <button
                        onClick={() => generateDOCXForTemplate('sales')}
                        disabled={isGeneratingDOCX}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingDOCX ? 'Generating...' : 'DOCX'}
                      </button>
                    </div>
                  </div>
                  
                  <div id="meeting-notes-content-sales" className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-sm">
                    {/* Document Header */}
                    <div className="text-center mb-4 pb-2 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Meeting Notes</h3>
                      <p className="text-xs text-gray-600">Professional Meeting Minutes</p>
                    </div>

                    {/* Meeting Details */}
                    <div className="mb-3">
                      <div className="grid grid-cols-1 gap-2 mb-2">
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Date:</span>
                          <span className="text-gray-600 text-xs">{todayFormatted}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Time:</span>
                          <span className="text-gray-600 text-xs">9:00 AM</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-14 text-xs">Location:</span>
                          <span className="text-gray-600 text-xs">Sales Office - Conference Room</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Type:</span>
                          <span className="text-gray-600 text-xs">Sales Meeting</span>
                        </div>
                      </div>
                    </div>

                    {/* Attendees */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Attendees
                      </h2>
                      <div className="space-y-1">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">John Martinez – Sales Director</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Lisa Chen – Account Manager</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Mike Johnson – Business Development</span>
                        </div>
                        <div className="text-xs text-gray-500">+4 more</div>
                      </div>
                    </div>

                    {/* Agenda Items */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-2">
                        Agenda Items
                      </h2>
                      
                      {/* First Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-green-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">1. Sales KPIs & Pipeline Review</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Monthly target: $500K, achieved: $520K (104%).</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Pipeline value increased by 15% this quarter.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on Q4 targets and client feedback.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Increase Q4 targets by 10% based on strong performance.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Implement new client onboarding process.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Update CRM with new Q4 targets – John Martinez ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Streamline client onboarding process – Lisa Chen ({dayAfterTomorrowFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Second Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-green-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">2. Client Feedback & Opportunities</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Client satisfaction scores improved to 4.5/5.0.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">New opportunities in healthcare and technology sectors.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on competitive positioning and pricing.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Focus sales efforts on healthcare and technology sectors.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Update pricing strategy for premium services.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Develop healthcare sector sales strategy – Mike Johnson ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Review and update pricing models – John Martinez ({threeDaysLaterFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Decisions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Key Decisions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">1.</span>
                          <span className="text-xs leading-4 align-middle">Q4 sales targets increased to $550K monthly.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">2.</span>
                          <span className="text-xs leading-4 align-middle">New client onboarding process streamlined.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">3.</span>
                          <span className="text-xs leading-4 align-middle">Focus sales efforts on healthcare and technology sectors.</span>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Next Steps
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Update CRM with new Q4 targets.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Streamline client onboarding process.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Develop healthcare sector sales strategy.</span>
                        </div>
                      </div>
                    </div>

                    {/* Follow-up Actions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Follow-up Actions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Send meeting notes to all sales team members</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Schedule sales review meeting for {nextWeekFormatted}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Update CRM with new targets and processes</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-600">
                        <div>
                          <span className="font-semibold">Prepared by:</span> John Martinez
                        </div>
                        <div>
                          <span className="font-semibold">Date:</span> {todayFormatted}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Marketing Strategy Template */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-3xl mr-3">📊</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Marketing Strategy Meeting</h3>
                        <p className="text-sm text-gray-600">Campaign Planning</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => generatePDFForTemplate('marketing')}
                        disabled={isGeneratingPDF}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingPDF ? 'Generating...' : 'PDF'}
                      </button>
                      <button
                        onClick={() => generateDOCXForTemplate('marketing')}
                        disabled={isGeneratingDOCX}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingDOCX ? 'Generating...' : 'DOCX'}
                      </button>
                    </div>
                  </div>
                  
                  <div id="meeting-notes-content-marketing" className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-sm">
                    {/* Document Header */}
                    <div className="text-center mb-4 pb-2 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Meeting Notes</h3>
                      <p className="text-xs text-gray-600">Professional Meeting Minutes</p>
                    </div>

                    {/* Meeting Details */}
                    <div className="mb-3">
                      <div className="grid grid-cols-1 gap-2 mb-2">
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Date:</span>
                          <span className="text-gray-600 text-xs">{todayFormatted}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Time:</span>
                          <span className="text-gray-600 text-xs">11:00 AM</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-14 text-xs">Location:</span>
                          <span className="text-gray-600 text-xs">Marketing Department - Creative Room</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Type:</span>
                          <span className="text-gray-600 text-xs">Campaign Planning</span>
                        </div>
                      </div>
                    </div>

                    {/* Attendees */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Attendees
                      </h2>
                      <div className="space-y-1">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Amanda Foster – Marketing Director</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Tom Wilson – Creative Lead</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Rachel Davis – Digital Marketing</span>
                        </div>
                        <div className="text-xs text-gray-500">+3 more</div>
                      </div>
                    </div>

                    {/* Agenda Items */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-2">
                        Agenda Items
                      </h2>
                      
                      {/* First Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-pink-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">1. Q4 Campaign Strategy</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Holiday campaign theme: "Innovation for Everyone".</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Social media engagement up 25% from last quarter.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on budget allocation and KPI targets.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Allocate 40% of budget to digital channels.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Set KPI targets: 30% increase in brand awareness.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Create campaign content calendar – Tom Wilson ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Set up tracking for brand awareness metrics – Rachel Davis ({dayAfterTomorrowFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Second Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-pink-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">2. Content Calendar & Campaign Planning</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Blog post schedule: 3 posts per week maintained.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Video content performance exceeded expectations.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on influencer partnerships and collaborations.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Launch Black Friday content series starting November 15th.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Partner with 5 key influencers for Q4 campaigns.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Create Black Friday content assets – Sarah Lee ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Identify and contact potential influencers – Marcus Johnson ({threeDaysLaterFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Decisions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Key Decisions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">1.</span>
                          <span className="text-xs leading-4 align-middle">Q4 campaign budget: $200K with 40% digital allocation.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">2.</span>
                          <span className="text-xs leading-4 align-middle">KPI targets: 30% increase in brand awareness.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">3.</span>
                          <span className="text-xs leading-4 align-middle">Black Friday content series approved for November 15th launch.</span>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Next Steps
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Create campaign content calendar.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Set up tracking for brand awareness metrics.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Launch Black Friday content series.</span>
                        </div>
                      </div>
                    </div>

                    {/* Follow-up Actions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Follow-up Actions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Share meeting notes with marketing team</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Schedule campaign review for {nextWeekFormatted}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Update marketing calendar with new initiatives</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-600">
                        <div>
                          <span className="font-semibold">Prepared by:</span> Amanda Foster
                        </div>
                        <div>
                          <span className="font-semibold">Date:</span> {todayFormatted}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* HR Team Template */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-3xl mr-3">👥</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">HR Team Meeting</h3>
                        <p className="text-sm text-gray-600">Human Resources</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => generatePDFForTemplate('hr')}
                        disabled={isGeneratingPDF}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingPDF ? 'Generating...' : 'PDF'}
                      </button>
                      <button
                        onClick={() => generateDOCXForTemplate('hr')}
                        disabled={isGeneratingDOCX}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingDOCX ? 'Generating...' : 'DOCX'}
                      </button>
                    </div>
                  </div>
                  
                  <div id="meeting-notes-content-hr" className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-sm">
                    {/* Document Header */}
                    <div className="text-center mb-4 pb-2 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Meeting Notes</h3>
                      <p className="text-xs text-gray-600">Professional Meeting Minutes</p>
                    </div>

                    {/* Meeting Details */}
                    <div className="mb-3">
                      <div className="grid grid-cols-1 gap-2 mb-2">
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Date:</span>
                          <span className="text-gray-600 text-xs">{todayFormatted}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Time:</span>
                          <span className="text-gray-600 text-xs">3:00 PM</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-14 text-xs">Location:</span>
                          <span className="text-gray-600 text-xs">HR Department - Meeting Room</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Type:</span>
                          <span className="text-gray-600 text-xs">HR Team Meeting</span>
                        </div>
                      </div>
                    </div>

                    {/* Attendees */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Attendees
                      </h2>
                      <div className="space-y-1">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Jennifer Adams – HR Director</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Mark Thompson – Recruitment Manager</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Lisa Park – Employee Relations</span>
                        </div>
                        <div className="text-xs text-gray-500">+2 more</div>
                      </div>
                    </div>

                    {/* Agenda Items */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-2">
                        Agenda Items
                      </h2>
                      
                      {/* First Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-orange-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">1. Recruitment & Employee Engagement</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">12 new hires completed onboarding this month.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Employee satisfaction score: 4.2/5.0 (up from 3.8).</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on flexible work policies and benefits.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Implement flexible work policy for all departments.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Launch new performance review process in Q1.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Draft flexible work policy document – Lisa Park ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Design new performance review process – Jennifer Adams ({dayAfterTomorrowFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Second Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-orange-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">2. HR Policies & Workplace Culture</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Review of current HR policies and procedures.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on diversity and inclusion initiatives.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Evaluation of employee development programs.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Update diversity and inclusion policies.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Implement new employee development program.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Review and update diversity policies – Mark Thompson ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Design employee development curriculum – Lisa Park ({threeDaysLaterFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Decisions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Key Decisions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">1.</span>
                          <span className="text-xs leading-4 align-middle">Flexible work policy approved for implementation.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">2.</span>
                          <span className="text-xs leading-4 align-middle">New performance review process to be launched Q1.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">3.</span>
                          <span className="text-xs leading-4 align-middle">Diversity and inclusion policies updated.</span>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Next Steps
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Draft flexible work policy document.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Design new performance review process.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Review and update diversity policies.</span>
                        </div>
                      </div>
                    </div>

                    {/* Follow-up Actions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Follow-up Actions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Distribute meeting notes to all HR staff</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Schedule HR policy review for {nextWeekFormatted}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Update employee handbook with new policies</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-600">
                        <div>
                          <span className="font-semibold">Prepared by:</span> Jennifer Adams
                        </div>
                        <div>
                          <span className="font-semibold">Date:</span> {todayFormatted}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Executive Team Template */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-3xl mr-3">🎯</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Executive Team Meeting</h3>
                        <p className="text-sm text-gray-600">Strategic Leadership</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => generatePDFForTemplate('executive')}
                        disabled={isGeneratingPDF}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingPDF ? 'Generating...' : 'PDF'}
                      </button>
                      <button
                        onClick={() => generateDOCXForTemplate('executive')}
                        disabled={isGeneratingDOCX}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingDOCX ? 'Generating...' : 'DOCX'}
                      </button>
                    </div>
                  </div>
                  
                  <div id="meeting-notes-content-executive" className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-sm">
                    {/* Document Header */}
                    <div className="text-center mb-4 pb-2 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Meeting Notes</h3>
                      <p className="text-xs text-gray-600">Professional Meeting Minutes</p>
                    </div>

                    {/* Meeting Details */}
                    <div className="mb-3">
                      <div className="grid grid-cols-1 gap-2 mb-2">
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Date:</span>
                          <span className="text-gray-600 text-xs">{todayFormatted}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Time:</span>
                          <span className="text-gray-600 text-xs">1:00 PM</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-14 text-xs">Location:</span>
                          <span className="text-gray-600 text-xs">Executive Conference Room</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Type:</span>
                          <span className="text-gray-600 text-xs">Executive Meeting</span>
                        </div>
                      </div>
                    </div>

                    {/* Attendees */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Attendees
                      </h2>
                      <div className="space-y-1">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Robert Kim – CEO</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Susan Rodriguez – COO</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Michael Chang – CTO</span>
                        </div>
                        <div className="text-xs text-gray-500">+4 more</div>
                      </div>
                    </div>

                    {/* Agenda Items */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-2">
                        Agenda Items
                      </h2>
                      
                      {/* First Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-purple-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">1. Quarterly Goals & Strategic Initiatives</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Q3 revenue target achieved at 105%.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Market expansion into Asia-Pacific region on track.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on Q4 growth targets and resource allocation.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Accelerate Q4 growth targets by 15%.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Increase investment in Asia-Pacific market expansion.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Develop Asia-Pacific market entry strategy – Susan Rodriguez ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Update Q4 budget for growth initiatives – Jennifer Adams ({dayAfterTomorrowFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Second Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-purple-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">2. Cross-department Updates & Risk Assessment</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Review of cross-department collaboration initiatives.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on emerging risks and mitigation strategies.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Evaluation of technology infrastructure investments.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Implement new cross-department communication system.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Update risk assessment framework for international expansion.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Install new communication platform – Michael Chang ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Conduct comprehensive risk assessment – Robert Kim ({threeDaysLaterFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Decisions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Key Decisions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">1.</span>
                          <span className="text-xs leading-4 align-middle">Q4 growth targets increased to $2.5M revenue.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">2.</span>
                          <span className="text-xs leading-4 align-middle">Risk assessment framework updated for international expansion.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">3.</span>
                          <span className="text-xs leading-4 align-middle">Asia-Pacific market entry strategy approved.</span>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Next Steps
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Develop Asia-Pacific market entry strategy.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Update Q4 budget for growth initiatives.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Install new communication platform.</span>
                        </div>
                      </div>
                    </div>

                    {/* Follow-up Actions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Follow-up Actions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Share meeting notes with all executives</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Schedule executive strategy session for {nextWeekFormatted}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Update corporate strategy documents</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-600">
                        <div>
                          <span className="font-semibold">Prepared by:</span> Robert Kim
                        </div>
                        <div>
                          <span className="font-semibold">Date:</span> {todayFormatted}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Design Review Template */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-3xl mr-3">🎨</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Design Review Meeting</h3>
                        <p className="text-sm text-gray-600">Design Feedback & Approval</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => generatePDFForTemplate('design')}
                        disabled={isGeneratingPDF}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingPDF ? 'Generating...' : 'PDF'}
                      </button>
                      <button
                        onClick={() => generateDOCXForTemplate('design')}
                        disabled={isGeneratingDOCX}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingDOCX ? 'Generating...' : 'DOCX'}
                      </button>
                    </div>
                  </div>
                  
                  <div id="meeting-notes-content-design" className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-sm">
                    {/* Document Header */}
                    <div className="text-center mb-4 pb-2 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Meeting Notes</h3>
                      <p className="text-xs text-gray-600">Professional Meeting Minutes</p>
                    </div>

                    {/* Meeting Details */}
                    <div className="mb-3">
                      <div className="grid grid-cols-1 gap-2 mb-2">
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Date:</span>
                          <span className="text-gray-600 text-xs">{todayFormatted}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Time:</span>
                          <span className="text-gray-600 text-xs">2:30 PM</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-14 text-xs">Location:</span>
                          <span className="text-gray-600 text-xs">Design Studio - Review Room</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Type:</span>
                          <span className="text-gray-600 text-xs">Design Review</span>
                        </div>
                      </div>
                    </div>

                    {/* Attendees */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Attendees
                      </h2>
                      <div className="space-y-1">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Sophie Chen – Lead Designer</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Alex Rivera – Product Manager</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Jordan Kim – UX Designer</span>
                        </div>
                        <div className="text-xs text-gray-500">+3 more</div>
                      </div>
                    </div>

                    {/* Agenda Items */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-2">
                        Agenda Items
                      </h2>
                      
                      {/* First Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-indigo-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">1. Mobile App Wireframes Review</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Sophie presented updated wireframes for onboarding flow.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Alex requested simplification of step 3 in user journey.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on user testing and feedback integration.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Approve wireframes with modifications to step 3.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Schedule user testing session for next week.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Revise step 3 wireframes – Sophie Chen ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Prepare user testing scenarios – Jordan Kim ({dayAfterTomorrowFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Second Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-indigo-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">2. Design System & Brand Guidelines</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Review of current design system consistency.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on brand guideline updates and color schemes.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Evaluation of accessibility standards compliance.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Update color scheme to match brand guidelines.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Implement enhanced accessibility standards.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Update design system color palette – Emma Wilson ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Audit designs for accessibility compliance – Tom Rodriguez ({threeDaysLaterFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Decisions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Key Decisions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">1.</span>
                          <span className="text-xs leading-4 align-middle">Mobile app wireframes approved with step 3 modifications.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">2.</span>
                          <span className="text-xs leading-4 align-middle">Color scheme updated to match brand guidelines.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">3.</span>
                          <span className="text-xs leading-4 align-middle">Enhanced accessibility standards implemented.</span>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Next Steps
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Revise step 3 wireframes.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Prepare user testing scenarios.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Update design system color palette.</span>
                        </div>
                      </div>
                    </div>

                    {/* Follow-up Actions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Follow-up Actions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Send meeting notes to design team</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Schedule design review for {nextWeekFormatted}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Update design system documentation</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-600">
                        <div>
                          <span className="font-semibold">Prepared by:</span> Sophie Chen
                        </div>
                        <div>
                          <span className="font-semibold">Date:</span> {todayFormatted}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Planning Template */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-3xl mr-3">📝</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Content Planning Meeting</h3>
                        <p className="text-sm text-gray-600">Content Strategy</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => generatePDFForTemplate('content')}
                        disabled={isGeneratingPDF}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingPDF ? 'Generating...' : 'PDF'}
                      </button>
                      <button
                        onClick={() => generateDOCXForTemplate('content')}
                        disabled={isGeneratingDOCX}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingDOCX ? 'Generating...' : 'DOCX'}
                      </button>
                    </div>
                  </div>
                  
                  <div id="meeting-notes-content-content" className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-sm">
                    {/* Document Header */}
                    <div className="text-center mb-4 pb-2 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Meeting Notes</h3>
                      <p className="text-xs text-gray-600">Professional Meeting Minutes</p>
                    </div>

                    {/* Meeting Details */}
                    <div className="mb-3">
                      <div className="grid grid-cols-1 gap-2 mb-2">
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Date:</span>
                          <span className="text-gray-600 text-xs">{todayFormatted}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Time:</span>
                          <span className="text-gray-600 text-xs">10:30 AM</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-14 text-xs">Location:</span>
                          <span className="text-gray-600 text-xs">Content Studio - Planning Room</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Type:</span>
                          <span className="text-gray-600 text-xs">Content Planning</span>
                        </div>
                      </div>
                    </div>

                    {/* Attendees */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Attendees
                      </h2>
                      <div className="space-y-1">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Emma Wilson – Content Director</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Marcus Johnson – Social Media Manager</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Sarah Lee – Blog Writer</span>
                        </div>
                        <div className="text-xs text-gray-500">+2 more</div>
                      </div>
                    </div>

                    {/* Agenda Items */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-2">
                        Agenda Items
                      </h2>
                      
                      {/* First Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-teal-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">1. Q4 Content Calendar Planning</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Holiday campaign content themes finalized.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Blog post schedule: 3 posts per week maintained.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on video content strategy and social media.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Launch Black Friday content series starting November 15th.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Increase social media posting frequency to 2x daily.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Create Black Friday content assets – Sarah Lee ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Develop social media content calendar – Marcus Johnson ({dayAfterTomorrowFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Second Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-teal-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">2. Content Performance & Strategy</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Blog engagement increased by 35% this quarter.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Video content performance exceeded expectations.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on SEO optimization and content distribution.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Implement new SEO content strategy.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Expand video content production by 50%.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Develop SEO content guidelines – Tom Rodriguez ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Plan video content production schedule – Lisa Park ({threeDaysLaterFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Decisions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Key Decisions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">1.</span>
                          <span className="text-xs leading-4 align-middle">Q4 content calendar approved with Black Friday series.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">2.</span>
                          <span className="text-xs leading-4 align-middle">Social media posting frequency increased to 2x daily.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">3.</span>
                          <span className="text-xs leading-4 align-middle">New SEO content strategy implemented.</span>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Next Steps
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Create Black Friday content assets.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Develop social media content calendar.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Develop SEO content guidelines.</span>
                        </div>
                      </div>
                    </div>

                    {/* Follow-up Actions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Follow-up Actions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Share meeting notes with content team</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Schedule content planning session for {nextWeekFormatted}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Update content calendar with new schedule</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-600">
                        <div>
                          <span className="font-semibold">Prepared by:</span> Emma Wilson
                        </div>
                        <div>
                          <span className="font-semibold">Date:</span> {todayFormatted}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Care Coordination Template */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-3xl mr-3">🏥</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Patient Care Coordination</h3>
                        <p className="text-sm text-gray-600">Care Planning & Safety</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => generatePDFForTemplate('patientcare')}
                        disabled={isGeneratingPDF}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingPDF ? 'Generating...' : 'PDF'}
                      </button>
                      <button
                        onClick={() => generateDOCXForTemplate('patientcare')}
                        disabled={isGeneratingDOCX}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingDOCX ? 'Generating...' : 'DOCX'}
                      </button>
                    </div>
                  </div>
                  
                  <div id="meeting-notes-content-patientcare" className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-sm">
                    {/* Document Header */}
                    <div className="text-center mb-4 pb-2 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Meeting Notes</h3>
                      <p className="text-xs text-gray-600">Professional Meeting Minutes</p>
                    </div>

                    {/* Meeting Details */}
                    <div className="mb-3">
                      <div className="grid grid-cols-1 gap-2 mb-2">
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Date:</span>
                          <span className="text-gray-600 text-xs">{todayFormatted}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Time:</span>
                          <span className="text-gray-600 text-xs">7:00 AM</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-14 text-xs">Location:</span>
                          <span className="text-gray-600 text-xs">City Medical Center - ICU Conference Room</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Type:</span>
                          <span className="text-gray-600 text-xs">Care Coordination</span>
                        </div>
                      </div>
                    </div>

                    {/* Attendees */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Attendees
                      </h2>
                      <div className="space-y-1">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Dr. Maria Rodriguez – Chief of Staff</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Nurse Jennifer Park – Charge Nurse</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Dr. Thomas Lee – ICU Director</span>
                        </div>
                        <div className="text-xs text-gray-500">+4 more</div>
                      </div>
                    </div>

                    {/* Agenda Items */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-2">
                        Agenda Items
                      </h2>
                      
                      {/* First Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-red-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">1. Patient Safety Protocols & Shift Handovers</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">ICU occupancy at 85% - within safe limits.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Night shift reported 3 critical patients requiring close monitoring.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on shift handover procedures and patient safety protocols.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Implement enhanced monitoring protocol for high-risk patients.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Standardize shift handover procedures across all units.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Update patient care plans for critical cases – Dr. Lee ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Create standardized handover checklist – Nurse Park ({dayAfterTomorrowFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Second Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-red-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">2. Care Coordination & Family Communication</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Review of family communication protocols and patient updates.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on interdisciplinary team coordination and care planning.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Evaluation of discharge planning and transition care processes.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Implement daily family update schedule for critical patients.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Enhance discharge planning coordination with social services.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Develop family communication schedule – Dr. Rodriguez ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Coordinate with social services for discharge planning – Nurse Park ({threeDaysLaterFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Decisions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Key Decisions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">1.</span>
                          <span className="text-xs leading-4 align-middle">Enhanced monitoring protocol approved for high-risk patients.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">2.</span>
                          <span className="text-xs leading-4 align-middle">Standardized shift handover procedures implemented.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">3.</span>
                          <span className="text-xs leading-4 align-middle">Daily family update schedule implemented for critical patients.</span>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Next Steps
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Update patient care plans for critical cases.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Create standardized handover checklist.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Develop family communication schedule.</span>
                        </div>
                      </div>
                    </div>

                    {/* Follow-up Actions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Follow-up Actions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Share meeting notes with all care coordination staff</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Schedule patient care coordination meeting for {nextWeekFormatted}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Update patient care protocols and documentation</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-600">
                        <div>
                          <span className="font-semibold">Prepared by:</span> Dr. Maria Rodriguez
                        </div>
                        <div>
                          <span className="font-semibold">Date:</span> {todayFormatted}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Staff Template */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-3xl mr-3">👨‍⚕️</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Medical Staff Meeting</h3>
                        <p className="text-sm text-gray-600">Clinical Staff Updates</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => generatePDFForTemplate('medical')}
                        disabled={isGeneratingPDF}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingPDF ? 'Generating...' : 'PDF'}
                      </button>
                      <button
                        onClick={() => generateDOCXForTemplate('medical')}
                        disabled={isGeneratingDOCX}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingDOCX ? 'Generating...' : 'DOCX'}
                      </button>
                    </div>
                  </div>
                  
                  <div id="meeting-notes-content-medical" className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-sm">
                    {/* Document Header */}
                    <div className="text-center mb-4 pb-2 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Meeting Notes</h3>
                      <p className="text-xs text-gray-600">Professional Meeting Minutes</p>
                    </div>

                    {/* Meeting Details */}
                    <div className="mb-3">
                      <div className="grid grid-cols-1 gap-2 mb-2">
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Date:</span>
                          <span className="text-gray-600 text-xs">{todayFormatted}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Time:</span>
                          <span className="text-gray-600 text-xs">6:30 PM</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-14 text-xs">Location:</span>
                          <span className="text-gray-600 text-xs">Medical Center - Staff Lounge</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Type:</span>
                          <span className="text-gray-600 text-xs">Medical Staff Meeting</span>
                        </div>
                      </div>
                    </div>

                    {/* Attendees */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Attendees
                      </h2>
                      <div className="space-y-1">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Dr. Patricia Kim – Department Head</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Dr. James Martinez – Senior Resident</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Nurse Amy Chen – Staff Nurse</span>
                        </div>
                        <div className="text-xs text-gray-500">+5 more</div>
                      </div>
                    </div>

                    {/* Agenda Items */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-2">
                        Agenda Items
                      </h2>
                      
                      {/* First Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-blue-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">1. Patient Updates & Staffing Challenges</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Patient census: 45 patients, 3 in critical condition.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Staffing shortage in emergency department for weekend shifts.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on safety protocols and training needs.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Implement mandatory safety briefing before each shift.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Approve temporary staffing solutions for weekend coverage.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Recruit temporary staff for weekend coverage – Dr. Kim ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Create safety briefing template – Nurse Chen ({dayAfterTomorrowFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Second Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-blue-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">2. Clinical Protocols & Training</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Review of recent clinical incidents and near misses.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on staff training and certification updates.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Evaluation of emergency response procedures.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Update emergency response procedures.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Schedule mandatory training for all clinical staff.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Update emergency response protocols – Dr. Martinez ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Schedule clinical training sessions – Dr. Wilson ({threeDaysLaterFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Decisions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Key Decisions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">1.</span>
                          <span className="text-xs leading-4 align-middle">Mandatory safety briefings implemented for all shifts.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">2.</span>
                          <span className="text-xs leading-4 align-middle">Temporary staffing solutions approved for weekend coverage.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">3.</span>
                          <span className="text-xs leading-4 align-middle">Emergency response procedures updated.</span>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Next Steps
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Recruit temporary staff for weekend coverage.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Create safety briefing template.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Update emergency response protocols.</span>
                        </div>
                      </div>
                    </div>

                    {/* Follow-up Actions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Follow-up Actions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Share meeting notes with all clinical staff</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Schedule medical staff meeting for {nextWeekFormatted}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Update clinical protocols and training materials</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-600">
                        <div>
                          <span className="font-semibold">Prepared by:</span> Dr. Patricia Kim
                        </div>
                        <div>
                          <span className="font-semibold">Date:</span> {todayFormatted}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinical Research Template */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-3xl mr-3">🔬</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Clinical Research Meeting</h3>
                        <p className="text-sm text-gray-600">Research & Protocol Updates</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => generatePDFForTemplate('research')}
                        disabled={isGeneratingPDF}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingPDF ? 'Generating...' : 'PDF'}
                      </button>
                      <button
                        onClick={() => generateDOCXForTemplate('research')}
                        disabled={isGeneratingDOCX}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingDOCX ? 'Generating...' : 'DOCX'}
                      </button>
                    </div>
                  </div>
                  
                  <div id="meeting-notes-content-research" className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-sm">
                    {/* Document Header */}
                    <div className="text-center mb-4 pb-2 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Meeting Notes</h3>
                      <p className="text-xs text-gray-600">Professional Meeting Minutes</p>
                    </div>

                    {/* Meeting Details */}
                    <div className="mb-3">
                      <div className="grid grid-cols-1 gap-2 mb-2">
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Date:</span>
                          <span className="text-gray-600 text-xs">{todayFormatted}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Time:</span>
                          <span className="text-gray-600 text-xs">4:00 PM</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-14 text-xs">Location:</span>
                          <span className="text-gray-600 text-xs">Research Institute - Conference Room</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold text-gray-700 w-9 text-xs">Type:</span>
                          <span className="text-gray-600 text-xs">Clinical Research</span>
                        </div>
                      </div>
                    </div>

                    {/* Attendees */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Attendees
                      </h2>
                      <div className="space-y-1">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Dr. Sarah Thompson – Principal Investigator</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Dr. Michael Chen – Research Coordinator</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-gray-600 text-xs leading-4 align-middle">Lisa Rodriguez – Data Analyst</span>
                        </div>
                        <div className="text-xs text-gray-500">+3 more</div>
                      </div>
                    </div>

                    {/* Agenda Items */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-2">
                        Agenda Items
                      </h2>
                      
                      {/* First Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-green-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">1. Study Updates & Experimental Results</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Phase II trial enrollment: 85% complete (102/120 participants).</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Preliminary results show 73% positive response rate.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on data quality and statistical analysis progress.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Proceed with Phase III protocol submission to FDA.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Extend data collection timeline by 30 days for complete enrollment.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Prepare FDA submission documents – Dr. Chen ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Complete statistical analysis report – Dr. Thompson ({dayAfterTomorrowFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Second Agenda Item */}
                      <div className="mb-4 p-2 bg-gray-50 rounded border-l-2 border-green-500">
                        <h3 className="text-xs font-semibold text-gray-900 mb-1">2. Research Protocol & Regulatory Compliance</h3>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Discussion:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Review of current research protocols and compliance status.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Discussion on regulatory requirements and documentation updates.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Evaluation of research ethics and participant safety protocols.</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Decisions:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Update research protocols to meet new FDA guidelines.</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                              <span className="text-xs leading-4 align-middle">Implement enhanced participant safety monitoring procedures.</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Action Items:</h4>
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Revise research protocols for FDA compliance – Dr. Martinez ({tomorrowFormatted})
                              </span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                              <span className="text-xs text-gray-600 leading-4 align-middle">
                                Update participant safety monitoring procedures – Dr. Wilson ({threeDaysLaterFormatted})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Decisions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Key Decisions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">1.</span>
                          <span className="text-xs leading-4 align-middle">Phase III protocol submission approved for FDA review.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">2.</span>
                          <span className="text-xs leading-4 align-middle">Data collection timeline extended by 30 days for complete enrollment.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-700 font-semibold leading-none text-xs">3.</span>
                          <span className="text-xs leading-4 align-middle">Research protocols updated to meet new FDA guidelines.</span>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Next Steps
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Prepare FDA submission documents.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Complete statistical analysis report.</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">•</span>
                          <span className="text-xs leading-4 align-middle">Revise research protocols for FDA compliance.</span>
                        </div>
                      </div>
                    </div>

                    {/* Follow-up Actions */}
                    <div className="mb-3">
                      <h2 className="text-sm font-semibold text-gray-900 mb-1">
                        Follow-up Actions
                      </h2>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Share meeting notes with research team</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Schedule clinical research meeting for {nextWeekFormatted}</span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="mr-1 text-gray-400 text-sm leading-none">☐</span>
                          <span className="text-xs leading-4 align-middle">Update research documentation and protocols</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-600">
                        <div>
                          <span className="font-semibold">Prepared by:</span> Dr. Sarah Thompson
                        </div>
                        <div>
                          <span className="font-semibold">Date:</span> {todayFormatted}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                    {Array.isArray(faq.answerList) ? (
                      <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        {faq.answerList.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    ) : Array.isArray(faq.answer) ? (
                      <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        {faq.answer.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Templates */}
          {/* <div className="mt-8 bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Related Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/templates/meeting-minutes-template" className="text-blue-600 hover:text-blue-800 underline">
                  Meeting Minutes Template
                </Link>
                <Link href="/templates/conference-minutes-template" className="text-blue-600 hover:text-blue-800 underline">
                  Conference Minutes Template
                </Link>
              </div>
            </div>
          </div> */}

          <Footer />
        </div>
      </div>
    </>
  );
}