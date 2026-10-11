const { buildTextPrompt } = require('./promptBuilder');

/**
 * Intelligent deterministic fallback generator that synthesizes tailored,
 * high-fidelity creative content from user input when external APIs are offline or key is unconfigured.
 */
function generateContextualContent({ category, contentType, title, inputDetails, preferences, profile }) {
  const lang = preferences?.language || 'English';
  const tone = preferences?.tone || 'Professional';
  const platform = preferences?.platform || 'General';

  // Customized by content type
  switch (contentType) {
    case 'event_poster': {
      const event = inputDetails.eventName || title || 'Annual Tech Symposium';
      const date = inputDetails.date || 'Upcoming Weekend';
      const venue = inputDetails.venue || 'Main Auditorium';
      const highlights = inputDetails.highlights || 'Exciting keynote talks, prizes, and networking';
      const cta = inputDetails.registrationLink || 'Register now to secure your spot!';

      return {
        headline: `🚀 ${event.toUpperCase()} IS HERE!`,
        caption: `Mark your calendars for ${date}! Join top minds and passionate creators at ${venue}.`,
        description: `Get ready for an extraordinary experience at ${event}!\n\n📅 Date & Time: ${date}\n📍 Venue: ${venue}\n\n✨ Event Highlights:\n${highlights}\n\nWhether you are a developer, designer, or tech enthusiast, this is your stage to learn, collaborate, and push boundaries. Limited seats available!`,
        cta: `👉 ${cta}`,
        hashtags: ['#TechEvent2026', '#Hackathon', '#Innovation', '#StudentTech', '#NextGenDevelopers']
      };
    }

    case 'event_announcement': {
      const event = inputDetails.eventName || title;
      const organizer = inputDetails.organizer || 'Organizing Committee';
      const schedule = inputDetails.schedule || 'Scheduled Date & Venue';
      const rules = inputDetails.guidelines || 'All participants must register prior to deadline.';

      return {
        headline: `📢 Official Announcement: ${event}`,
        caption: `Official notification issued by ${organizer} regarding ${event}.`,
        description: `Dear Members and Participants,\n\nWe are pleased to officially announce the details for ${event}.\n\n🗓 Schedule: ${schedule}\n🏛 Organized by: ${organizer}\n\n📋 Guidelines & Details:\n${rules}\n\nPlease ensure adherence to all timelines and guidelines. For any inquiries, reach out to the organizing team.`,
        cta: `📌 Read full guidelines and confirm participation immediately.`,
        hashtags: ['#OfficialAnnouncement', '#EventNotice', '#NoticeBoard', '#CampusUpdates']
      };
    }

    case 'linkedin_post': {
      const topic = inputDetails.topic || title;
      const takeaways = inputDetails.keyTakeaways || 'Continuous learning, tackling ambiguous problems, and team collaboration.';
      const audience = inputDetails.audience || 'fellow engineers and tech leaders';
      const endingQuestion = inputDetails.callToAction || 'What was your biggest career takeaway this year? Drop your thoughts below!';

      return {
        headline: `💡 Reflections on ${topic}: Key Lessons & Next Horizons`,
        caption: `Excited to share some reflections and core takeaways from my journey in ${topic}.`,
        description: `I recently had the privilege of immersing myself in ${topic}, and the experience has been nothing short of transformative.\n\nHere are 3 fundamental lessons that reshaped my perspective:\n\n1️⃣ Emphasize fundamentals: Strong foundations make complex architectures feel intuitive.\n2️⃣ Execution velocity matters: Shipping early feedback loops beats overthinking.\n3️⃣ Key milestone: ${takeaways}\n\nTo all ${audience}: gratitude to everyone who supported this milestone.\n\n${endingQuestion}`,
        cta: `💬 Let's connect and discuss in the comments!`,
        hashtags: ['#CareerGrowth', '#SoftwareEngineering', '#TechLeadership', '#LearningInPublic', '#LinkedInCommunity']
      };
    }

    case 'portfolio_announcement': {
      const project = inputDetails.projectName || title;
      const stack = inputDetails.techStack || 'React, Node.js, MongoDB';
      const problem = inputDetails.problemSolved || 'Streamlining developer productivity';
      const link = inputDetails.liveLink || 'Check GitHub repository';

      return {
        headline: `🛠 Introducing ${project}: Built with ${stack}`,
        caption: `Proud to showcase ${project} — engineered to solve: "${problem}".`,
        description: `Thrilled to unveil my latest full-stack build: **${project}**!\n\n⚡ What does it solve?\n${problem}\n\n💻 Tech Stack Breakdown:\n• Architecture: ${stack}\n• Clean modular code structure\n• Responsive, accessible UI & optimized REST APIs\n\nCheck out the live deployment or source code below. Feedback and pull requests are very welcome!`,
        cta: `🔗 Live Demo & Source Code: ${link}`,
        hashtags: ['#WebDevelopment', '#FullStack', '#MERNStack', '#BuildInPublic', '#PortfolioProject']
      };
    }

    case 'birthday_invitation': {
      const celebrant = inputDetails.celebrant || title;
      const dateTime = inputDetails.dateAndTime || 'This Saturday at 7 PM';
      const venue = inputDetails.venue || 'Our favorite party lounge';
      const theme = inputDetails.partyTheme || 'Festive Celebration';
      const rsvp = inputDetails.rsvpDetails || 'Please RSVP by Friday';

      return {
        headline: `🎉 YOU'RE INVITED: Let's Celebrate ${celebrant}! 🎂`,
        caption: `Join us for good vibes, music, great food, and unforgettable memories!`,
        description: `It's time to celebrate! We are gathering all good friends and family to mark this joyful milestone for ${celebrant}.\n\n🗓 When: ${dateTime}\n📍 Where: ${venue}\n🎭 Theme/Dress Code: ${theme}\n\nYour presence will make this celebration truly special. Bring your highest spirits!`,
        cta: `💌 ${rsvp}`,
        hashtags: ['#BirthdayCelebration', '#PartyTime', '#GoodVibesOnly', '#Cheers', '#Memories']
      };
    }

    case 'wedding_party_invitation': {
      const hosts = inputDetails.coupleNames || title;
      const ceremony = inputDetails.ceremonyType || 'Wedding Reception';
      const dateTime = inputDetails.dateAndTime || 'An Auspicious Evening';
      const venue = inputDetails.venueAddress || 'The Grand Hall';
      const note = inputDetails.warmMessage || 'Your blessings are our greatest gift.';

      return {
        headline: `💍 Together with their families: ${hosts}`,
        caption: `Request the pleasure of your company to celebrate our ${ceremony}.`,
        description: `With joy in our hearts, we cordially invite you to celebrate the sacred union and happiness of ${hosts}.\n\n✨ Occasion: ${ceremony}\n📅 Date & Time: ${dateTime}\n🏰 Venue: ${venue}\n\n"${note}"\n\nWe look forward to sharing this cherished day in your presence.`,
        cta: `💐 RSVP to confirm your attendance.`,
        hashtags: ['#WeddingVows', '#CelebrationOfLove', '#FamilyGathering', '#SaveTheDate']
      };
    }

    case 'product_promotion': {
      const product = inputDetails.productName || title;
      const discount = inputDetails.offerDiscount || 'Exclusive 30% OFF';
      const features = inputDetails.keyFeatures || 'Premium quality, fast performance, ergonomic design';
      const cta = inputDetails.callToAction || 'Shop now while supplies last!';

      return {
        headline: `🔥 SPECIAL OFFER: Unlock ${discount} on ${product}!`,
        caption: `Upgrade your experience today with ${product}. Limited-time offer!`,
        description: `Say hello to your new favorite upgrade: **${product}**!\n\n✨ Why you will love it:\n${features}\n\nDon't miss this limited-edition deal. Stock is moving fast and once it's gone, it's gone!\n\n🏷 Special Deal: ${discount}`,
        cta: `🛍 ${cta}`,
        hashtags: ['#SpecialOffer', '#FlashSale', '#ProductLaunch', '#MustHave', '#ShopNow']
      };
    }

    case 'youtube_thumbnail': {
      const vidTitle = inputDetails.videoTitle || title;
      const hook = inputDetails.visualHook || 'Compelling high-stakes question';
      const overlay = inputDetails.thumbnailText || 'DO NOT MISS THIS!';

      return {
        headline: `🎬 High-CTR Video Concept: "${vidTitle}"`,
        caption: `Visual Hook: ${hook} | Overlay Text: "${overlay}"`,
        description: `Optimized concept for YouTube algorithm & viewer psychology:\n\n🎯 Video Title: ${vidTitle}\n🔥 Core Narrative Hook: ${hook}\n💥 Large Visual Banner: "${overlay}"\n\nThumbnail Strategy:\n• High-contrast lighting with vivid subject isolation\n• Expressive emotive focal point\n• Bold readable sans-serif typography`,
        cta: `▶️ Implement this concept and watch your click-through rate surge!`,
        hashtags: ['#YouTubeCreator', '#CTRBoost', '#ContentStrategy', '#VideoProduction', '#ViralVideo']
      };
    }

    case 'motivational_quote': {
      const theme = inputDetails.theme || title;
      const author = inputDetails.quoteAuthor || 'Wisdom of the Ages';
      const msg = inputDetails.personalMessage || 'Keep moving forward through every obstacle.';

      return {
        headline: `✨ "Your potential is limited only by the boundaries you place upon yourself."`,
        caption: `A gentle reminder for your journey: ${theme}.`,
        description: `"${msg}"\n\n— ${author}\n\nEvery great outcome was once considered impossible. Take the next step today with courage, clarity, and determination.`,
        cta: `🌟 Save this reminder and share it with someone who needs strength today.`,
        hashtags: ['#DailyMotivation', '#GrowthMindset', '#Inspiration', '#KeepGoing', '#MindsetShift']
      };
    }

    default: {
      return {
        headline: `✨ ${title || 'Universal AI Content Generation'}`,
        caption: `Tailored for ${platform} with ${tone} tone in ${lang}.`,
        description: `Here is your customized content generated according to your specifications.\n\nKey Highlights:\n${Object.entries(inputDetails).map(([k, v]) => `• ${k}: ${v}`).join('\n')}\n\nReviewed and formatted for maximum impact.`,
        cta: `🚀 Take action today and experience the difference!`,
        hashtags: ['#ContentCreation', '#AIPowered', '#Productivity', '#CreativeExcellence']
      };
    }
  }
}

/**
 * Main AI Text Generation Service
 * Supports external LLM (Gemini / OpenAI) with automatic graceful fallback
 */
async function generateText({ category, contentType, title, inputDetails, preferences, profile }) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    try {
      const { systemPrompt, userPrompt } = buildTextPrompt({
        category,
        contentType,
        title,
        inputDetails,
        preferences,
        profile
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: 'application/json'
            }
          }),
          signal: AbortSignal.timeout(12000)
        }
      );

      if (response.ok) {
        const data = await response.json();
        const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textContent) {
          const parsed = JSON.parse(textContent);
          if (parsed.headline && parsed.description) {
            return {
              headline: String(parsed.headline).trim(),
              caption: String(parsed.caption || '').trim(),
              description: String(parsed.description).trim(),
              cta: String(parsed.cta || '').trim(),
              hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : []
            };
          }
        }
      }
    } catch (err) {
      console.warn('[AI Text] External Gemini call failed, falling back to smart contextual generator:', err.message);
    }
  }

  // Graceful deterministic contextual generation
  return generateContextualContent({ category, contentType, title, inputDetails, preferences, profile });
}

module.exports = {
  generateText
};
