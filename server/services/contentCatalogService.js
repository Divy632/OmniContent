const categories = [
  {
    id: 'events',
    title: 'Events & Posters',
    description: 'Posters, flyers, and announcements for hackathons, college fests, conferences, and club gatherings.',
    icon: 'Calendar',
    badge: 'Popular'
  },
  {
    id: 'professional',
    title: 'Professional & Career',
    description: 'LinkedIn posts, career milestones, internship announcements, and professional thought leadership.',
    icon: 'Briefcase',
    badge: 'Career'
  },
  {
    id: 'invitations',
    title: 'Invitations & Cards',
    description: 'Personalized invitations for birthdays, weddings, farewells, parties, and reunions.',
    icon: 'MailOpen',
    badge: 'Personal'
  },
  {
    id: 'business',
    title: 'Business & Marketing',
    description: 'Product launches, seasonal discount flyers, promotional banners, and festival sales.',
    icon: 'TrendingUp',
    badge: 'Growth'
  },
  {
    id: 'creator_tools',
    title: 'Content Creator Hub',
    description: 'YouTube thumbnail concepts, catchy video titles, descriptions, and streaming teasers.',
    icon: 'Video',
    badge: 'Viral'
  },
  {
    id: 'social_media',
    title: 'Social Media',
    description: 'Engaging captions, Twitter/X threads, Instagram carousels, and quote cards.',
    icon: 'Share2',
    badge: 'Engagement'
  },
  {
    id: 'education',
    title: 'Academic & Education',
    description: 'Workshop materials, study infographics, revision guides, and research symposium flyers.',
    icon: 'GraduationCap',
    badge: 'Academic'
  },
  {
    id: 'personal',
    title: 'Greetings & Quotes',
    description: 'Heartfelt greetings, motivational quote cards, festival wishes, and personal tributes.',
    icon: 'Heart',
    badge: 'Lifestyle'
  }
];

