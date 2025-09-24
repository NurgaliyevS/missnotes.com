// Helper functions for static template data
const getTemplateLocation = (templateType) => {
  const locations = {
    office: "Dunder Mifflin Scranton Conference Room",
    startup: "TechHub Innovation Center",
    healthcare: "City General Hospital - Conference Room A",
    education: "University of Excellence - Faculty Lounge",
    board: "Corporate Headquarters - Boardroom",
    sales: "Sales Office - Conference Room",
    marketing: "Marketing Department - Creative Room",
    hr: "HR Department - Meeting Room",
    executive: "Executive Conference Room",
    design: "Design Studio - Review Room",
    content: "Content Studio - Planning Room",
    patientcare: "City Medical Center - ICU Conference Room",
    medical: "Medical Center - Staff Lounge",
    research: "Research Institute - Conference Room"
  };
  return locations[templateType] || locations.office;
};

const getTemplateType = (templateType) => {
  const types = {
    office: "Team Meeting",
    startup: "Sprint Planning",
    healthcare: "Medical Team Meeting",
    education: "Academic Planning",
    board: "Board Meeting",
    sales: "Sales Meeting",
    marketing: "Campaign Planning",
    hr: "HR Team Meeting",
    executive: "Executive Meeting",
    design: "Design Review",
    content: "Content Planning",
    patientcare: "Care Coordination",
    medical: "Medical Staff Meeting",
    research: "Clinical Research"
  };
  return types[templateType] || types.office;
};

const getTemplateAttendees = (templateType) => {
  const attendees = {
    office: [
      "Michael Scott – Regional Manager",
      "Jim Halpert – Sales Representative",
      "Pam Beesly – Receptionist",
      "Dwight Schrute – Assistant (to the) Regional Manager",
      "Stanley Hudson – Sales Representative",
      "Ryan Howard – Temp"
    ],
    startup: [
      "Sarah Chen – Product Manager",
      "Alex Rodriguez – Lead Developer",
      "Emma Thompson – UX Designer",
      "Marcus Johnson – QA Engineer",
      "Lisa Park – Marketing Lead",
      "David Kim – DevOps Engineer"
    ],
    healthcare: [
      "Dr. Jennifer Martinez – Chief of Medicine",
      "Dr. Robert Wilson – Cardiologist",
      "Nurse Patricia Brown – Head Nurse",
      "Dr. Amanda Lee – Emergency Medicine",
      "Dr. Michael Davis – Internal Medicine",
      "Sarah Johnson – Patient Care Coordinator"
    ],
    education: [
      "Dr. Elizabeth Foster – Department Head",
      "Prof. James Mitchell – Computer Science",
      "Dr. Maria Santos – Mathematics",
      "Prof. Thomas Anderson – Physics",
      "Dr. Rachel Green – Chemistry",
      "Prof. Kevin Murphy – Engineering"
    ],
    board: [
      "Margaret Thompson – Board Chair",
      "David Chen – CEO",
      "Sarah Williams – CFO",
      "Robert Kim – Board Member",
      "Jennifer Adams – Board Member",
      "Michael Chang – Board Member"
    ],
    sales: [
      "John Martinez – Sales Director",
      "Lisa Chen – Account Manager",
      "Mike Johnson – Business Development",
      "Sarah Wilson – Sales Representative",
      "Tom Rodriguez – Sales Representative",
      "Amy Davis – Sales Coordinator"
    ],
    marketing: [
      "Amanda Foster – Marketing Director",
      "Tom Wilson – Creative Lead",
      "Rachel Davis – Digital Marketing",
      "Mark Thompson – Content Manager",
      "Lisa Park – Social Media Manager",
      "David Kim – Marketing Analyst"
    ],
    hr: [
      "Jennifer Adams – HR Director",
      "Mark Thompson – Recruitment Manager",
      "Lisa Park – Employee Relations",
      "Sarah Wilson – HR Specialist",
      "Tom Rodriguez – Benefits Coordinator"
    ],
    executive: [
      "Robert Kim – CEO",
      "Susan Rodriguez – COO",
      "Michael Chang – CTO",
      "Jennifer Adams – CFO",
      "David Chen – CMO",
      "Lisa Park – VP Operations"
    ],
    design: [
      "Sophie Chen – Lead Designer",
      "Alex Rivera – Product Manager",
      "Jordan Kim – UX Designer",
      "Emma Wilson – Visual Designer",
      "Tom Rodriguez – Design Researcher"
    ],
    content: [
      "Emma Wilson – Content Director",
      "Marcus Johnson – Social Media Manager",
      "Sarah Lee – Blog Writer",
      "Tom Rodriguez – Content Strategist",
      "Lisa Park – Video Producer"
    ],
    patientcare: [
      "Dr. Maria Rodriguez – Chief of Staff",
      "Nurse Jennifer Park – Charge Nurse",
      "Dr. Thomas Lee – ICU Director",
      "Dr. Amanda Chen – Cardiologist",
      "Nurse Sarah Wilson – ICU Nurse",
      "Dr. Michael Davis – Emergency Medicine"
    ],
    medical: [
      "Dr. Patricia Kim – Department Head",
      "Dr. James Martinez – Senior Resident",
      "Nurse Amy Chen – Staff Nurse",
      "Dr. Sarah Wilson – Attending Physician",
      "Nurse Tom Rodriguez – Charge Nurse",
      "Dr. Lisa Park – Fellow"
    ],
    research: [
      "Dr. Sarah Thompson – Principal Investigator",
      "Dr. Michael Chen – Research Coordinator",
      "Lisa Rodriguez – Data Analyst",
      "Dr. Emma Wilson – Research Scientist",
      "Tom Rodriguez – Lab Technician",
      "Dr. Amy Davis – Clinical Researcher"
    ]
  };
  return attendees[templateType] || attendees.office;
};

