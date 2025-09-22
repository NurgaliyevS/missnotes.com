
export const customConfig = {
  domainName: "missnotes.com",
  mailgun: {
    subdomain: "mg",
    fromNoReply: `MissNotes <noreply@mg.missnotes.com>`,
    fromAdmin: `MissNotes <admin@mg.missnotes.com>`,
    supportEmail: "nurgasab@gmail.com",
    forwardRepliesTo: "nurgasab@gmail.com",
  },
  documentTitle:
    "MissNotes - Turn Meeting Recordings into Actionable Notes in Minutes",
  domainWithHttps: "https://missnotes.com",
  seo: {
    description:
      "Upload meeting recordings and get transcripts, summaries, and action items in minutes. Perfect for ADHDers and busy professionals. No setup, no distractions.",
    themeColor: "#F3F4EF",
    applicationName: "missnotes",
    og: {
      title:
        "MissNotes - Turn Meeting Recordings into Actionable Notes in Minutes",
      url: "https://missnotes.com",
      image: "https://missnotes.com/og-image.jpg",
      imageAlt:
        "MissNotes - Upload meeting recordings and get transcripts, summaries, and action items in minutes",
      content: "https://x.com/tech_nurgaliyev",
      twitterSite: "@tech_nurgaliyev",
      twitterImage: "https://missnotes.com/og-image.jpg",
    },
  },
  blog: {
    title: "MissNotes Blog",
    description:
      "Tips, tricks, and insights for better meeting management and productivity. From ADHDers, for ADHDers.",
    canonical: "https://missnotes.com/blog",
    author: {
      name: "Sabyr Nurgaliyev",
      description:
        "I am the founder of MissNotes, a meeting transcription and note-taking tool designed specifically for ADHDers and busy professionals. I created MissNotes to help people turn meeting recordings into actionable notes without the overwhelm.",
    },
  },
};