const contentTypes = [
  // 1. Events
  {
    id: 'event_poster',
    categoryId: 'events',
    categoryName: 'Events & Posters',
    title: 'College / Tech Event Poster',
    description: 'Create an eye-catching poster and announcement copy for college fests, hackathons, and tech summits.',
    supportedOutputs: ['text', 'image'],
    defaultOutputs: ['text', 'image'],
    aspectRatio: '3:4',
    fields: [
      { name: 'eventName', label: 'Event Name', type: 'text', placeholder: 'e.g. National Hackathon 2026', required: true },
      { name: 'date', label: 'Date & Time', type: 'text', placeholder: 'e.g. 20 November 2026, 9:00 AM IST', required: true },
      { name: 'venue', label: 'Venue / Platform', type: 'text', placeholder: 'e.g. College Auditorium & Discord', required: true },
      { name: 'audience', label: 'Target Audience', type: 'text', placeholder: 'e.g. Engineering students, coders, and designers', required: false },
      { name: 'highlights', label: 'Key Highlights / Prize Pool', type: 'textarea', placeholder: 'e.g. ₹1,00,000 cash prizes, free food, mentor workshops, sponsored by top tech firms', required: false },
      { name: 'registrationLink', label: 'Registration CTA', type: 'text', placeholder: 'e.g. Register at hack2026.dev before Nov 15', required: false }
    ],
    defaultPreferences: {
      platform: 'Instagram',
      tone: 'Energetic & Professional',
      visualStyle: 'Modern Cyberpunk / Neon Tech',
      language: 'English'
    }
  },
  {
    id: 'event_announcement',
    categoryId: 'events',
    categoryName: 'Events & Posters',
    title: 'Official Event Announcement',
    description: 'Draft official circulars, student group announcements, and newsletter notices.',
    supportedOutputs: ['text'],
    defaultOutputs: ['text'],
    fields: [
      { name: 'eventName', label: 'Event Title', type: 'text', placeholder: 'e.g. Annual Sports Meet 2026', required: true },
      { name: 'organizer', label: 'Organizing Committee/Club', type: 'text', placeholder: 'e.g. Student Council & Physical Dept', required: true },
      { name: 'schedule', label: 'Dates & Venue', type: 'text', placeholder: 'e.g. Oct 24-26 at Main Grounds', required: true },
      { name: 'guidelines', label: 'Participation Rules & Deadlines', type: 'textarea', placeholder: 'e.g. Teams of 11, registration closes on Friday at 5 PM', required: true }
    ],
    defaultPreferences: {
      platform: 'Email / Circular',
      tone: 'Formal & Authoritative',
      visualStyle: 'Corporate Clean',
      language: 'English'
    }
  },

  // 2. Professional
  {
    id: 'linkedin_post',
    categoryId: 'professional',
    categoryName: 'Professional & Career',
    title: 'LinkedIn Thought Leadership Post',
    description: 'Craft viral LinkedIn stories, industry insights, and career learning takeaways with high engagement.',
    supportedOutputs: ['text', 'image'],
    defaultOutputs: ['text', 'image'],
    aspectRatio: '1:1',
    fields: [
      { name: 'topic', label: 'Post Topic / Achievement', type: 'text', placeholder: 'e.g. Completed a 6-month Full Stack Internship at TechCorp', required: true },
      { name: 'keyTakeaways', label: 'Key Lessons / Accomplishments', type: 'textarea', placeholder: 'e.g. Built microservices handling 10k req/s, learned CI/CD pipelines, mentored 2 juniors', required: true },
      { name: 'audience', label: 'Target Industry / Audience', type: 'text', placeholder: 'e.g. Tech recruiters, software engineers, dev community', required: false },
      { name: 'callToAction', label: 'Ending Question / CTA', type: 'text', placeholder: 'e.g. What was your biggest lesson during your first software engineering role?', required: false }
    ],
    defaultPreferences: {
      platform: 'LinkedIn',
      tone: 'Inspiring & Professional',
      visualStyle: 'Clean Minimalist Gradient',
      language: 'English'
    }
  },
  {
    id: 'portfolio_announcement',
    categoryId: 'professional',
    categoryName: 'Professional & Career',
    title: 'Portfolio & Project Showcase',
    description: 'Showcase your newly completed project, tech stack, and GitHub repository to prospective employers.',
    supportedOutputs: ['text', 'image'],
    defaultOutputs: ['text', 'image'],
    aspectRatio: '16:9',
    fields: [
      { name: 'projectName', label: 'Project Name', type: 'text', placeholder: 'e.g. CloudLens - Serverless Monitoring Dashboard', required: true },
      { name: 'techStack', label: 'Tech Stack Used', type: 'text', placeholder: 'e.g. React, Node.js, AWS Lambda, MongoDB, Tailwind', required: true },
      { name: 'problemSolved', label: 'What Problem Does It Solve?', type: 'textarea', placeholder: 'e.g. Cuts cloud observability costs by 40% with smart log indexing', required: true },
      { name: 'liveLink', label: 'Live Demo or GitHub URL', type: 'text', placeholder: 'e.g. github.com/username/cloudlens', required: false }
    ],
    defaultPreferences: {
      platform: 'LinkedIn',
      tone: 'Confident & Technical',
      visualStyle: 'Modern Tech UI Mockup',
      language: 'English'
    }
  },

  // 3. Invitations
  {
    id: 'birthday_invitation',
    categoryId: 'invitations',
    categoryName: 'Invitations & Cards',
    title: 'Birthday Celebration Invitation',
    description: 'Design celebratory invitation cards with custom themes, dates, party vibes, and RSVP info.',
    supportedOutputs: ['text', 'image'],
    defaultOutputs: ['text', 'image'],
    aspectRatio: '3:4',
    fields: [
      { name: 'celebrant', label: 'Celebrant Name & Age/Milestone', type: 'text', placeholder: 'e.g. Arjun turns 21st!', required: true },
      { name: 'dateAndTime', label: 'Date and Time', type: 'text', placeholder: 'e.g. Saturday, November 14th at 7:00 PM', required: true },
      { name: 'venue', label: 'Party Venue', type: 'text', placeholder: 'e.g. SkyDeck Lounge, MG Road', required: true },
      { name: 'partyTheme', label: 'Party Theme & Dress Code', type: 'text', placeholder: 'e.g. Retro Disco 80s / Smart Casual', required: false },
      { name: 'rsvpDetails', label: 'RSVP Contact Info', type: 'text', placeholder: 'e.g. RSVP to Rahul at +91 9876543210 by Nov 10', required: false }
    ],
    defaultPreferences: {
      platform: 'WhatsApp / Print',
      tone: 'Fun & Warm',
      visualStyle: 'Vibrant Celebration with Confetti & Gold',
      language: 'English'
    }
  },
  {
    id: 'wedding_party_invitation',
    categoryId: 'invitations',
    categoryName: 'Invitations & Cards',
    title: 'Wedding / Formal Party Invitation',
    description: 'Elegant invitation cards for weddings, engagements, cocktail parties, and grand receptions.',
    supportedOutputs: ['text', 'image'],
    defaultOutputs: ['text', 'image'],
    aspectRatio: '3:4',
    fields: [
      { name: 'coupleNames', label: 'Hosts or Honorees', type: 'text', placeholder: 'e.g. Priya & Ananya', required: true },
      { name: 'ceremonyType', label: 'Ceremony / Occasion', type: 'text', placeholder: 'e.g. Wedding Reception & Dinner', required: true },
      { name: 'dateAndTime', label: 'Date & Time', type: 'text', placeholder: 'e.g. December 18, 2026, 6:30 PM onwards', required: true },
      { name: 'venueAddress', label: 'Venue Address', type: 'text', placeholder: 'e.g. The Grand Palace Hall, Heritage Gardens', required: true },
      { name: 'warmMessage', label: 'Special Note / Dress Code', type: 'textarea', placeholder: 'e.g. Black Tie / Traditional Indian Attire. Blessings only, no gifts please.', required: false }
    ],
    defaultPreferences: {
      platform: 'Digital Card / Print',
      tone: 'Elegant & Gracious',
      visualStyle: 'Luxury Gold Foil & Floral Botanical',
      language: 'English'
    }
  },

  // 4. Business
  {
    id: 'product_promotion',
    categoryId: 'business',
    categoryName: 'Business & Marketing',
    title: 'Product Promotion & Offer Poster',
    description: 'High-converting sales copy and promo posters for seasonal discounts, flash sales, and new arrivals.',
    supportedOutputs: ['text', 'image'],
    defaultOutputs: ['text', 'image'],
    aspectRatio: '1:1',
    fields: [
      { name: 'productName', label: 'Product / Brand Name', type: 'text', placeholder: 'e.g. AuraPods Max Noise-Canceling Headphones', required: true },
      { name: 'offerDiscount', label: 'Special Offer / Discount', type: 'text', placeholder: 'e.g. Flat 50% OFF + Free Express Shipping', required: true },
      { name: 'targetAudience', label: 'Target Audience', type: 'text', placeholder: 'e.g. Music lovers, travelers, remote workers', required: false },
      { name: 'keyFeatures', label: 'Key Features / USPs', type: 'textarea', placeholder: 'e.g. 40hr battery, studio acoustics, memory foam comfort, instant pairing', required: true },
      { name: 'callToAction', label: 'Call to Action / Promo Code', type: 'text', placeholder: 'e.g. Use code FLASH50 at checkout. Offer ends midnight!', required: true }
    ],
    defaultPreferences: {
      platform: 'Instagram / Facebook',
      tone: 'Persuasive & Urgent',
      visualStyle: 'Bold Commercial Product Showcase',
      language: 'English'
    }
  },

  // 5. Creator Tools
  {
    id: 'youtube_thumbnail',
    categoryId: 'creator_tools',
    categoryName: 'Content Creator Hub',
    title: 'YouTube Thumbnail & Video Concept',
    description: 'Design eye-grabbing YouTube thumbnail visuals, title formulas, and click-worthy hooks.',
    supportedOutputs: ['text', 'image'],
    defaultOutputs: ['text', 'image'],
    aspectRatio: '16:9',
    fields: [
      { name: 'videoTitle', label: 'Video Title or Idea', type: 'text', placeholder: 'e.g. How I Built a Full Stack SaaS in 48 Hours', required: true },
      { name: 'topicNiche', label: 'Niche / Channel Style', type: 'text', placeholder: 'e.g. Software Engineering & Indie Hacking', required: true },
      { name: 'visualHook', label: 'Thumbnail Focal Point / Emotion', type: 'textarea', placeholder: 'e.g. Shocked reaction face with revenue chart spiking $10,000, big glowing text', required: true },
      { name: 'thumbnailText', label: 'Big Overlay Text (Max 4 words)', type: 'text', placeholder: 'e.g. "I BUILT A SAAS IN 48 HOURS!"', required: true }
    ],
    defaultPreferences: {
      platform: 'YouTube',
      tone: 'Exciting & High-Energy',
      visualStyle: 'High-Contrast 3D Render YouTube Style',
      language: 'English'
    }
  },
  {
    id: 'video_description',
    categoryId: 'creator_tools',
    categoryName: 'Content Creator Hub',
    title: 'YouTube SEO Description & Timestamps',
    description: 'Generate complete YouTube descriptions with SEO keywords, chapters, resource links, and hashtags.',
    supportedOutputs: ['text'],
    defaultOutputs: ['text'],
    fields: [
      { name: 'videoTitle', label: 'Video Title', type: 'text', placeholder: 'e.g. Master React in 1 Hour - Beginner to Pro 2026', required: true },
      { name: 'keyPoints', label: 'Key Topics Covered', type: 'textarea', placeholder: 'e.g. Components, Hooks (useState, useEffect), Tailwind CSS, API fetching, Deployment', required: true },
      { name: 'resources', label: 'Links & Socials to Include', type: 'text', placeholder: 'e.g. Code repo on github, Discord community link', required: false }
    ],
    defaultPreferences: {
      platform: 'YouTube',
      tone: 'Helpful & Engaging',
      visualStyle: 'Modern Minimalist',
      language: 'English'
    }
  },

  // 6. Social Media
  {
    id: 'instagram_caption',
    categoryId: 'social_media',
    categoryName: 'Social Media',
    title: 'Instagram Caption & Aesthetic Post',
    description: 'Hook-driven captions with storytelling, emojis, engaging questions, and curated trending hashtags.',
    supportedOutputs: ['text', 'image'],
    defaultOutputs: ['text', 'image'],
    aspectRatio: '1:1',
    fields: [
      { name: 'subject', label: 'Photo / Post Subject', type: 'text', placeholder: 'e.g. Sunrise coffee while coding at a beach café in Goa', required: true },
      { name: 'mood', label: 'Vibe & Aesthetic', type: 'text', placeholder: 'e.g. Peaceful morning, digital nomad life, cozy', required: false },
      { name: 'story', label: 'Behind-the-scenes thought or lesson', type: 'textarea', placeholder: 'e.g. Remembering when I thought remote work was impossible. Consistency truly compounds.', required: false }
    ],
    defaultPreferences: {
      platform: 'Instagram',
      tone: 'Casual & Relatable',
      visualStyle: 'Cinematic Lifestyle Photography',
      language: 'English'
    }
  },

  // 7. Academic & Education
  {
    id: 'workshop_poster',
    categoryId: 'education',
    categoryName: 'Academic & Education',
    title: 'Educational Workshop Poster',
    description: 'Promote student bootcamps, masterclasses, webinars, and certification programs.',
    supportedOutputs: ['text', 'image'],
    defaultOutputs: ['text', 'image'],
    aspectRatio: '3:4',
    fields: [
      { name: 'workshopTitle', label: 'Workshop / Masterclass Title', type: 'text', placeholder: 'e.g. Generative AI with Python & PyTorch', required: true },
      { name: 'instructor', label: 'Instructor / Speaker Name & Credentials', type: 'text', placeholder: 'e.g. Dr. Alex Morgan (Ex-Google AI Researcher)', required: true },
      { name: 'dateAndTime', label: 'Date, Time & Duration', type: 'text', placeholder: 'e.g. Saturday, Oct 28 | 10:00 AM - 1:00 PM IST', required: true },
      { name: 'syllabus', label: 'What Students Will Learn', type: 'textarea', placeholder: 'e.g. Transformers, Fine-tuning LLMs, Vector DBs, Building an AI Agent from scratch', required: true },
      { name: 'perks', label: 'Perks / Certification', type: 'text', placeholder: 'e.g. Certificate of Completion + Free GitHub code templates', required: false }
    ],
    defaultPreferences: {
      platform: 'College Portal / LinkedIn',
      tone: 'Educational & Encouraging',
      visualStyle: 'Modern Academic Tech Blueprint',
      language: 'English'
    }
  },

  // 8. Personal
  {
    id: 'motivational_quote',
    categoryId: 'personal',
    categoryName: 'Greetings & Quotes',
    title: 'Motivational Quote & Poster',
    description: 'Daily motivation cards, inspiring words, reflections, and wallpaper-ready designs.',
    supportedOutputs: ['text', 'image'],
    defaultOutputs: ['text', 'image'],
    aspectRatio: '1:1',
    fields: [
      { name: 'theme', label: 'Theme / Sentiment', type: 'text', placeholder: 'e.g. Overcoming self-doubt and persevering in tech', required: true },
      { name: 'quoteAuthor', label: 'Author or Attributed Source', type: 'text', placeholder: 'e.g. Steve Jobs / Anonymous / Original', required: false },
      { name: 'personalMessage', label: 'Additional Thought or Reflection', type: 'textarea', placeholder: 'e.g. Every expert coder was once a beginner who refused to quit on a compiler error.', required: false }
    ],
    defaultPreferences: {
      platform: 'Instagram / Wall Art',
      tone: 'Inspirational & Uplifting',
      visualStyle: 'Minimalist Typography with Scenic Sunrise',
      language: 'English'
    }
  }
];

const getCategories = () => categories;

const getContentTypes = (categoryId = null) => {
  if (categoryId) {
    return contentTypes.filter((t) => t.categoryId === categoryId);
  }
  return contentTypes;
};

const getContentTypeById = (id) => {
  return contentTypes.find((t) => t.id === id) || null;
};

module.exports = {
  getCategories,
  getContentTypes,
  getContentTypeById
};