const getTemplatePreparedBy = (templateType) => {
  const preparedBy = {
    office: "Pam Beesly",
    startup: "Sarah Chen",
    healthcare: "Dr. Jennifer Martinez",
    education: "Dr. Elizabeth Foster",
    board: "Margaret Thompson",
    sales: "John Martinez",
    marketing: "Amanda Foster",
    hr: "Jennifer Adams",
    executive: "Robert Kim",
    design: "Sophie Chen",
    content: "Emma Wilson",
    patientcare: "Dr. Maria Rodriguez",
    medical: "Dr. Patricia Kim",
    research: "Dr. Sarah Thompson"
  };
  return preparedBy[templateType] || preparedBy.office;
};

const getTemplateDistribution = (templateType) => {
  const distribution = {
    office: "Scranton Branch",
    startup: "Product Team",
    healthcare: "Medical Staff",
    education: "Faculty",
    board: "Board of Directors",
    sales: "Sales Team",
    marketing: "Marketing Team",
    hr: "HR Department",
    executive: "Executive Team",
    design: "Design Team",
    content: "Content Team",
    patientcare: "Medical Staff",
    medical: "Medical Staff",
    research: "Research Team"
  };
  return distribution[templateType] || distribution.office;
};

const getTemplateAgendaItems = (templateType) => {
  const agendaItems = {
    office: [
      {
        title: "Improving Office Morale",
        discussion: [
          "Michael proposed an \"Office Olympics\" to boost morale.",
          "Jim and Pam suggested simple games with items around the office.",
          "Dwight raised concerns about productivity loss."
        ],
        decisions: [
          "Proceed with Office Olympics during lunch break.",
          "Jim and Pam will organize events."
        ],
        actionItems: [
          { task: "Create list of games", assignee: "Jim & Pam", due: "tomorrow" },
          { task: "Order yogurt lids for medals", assignee: "Michael", due: "tomorrow" }
        ]
      },
      {
        title: "Sales Goals for Q3",
        discussion: [
          "Dwight emphasized the need to double sales calls.",
          "Stanley noted motivation is low.",
          "Michael attempted to inspire the team with a \"World's Best Boss\" mug speech."
        ],
        decisions: [
          "Each rep to increase daily calls by 10%.",
          "Dwight to track call metrics weekly."
        ],
        actionItems: [
          { task: "Update sales tracker", assignee: "Dwight", due: "day after tomorrow" },
          { task: "Prepare motivation poster", assignee: "Ryan", due: "three days later" }
        ]
      }
    ],
    startup: [
      {
        title: "Mobile App Redesign",
        discussion: [
          "Emma presented new wireframes for the mobile interface.",
          "Alex raised concerns about development timeline.",
          "Sarah emphasized the need for user testing before launch."
        ],
        decisions: [
          "Proceed with the new design system.",
          "Implement phased rollout approach."
        ],
        actionItems: [
          { task: "Finalize design mockups", assignee: "Emma", due: "tomorrow" },
          { task: "Create development timeline", assignee: "Alex", due: "tomorrow" }
        ]
      },
      {
        title: "Performance Optimization",
        discussion: [
          "David reported server response time issues.",
          "Marcus identified bottlenecks in the user flow.",
          "Team discussed potential solutions and trade-offs."
        ],
        decisions: [
          "Implement caching strategy for frequently accessed data.",
          "Optimize database queries in critical paths."
        ],
        actionItems: [
          { task: "Set up Redis caching", assignee: "David", due: "day after tomorrow" },
          { task: "Profile database queries", assignee: "Marcus", due: "three days later" }
        ]
      }
    ],
    healthcare: [
      {
        title: "Patient Safety Protocols",
        discussion: [
          "Dr. Martinez reviewed recent safety incidents.",
          "Nurse Brown highlighted staffing challenges during peak hours.",
          "Team discussed implementation of new safety checklists."
        ],
        decisions: [
          "Implement mandatory safety briefings before each shift.",
          "Increase staffing during high-risk periods."
        ],
        actionItems: [
          { task: "Create safety briefing template", assignee: "Nurse Brown", due: "tomorrow" },
          { task: "Review staffing schedules", assignee: "Dr. Martinez", due: "tomorrow" }
        ]
      },
      {
        title: "Emergency Response Procedures",
        discussion: [
          "Dr. Lee presented updated emergency protocols.",
          "Dr. Wilson emphasized the importance of rapid response times.",
          "Team discussed coordination between departments."
        ],
        decisions: [
          "Update emergency response time targets to under 3 minutes.",
          "Implement cross-department communication system."
        ],
        actionItems: [
          { task: "Install new communication system", assignee: "Dr. Lee", due: "day after tomorrow" },
          { task: "Train staff on new protocols", assignee: "Dr. Wilson", due: "three days later" }
        ]
      }
    ],
    education: [
      {
        title: "Curriculum Modernization",
        discussion: [
          "Dr. Foster presented industry feedback on current curriculum.",
          "Prof. Mitchell emphasized the need for more practical programming courses.",
          "Team discussed integration of AI and machine learning topics."
        ],
        decisions: [
          "Add new elective courses in AI and data science.",
          "Update existing courses to include more hands-on projects."
        ],
        actionItems: [
          { task: "Design new AI course syllabus", assignee: "Prof. Mitchell", due: "tomorrow" },
          { task: "Update existing course materials", assignee: "Dr. Santos", due: "tomorrow" }
        ]
      },
      {
        title: "Research Collaboration",
        discussion: [
          "Dr. Green proposed interdisciplinary research projects.",
          "Prof. Anderson highlighted funding opportunities.",
          "Team discussed potential industry partnerships."
        ],
        decisions: [
          "Form interdisciplinary research teams.",
          "Apply for NSF grant for collaborative research."
        ],
        actionItems: [
          { task: "Prepare NSF grant proposal", assignee: "Dr. Green", due: "day after tomorrow" },
          { task: "Identify industry partners", assignee: "Prof. Murphy", due: "three days later" }
        ]
      }
    ],
    board: [
      {
        title: "Financial Reports & Performance",
        discussion: [
          "Q3 revenue exceeded projections by 8%.",
          "Operating margins improved to 15.2%.",
          "Discussion on Q4 budget allocation for strategic initiatives."
        ],
        decisions: [
          "Approve Q4 budget allocation for strategic initiatives.",
          "Proceed with European market expansion."
        ],
        actionItems: [
          { task: "Present detailed Q4 budget proposal", assignee: "Sarah Williams", due: "tomorrow" },
          { task: "Develop European market entry strategy", assignee: "David Chen", due: "day after tomorrow" }
        ]
      },
      {
        title: "Strategic Initiatives & Governance",
        discussion: [
          "Review of governance policies for remote work.",
          "Discussion on board composition and succession planning.",
          "Evaluation of risk management frameworks."
        ],
        decisions: [
          "Update governance policies for remote work.",
          "Appoint new board member by end of quarter."
        ],
        actionItems: [
          { task: "Update governance policy documents", assignee: "Margaret Thompson", due: "tomorrow" },
          { task: "Initiate board member search process", assignee: "Robert Kim", due: "three days later" }
        ]
      }
    ],
    sales: [
      {
        title: "Sales KPIs & Pipeline Review",
        discussion: [
          "Monthly target: $500K, achieved: $520K (104%).",
          "Pipeline value increased by 15% this quarter.",
          "Discussion on Q4 targets and client feedback."
        ],
        decisions: [
          "Increase Q4 targets by 10% based on strong performance.",
          "Implement new client onboarding process."
        ],
        actionItems: [
          { task: "Update CRM with new Q4 targets", assignee: "John Martinez", due: "tomorrow" },
          { task: "Streamline client onboarding process", assignee: "Lisa Chen", due: "day after tomorrow" }
        ]
      },
      {
        title: "Client Feedback & Opportunities",
        discussion: [
          "Client satisfaction scores improved to 4.5/5.0.",
          "New opportunities in healthcare and technology sectors.",
          "Discussion on competitive positioning and pricing."
        ],
        decisions: [
          "Focus sales efforts on healthcare and technology sectors.",
          "Update pricing strategy for premium services."
        ],
        actionItems: [
          { task: "Develop healthcare sector sales strategy", assignee: "Mike Johnson", due: "tomorrow" },
          { task: "Review and update pricing models", assignee: "John Martinez", due: "three days later" }
        ]
      }
    ],
    marketing: [
      {
        title: "Q4 Campaign Strategy",
        discussion: [
          "Holiday campaign theme: 'Innovation for Everyone'.",
          "Social media engagement up 25% from last quarter.",
          "Discussion on budget allocation and KPI targets."
        ],
        decisions: [
          "Allocate 40% of budget to digital channels.",
          "Set KPI targets: 30% increase in brand awareness."
        ],
        actionItems: [
          { task: "Create campaign content calendar", assignee: "Tom Wilson", due: "tomorrow" },
          { task: "Set up tracking for brand awareness metrics", assignee: "Rachel Davis", due: "day after tomorrow" }
        ]
      },
      {
        title: "Content Calendar & Campaign Planning",
        discussion: [
          "Blog post schedule: 3 posts per week maintained.",
          "Video content performance exceeded expectations.",
          "Discussion on influencer partnerships and collaborations."
        ],
        decisions: [
          "Launch Black Friday content series starting November 15th.",
          "Partner with 5 key influencers for Q4 campaigns."
        ],
        actionItems: [
          { task: "Create Black Friday content assets", assignee: "Sarah Lee", due: "tomorrow" },
          { task: "Identify and contact potential influencers", assignee: "Marcus Johnson", due: "three days later" }
        ]
      }
    ],
    hr: [
      {
        title: "Recruitment & Employee Engagement",
        discussion: [
          "12 new hires completed onboarding this month.",
          "Employee satisfaction score: 4.2/5.0 (up from 3.8).",
          "Discussion on flexible work policies and benefits."
        ],
        decisions: [
          "Implement flexible work policy for all departments.",
          "Launch new performance review process in Q1."
        ],
        actionItems: [
          { task: "Draft flexible work policy document", assignee: "Lisa Park", due: "tomorrow" },
          { task: "Design new performance review process", assignee: "Jennifer Adams", due: "day after tomorrow" }
        ]
      },
      {
        title: "HR Policies & Workplace Culture",
        discussion: [
          "Review of current HR policies and procedures.",
          "Discussion on diversity and inclusion initiatives.",
          "Evaluation of employee development programs."
        ],
        decisions: [
          "Update diversity and inclusion policies.",
          "Implement new employee development program."
        ],
        actionItems: [
          { task: "Review and update diversity policies", assignee: "Mark Thompson", due: "tomorrow" },
          { task: "Design employee development curriculum", assignee: "Lisa Park", due: "three days later" }
        ]
      }
    ],
    executive: [
      {
        title: "Quarterly Goals & Strategic Initiatives",
        discussion: [
          "Q3 revenue target achieved at 105%.",
          "Market expansion into Asia-Pacific region on track.",
          "Discussion on Q4 growth targets and resource allocation."
        ],
        decisions: [
          "Accelerate Q4 growth targets by 15%.",
          "Increase investment in Asia-Pacific market expansion."
        ],
        actionItems: [
          { task: "Develop Asia-Pacific market entry strategy", assignee: "Susan Rodriguez", due: "tomorrow" },
          { task: "Update Q4 budget for growth initiatives", assignee: "Jennifer Adams", due: "day after tomorrow" }
        ]
      },
      {
        title: "Cross-department Updates & Risk Assessment",
        discussion: [
          "Review of cross-department collaboration initiatives.",
          "Discussion on emerging risks and mitigation strategies.",
          "Evaluation of technology infrastructure investments."
        ],
        decisions: [
          "Implement new cross-department communication system.",
          "Update risk assessment framework for international expansion."
        ],
        actionItems: [
          { task: "Install new communication platform", assignee: "Michael Chang", due: "tomorrow" },
          { task: "Conduct comprehensive risk assessment", assignee: "Robert Kim", due: "three days later" }
        ]
      }
    ],
    design: [
      {
        title: "Mobile App Wireframes Review",
        discussion: [
          "Sophie presented updated wireframes for onboarding flow.",
          "Alex requested simplification of step 3 in user journey.",
          "Discussion on user testing and feedback integration."
        ],
        decisions: [
          "Approve wireframes with modifications to step 3.",
          "Schedule user testing session for next week."
        ],
        actionItems: [
          { task: "Revise step 3 wireframes", assignee: "Sophie Chen", due: "tomorrow" },
          { task: "Prepare user testing scenarios", assignee: "Jordan Kim", due: "day after tomorrow" }
        ]
      },
      {
        title: "Design System & Brand Guidelines",
        discussion: [
          "Review of current design system consistency.",
          "Discussion on brand guideline updates and color schemes.",
          "Evaluation of accessibility standards compliance."
        ],
        decisions: [
          "Update color scheme to match brand guidelines.",
          "Implement enhanced accessibility standards."
        ],
        actionItems: [
          { task: "Update design system color palette", assignee: "Emma Wilson", due: "tomorrow" },
          { task: "Audit designs for accessibility compliance", assignee: "Tom Rodriguez", due: "three days later" }
        ]
      }
    ],
    content: [
      {
        title: "Q4 Content Calendar Planning",
        discussion: [
          "Holiday campaign content themes finalized.",
          "Blog post schedule: 3 posts per week maintained.",
          "Discussion on video content strategy and social media."
        ],
        decisions: [
          "Launch Black Friday content series starting November 15th.",
          "Increase social media posting frequency to 2x daily."
        ],
        actionItems: [
          { task: "Create Black Friday content assets", assignee: "Sarah Lee", due: "tomorrow" },
          { task: "Develop social media content calendar", assignee: "Marcus Johnson", due: "day after tomorrow" }
        ]
      },
      {
        title: "Content Performance & Strategy",
        discussion: [
          "Blog engagement increased by 35% this quarter.",
          "Video content performance exceeded expectations.",
          "Discussion on SEO optimization and content distribution."
        ],
        decisions: [
          "Implement new SEO content strategy.",
          "Expand video content production by 50%."
        ],
        actionItems: [
          { task: "Develop SEO content guidelines", assignee: "Tom Rodriguez", due: "tomorrow" },
          { task: "Plan video content production schedule", assignee: "Lisa Park", due: "three days later" }
        ]
      }
    ],
    patientcare: [
      {
        title: "Patient Safety Protocols & Shift Handovers",
        discussion: [
          "ICU occupancy at 85% - within safe limits.",
          "Night shift reported 3 critical patients requiring close monitoring.",
          "Discussion on enhanced monitoring protocols."
        ],
        decisions: [
          "Implement enhanced monitoring protocol for high-risk patients.",
          "Update shift handover procedures for better continuity."
        ],
        actionItems: [
          { task: "Update patient care plans for critical cases", assignee: "Dr. Lee", due: "tomorrow" },
          { task: "Revise shift handover checklist", assignee: "Nurse Park", due: "day after tomorrow" }
        ]
      },
      {
        title: "Care Plan Updates & Staffing",
        discussion: [
          "Review of current patient care plans and outcomes.",
          "Discussion on staffing levels and coverage.",
          "Evaluation of care coordination between departments."
        ],
        decisions: [
          "Maintain current staffing levels for next 48 hours.",
          "Implement daily care coordination meetings."
        ],
        actionItems: [
          { task: "Schedule daily care coordination meetings", assignee: "Dr. Rodriguez", due: "tomorrow" },
          { task: "Review and update care plan templates", assignee: "Dr. Chen", due: "three days later" }
        ]
      }
    ],
    medical: [
      {
        title: "Patient Updates & Staffing Challenges",
        discussion: [
          "Patient census: 45 patients, 3 in critical condition.",
          "Staffing shortage in emergency department for weekend shifts.",
          "Discussion on safety protocols and training needs."
        ],
        decisions: [
          "Implement mandatory safety briefing before each shift.",
          "Approve temporary staffing solutions for weekend coverage."
        ],
        actionItems: [
          { task: "Recruit temporary staff for weekend coverage", assignee: "Dr. Kim", due: "tomorrow" },
          { task: "Create safety briefing template", assignee: "Nurse Chen", due: "day after tomorrow" }
        ]
      },
      {
        title: "Clinical Protocols & Training",
        discussion: [
          "Review of recent clinical incidents and near misses.",
          "Discussion on staff training and certification updates.",
          "Evaluation of emergency response procedures."
        ],
        decisions: [
          "Update emergency response procedures.",
          "Schedule mandatory training for all clinical staff."
        ],
        actionItems: [
          { task: "Update emergency response protocols", assignee: "Dr. Martinez", due: "tomorrow" },
          { task: "Schedule clinical training sessions", assignee: "Dr. Wilson", due: "three days later" }
        ]
      }
    ],
    research: [
      {
        title: "Study Updates & Experimental Results",
        discussion: [
          "Phase II trial enrollment: 85% complete (102/120 participants).",
          "Preliminary results show 73% positive response rate.",
          "Discussion on data quality and protocol compliance."
        ],
        decisions: [
          "Proceed with Phase III protocol submission to FDA.",
          "Extend data collection timeline by 30 days for complete enrollment."
        ],
        actionItems: [
          { task: "Prepare FDA submission documents", assignee: "Dr. Chen", due: "tomorrow" },
          { task: "Complete remaining participant enrollment", assignee: "Lisa Rodriguez", due: "day after tomorrow" }
        ]
      },
      {
        title: "Research Protocol & Data Analysis",
        discussion: [
          "Review of current research protocols and compliance.",
          "Discussion on data analysis methods and statistical approaches.",
          "Evaluation of research team performance and training needs."
        ],
        decisions: [
          "Update statistical analysis plan for Phase III.",
          "Implement additional training for research coordinators."
        ],
        actionItems: [
          { task: "Revise statistical analysis plan", assignee: "Dr. Thompson", due: "tomorrow" },
          { task: "Schedule research coordinator training", assignee: "Dr. Wilson", due: "three days later" }
        ]
      }
    ]
  };
  return agendaItems[templateType] || agendaItems.office;
};

const getTemplateKeyDecisions = (templateType) => {
  const keyDecisions = {
    office: [
      "Office Olympics will take place during lunch.",
      "Sales team will increase calls by 10%.",
      "Dwight will oversee performance metrics."
    ],
    startup: [
      "Mobile app redesign will proceed with new design system.",
      "Performance optimization will focus on caching and database queries.",
      "Phased rollout approach will be implemented for new features."
    ],
    healthcare: [
      "Mandatory safety briefings will be implemented before each shift.",
      "Emergency response time targets updated to under 3 minutes.",
      "Cross-department communication system will be installed."
    ],
    education: [
      "New AI and data science courses will be added to curriculum.",
      "Interdisciplinary research teams will be formed.",
      "NSF grant proposal will be submitted for collaborative research."
    ],
    board: [
      "Approved expansion into European markets.",
      "Updated governance policies for remote work.",
      "Q4 budget allocation approved for strategic initiatives."
    ],
    sales: [
      "Q4 sales targets increased to $550K monthly.",
      "New client onboarding process streamlined.",
      "Focus sales efforts on healthcare and technology sectors."
    ],
    marketing: [
      "Q4 campaign budget: $200K with 40% digital allocation.",
      "KPI targets: 30% increase in brand awareness.",
      "Black Friday content series approved for November 15th launch."
    ],
    hr: [
      "Flexible work policy approved for implementation.",
      "New performance review process to be launched Q1.",
      "Diversity and inclusion policies updated."
    ],
    executive: [
      "Q4 growth targets increased to $2.5M revenue.",
      "Risk assessment framework updated for international expansion.",
      "Asia-Pacific market entry strategy approved."
    ],
    design: [
      "Mobile app wireframes approved with step 3 modifications.",
      "Color scheme updated to match brand guidelines.",
      "Enhanced accessibility standards implemented."
    ],
    content: [
      "Q4 content calendar approved with Black Friday series.",
      "Social media posting frequency increased to 2x daily.",
      "New SEO content strategy implemented."
    ],
    patientcare: [
      "Enhanced monitoring protocol approved for high-risk patients.",
      "Staffing levels maintained at current levels for next 48 hours.",
      "Daily care coordination meetings implemented."
    ],
    medical: [
      "Mandatory safety briefings implemented for all shifts.",
      "Temporary staffing solutions approved for weekend coverage.",
      "Emergency response procedures updated."
    ],
    research: [
      "Phase III protocol submission approved for FDA review.",
      "Data collection timeline extended by 30 days for complete enrollment.",
      "Statistical analysis plan updated for Phase III."
    ]
  };
  return keyDecisions[templateType] || keyDecisions.office;
};

const getTemplateNextSteps = (templateType) => {
  const nextSteps = {
    office: [
      "Complete planning for Office Olympics.",
      "Implement sales tracker updates.",
      "Review progress in next week's meeting."
    ],
    startup: [
      "Complete design mockups and development timeline.",
      "Implement performance optimizations.",
      "Prepare for user testing phase."
    ],
    healthcare: [
      "Implement safety briefing procedures.",
      "Install and test new communication system.",
      "Conduct staff training on updated protocols."
    ],
    education: [
      "Develop new course syllabi and materials.",
      "Prepare grant proposal and identify partners.",
      "Plan faculty development workshops."
    ],
    board: [
      "Present detailed Q4 budget proposal.",
      "Develop European market entry strategy.",
      "Update governance policy documents."
    ],
    sales: [
      "Update CRM with new Q4 targets.",
      "Streamline client onboarding process.",
      "Develop healthcare sector sales strategy."
    ],
    marketing: [
      "Create campaign content calendar.",
      "Set up tracking for brand awareness metrics.",
      "Launch Black Friday content series."
    ],
    hr: [
      "Draft flexible work policy document.",
      "Design new performance review process.",
      "Review and update diversity policies."
    ],
    executive: [
      "Develop Asia-Pacific market entry strategy.",
      "Update Q4 budget for growth initiatives.",
      "Install new communication platform."
    ],
    design: [
      "Revise step 3 wireframes.",
      "Prepare user testing scenarios.",
      "Update design system color palette."
    ],
    content: [
      "Create Black Friday content assets.",
      "Develop social media content calendar.",
      "Develop SEO content guidelines."
    ],
    patientcare: [
      "Update patient care plans for critical cases.",
      "Revise shift handover checklist.",
      "Schedule daily care coordination meetings."
    ],
    medical: [
      "Recruit temporary staff for weekend coverage.",
      "Create safety briefing template.",
      "Update emergency response protocols."
    ],
    research: [
      "Prepare FDA submission documents.",
      "Complete remaining participant enrollment.",
      "Revise statistical analysis plan."
    ]
  };
  return nextSteps[templateType] || nextSteps.office;
};

const getTemplateFollowUpActions = (templateType, nextWeekFormatted) => {
  const followUpActions = {
    office: [
      "Send meeting notes to all attendees",
      `Schedule follow-up meeting for ${nextWeekFormatted}`,
      "Update team notice board with goals"
    ],
    startup: [
      "Send sprint notes to all team members",
      `Schedule design review for ${nextWeekFormatted}`,
      "Update project management board with new tasks"
    ],
    healthcare: [
      "Distribute meeting notes to all medical staff",
      `Schedule safety training session for ${nextWeekFormatted}`,
      "Update hospital policy manual with new procedures"
    ],
    education: [
      "Share meeting notes with all faculty members",
      `Schedule curriculum review meeting for ${nextWeekFormatted}`,
      "Update department website with new course offerings"
    ],
    board: [
      "Distribute meeting minutes to all board members",
      `Schedule next board meeting for ${nextWeekFormatted}`,
      "Update corporate governance documents"
    ],
    sales: [
      "Send meeting notes to all sales team members",
      `Schedule sales review meeting for ${nextWeekFormatted}`,
      "Update CRM with new targets and processes"
    ],
    marketing: [
      "Share meeting notes with marketing team",
      `Schedule campaign review for ${nextWeekFormatted}`,
      "Update marketing calendar with new initiatives"
    ],
    hr: [
      "Distribute meeting notes to all HR staff",
      `Schedule HR policy review for ${nextWeekFormatted}`,
      "Update employee handbook with new policies"
    ],
    executive: [
      "Share meeting notes with all executives",
      `Schedule executive strategy session for ${nextWeekFormatted}`,
      "Update corporate strategy documents"
    ],
    design: [
      "Send meeting notes to design team",
      `Schedule design review for ${nextWeekFormatted}`,
      "Update design system documentation"
    ],
    content: [
      "Share meeting notes with content team",
      `Schedule content planning session for ${nextWeekFormatted}`,
      "Update content calendar with new schedule"
    ],
    patientcare: [
      "Distribute meeting notes to all medical staff",
      `Schedule patient care coordination meeting for ${nextWeekFormatted}`,
      "Update patient care protocols and procedures"
    ],
    medical: [
      "Share meeting notes with all clinical staff",
      `Schedule medical staff meeting for ${nextWeekFormatted}`,
      "Update clinical protocols and training materials"
    ],
    research: [
      "Distribute meeting notes to research team",
      `Schedule research progress review for ${nextWeekFormatted}`,
      "Update research protocols and documentation"
    ]
  };
  return followUpActions[templateType] || followUpActions.office;
};

export const generateMeetingNotesDOCX = async (templateType = 'office') => {
  // Dynamically import docx library only on client side
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx');
  
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
  
  // Create DOCX document structure
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Title
        new Paragraph({
          children: [
            new TextRun({
              text: "Meeting Notes",
              bold: true,
              size: 32,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Professional Meeting Minutes",
              size: 24,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
        }),
        
        // Meeting Details
        new Paragraph({
          children: [
            new TextRun({
              text: `Date: ${todayFormatted}`,
              size: 20,
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Time: 10:00 AM",
              size: 20,
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Location: ${getTemplateLocation(templateType)}`,
              size: 20,
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Type: ${getTemplateType(templateType)}`,
              size: 20,
            }),
          ],
          spacing: { after: 400 },
        }),
        
        // Attendees
        new Paragraph({
          children: [
            new TextRun({
              text: "Attendees",
              bold: true,
              size: 24,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        }),
        ...getTemplateAttendees(templateType).map(attendee => new Paragraph({
          children: [
            new TextRun({
              text: `• ${attendee}`,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        })),
        
        // Agenda Items
        new Paragraph({
          children: [
            new TextRun({
              text: "Agenda Items",
              bold: true,
              size: 24,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        }),
        
        // Static Agenda Items
        ...getTemplateAgendaItems(templateType).flatMap((item, index) => [
          // Page break before second topic
          ...(index > 0 ? [new Paragraph({
          children: [new TextRun({ text: "" })],
          pageBreakBefore: true,
          })] : []),
        
          // Topic title
        new Paragraph({
          children: [
            new TextRun({
                text: `${index + 1}. ${item.title}`,
              bold: true,
              size: 22,
            }),
          ],
          spacing: { after: 200 },
        }),
          
          // Discussion section
        new Paragraph({
          children: [
            new TextRun({
              text: "Discussion:",
              bold: true,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        }),
          ...item.discussion.map(point => new Paragraph({
          children: [
            new TextRun({
                text: `• ${point}`,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
          })),
          
          // Decisions section
        new Paragraph({
          children: [
            new TextRun({
              text: "Decisions Made:",
              bold: true,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        }),
          ...item.decisions.map(decision => new Paragraph({
          children: [
            new TextRun({
                text: `• ${decision}`,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
          })),
          
          // Action Items section
        new Paragraph({
          children: [
            new TextRun({
              text: "Action Items:",
              bold: true,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        }),
          ...item.actionItems.map(actionItem => {
            let dueDate = actionItem.due;
            if (actionItem.due === "tomorrow") dueDate = tomorrowFormatted;
            else if (actionItem.due === "day after tomorrow") dueDate = dayAfterTomorrowFormatted;
            else if (actionItem.due === "three days later") dueDate = threeDaysLaterFormatted;
            
            return new Paragraph({
          children: [
            new TextRun({
                  text: `☐ ${actionItem.task} – Assigned to: ${actionItem.assignee} – Due: ${dueDate}`,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
            });
        }),
          
          // Spacing after each topic
        new Paragraph({
            children: [new TextRun({ text: "" })],
          spacing: { after: 400 },
          })
        ]),
        
        // Key Decisions
        new Paragraph({
          children: [
            new TextRun({
              text: "Key Decisions Made",
              bold: true,
              size: 24,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        }),
        ...getTemplateKeyDecisions(templateType).map((decision, index) => new Paragraph({
          children: [
            new TextRun({
              text: `${index + 1}. ${decision}`,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        })),
        
        // Next Steps
        new Paragraph({
          children: [
            new TextRun({
              text: "Next Steps",
              bold: true,
              size: 24,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        }),
        ...getTemplateNextSteps(templateType).map(step => new Paragraph({
          children: [
            new TextRun({
              text: `• ${step}`,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        })),
        
        // Follow-up Actions
        new Paragraph({
          children: [
            new TextRun({
              text: "Follow-up Actions",
              bold: true,
              size: 24,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        }),
        ...getTemplateFollowUpActions(templateType, nextWeekFormatted).map(action => new Paragraph({
          children: [
            new TextRun({
              text: `☐ ${action}`,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        })),
        
        // Footer
        new Paragraph({
          children: [
            new TextRun({
              text: `Prepared by: ${getTemplatePreparedBy(templateType)}`,
              size: 18,
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Date prepared: ${todayFormatted}`,
              size: 18,
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Distribution: ${getTemplateDistribution(templateType)}`,
              size: 18,
            }),
          ],
          spacing: { after: 200 },
        }),
      ],
    }],
  });
  
  // Generate and download DOCX
  const buffer = await Packer.toBlob(doc);
  
  // Create download link
  const url = URL.createObjectURL(buffer);
  const link = document.createElement('a');
  link.href = url;
  link.download = `meeting-notes-${templateType}-template.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
