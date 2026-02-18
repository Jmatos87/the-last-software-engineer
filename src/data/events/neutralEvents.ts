import type { EventDef } from '../../types';

// ═══════════════════════════════════════════════════════════════
// NEUTRAL — General + Risk/Reward Events
// ═══════════════════════════════════════════════════════════════

export const neutralEvents: EventDef[] = [
  {
    id: 'abandoned_repo',
    title: 'Abandoned Repository',
    description: 'You\'ve stumbled upon a GitHub repo with 11,400 stars, last commit: 4 years ago. The README says "PRs welcome." Nobody came. The contributor graph is a flatline EKG. The creator\'s profile says "Founder @ something" — the something dissolved in 2020.\n\nThe issues tab is a graveyard of hopes. "Still maintained?" asks a post from 2022. "Is this dead?" asks another from 2023. The pinned response from the maintainer reads: "Taking a short break!" The break began in January. Of a year that no longer exists.\n\nBut there\'s something here. The code is old but clever. Someone loved this once. Maybe there\'s treasure in the ruins, or at the very least, a mug with a faded startup logo that still holds coffee.',
    icon: '📁',
    choices: [
      {
        text: 'Fork and study the code (+1 random card)',
        outcome: { addCard: 'random_common', message: 'You learned a new technique from code older than your career. Some things age like wine. This aged like milk. You still learned something.' },
      },
      {
        text: 'Mine it for cryptocurrency (+30 gold)',
        outcome: { gold: 30, message: 'The repo had a hidden crypto wallet script buried in a 2018 branch. Ethical? Unclear. Profitable? Extremely.' },
      },
      {
        text: 'Salvage a relic from the repo (Gain Company Swag Mug)',
        outcome: { addItem: 'company_swag_mug', message: 'You found a dusty mug with a faded startup logo. The startup is gone. The mug endures. It still holds coffee. It always will.' },
      },
      {
        text: 'Walk away',
        outcome: { message: 'You close the browser tab. The repo remains, perfectly preserved in amber, waiting for a maintainer who will never come. Moment of silence.' },
      },
    ],
  },
  {
    id: 'coffee_machine',
    title: 'The Coffee Machine',
    description: 'You\'ve found a pristine espresso machine tucked in an abandoned break room. Not the drip machine your previous employer had — the one that produces beige water and regret. This is a real one. Italian. Shiny. The kind that has a name and a waiting list.\n\nIt still has beans. The beans are fresh. Whoever left this here either forgot it existed or made a very difficult choice. You pour a shot. The aroma hits you like a memory of a better job. Your hands stop shaking for the first time in weeks.\n\nYou could drink this. You could also sell this. The machine goes for $800 on eBay in "good condition." This is better than good condition. This is miraculous condition.',
    icon: '☕',
    choices: [
      {
        text: 'Drink the coffee (Heal 15 HP)',
        outcome: { hp: 15, message: 'It\'s perfect. Smooth, dark, complex — everything your current situation is not. You feel rejuvenated. You feel capable. You feel like maybe things will be okay. (They might not be. But you feel it.)' },
      },
      {
        text: 'Sell the machine (+25 gold)',
        outcome: { gold: 25, message: 'Listed it. Got $25 in under an hour. The buyer texted six times before pickup asking if it "still makes good coffee." You said yes. You don\'t know.' },
      },
    ],
  },
  {
    id: 'hackathon',
    title: 'Hackathon',
    description: 'A hackathon is in progress. "24 hours to change the world!" screams the banner. The prize is a $100 Amazon gift card and a blog post from the CTO titled something like "Our Community of Innovators." There is free pizza. The pizza is from a place called "Pizza Express" that is neither quick nor excellent.\n\nThe other competitors are: a team of three CS grad students who have clearly been planning this for months, a product manager who keeps calling their idea "an AI-powered disruption play," and one guy who arrived alone, headphones on, laptop stickered beyond recognition, who has not spoken since registration and is already somehow winning.\n\nYou have nine hours left. The idea is partially formed. The demo is theoretical. The confidence is manufactured. This is hackathon culture at its purest.',
    icon: '🏆',
    choices: [
      {
        text: 'Compete! (Lose 8 HP, gain a card)',
        outcome: { hp: -8, addCard: 'random_rare', message: 'You won. The grad students were faster but your pivot at hour 20 was inspired. You pitched "Uber for dog feelings" with full conviction. The judges nodded. You got the Amazon gift card. You will never cash it in. It will live in your email forever.' },
      },
      {
        text: 'Judge instead (+20 gold)',
        outcome: { gold: 20, message: 'You slid into the judge role by simply wearing a lanyard and looking like you belonged there. Easy money for nodding and saying "tell me more about the monetization strategy." Nobody questioned you once.' },
      },
      {
        text: 'Skip it',
        outcome: { message: 'Not today. You watched the chaos from the lobby, ate two free slices of pizza, and left. The PM\'s AI disruption play won second place. You feel nothing. You feel everything.' },
      },
    ],
  },
  {
    id: 'code_mentor',
    title: 'Code Mentor',
    description: 'A senior developer has offered to mentor you. Their GitHub has 847 public repositories and zero followers. Their LinkedIn says they have "30+ years of experience" and describe themselves as a "thought leader." Their Calendly is wide open.\n\n"I can teach you to code better," they say, "but first you have to unlearn everything you think you know." They have a very specific energy. They have opinions about tabs vs spaces. The opinions are long. You\'ve been here twelve minutes.\n\nThey do actually know their stuff. Distressingly well. Their feedback on your code was surgical. You have three options and none of them involve escaping without consequence.',
    icon: '👨‍💻',
    choices: [
      {
        text: 'Accept mentoring (Remove a chosen card)',
        outcome: { removeChosenCard: 1, message: 'They spent 90 minutes telling you why one of your go-to techniques was actively harmful. You deleted it from your memory and your deck. Your code is leaner. You are emotionally thinner.' },
      },
      {
        text: 'Ask for money instead (+15 gold)',
        outcome: { gold: 15, message: '"Actually, I\'m doing consulting rates these days. $150 per session." The mentor sighed, reached into a worn leather wallet, and paid you. You will think about this interaction for years.' },
      },
    ],
  },
  {
    id: 'server_room',
    title: 'The Server Room',
    description: 'The server room is 65°F and smells like ozone and old ambition. Blinking lights cascade across racks that haven\'t been audited since the Obama administration. A laminated sign on the door reads: "AUTHORIZED PERSONNEL ONLY." The lamination is peeling. The door was unlocked.\n\nOne rack has a sticky note that says "DO NOT UNPLUG — CRITICAL." It is not plugged into anything visible. A server labeled "PROD-DB-01" is running Windows XP. Its uptime counter shows 2,847 days. You know better than to touch it. Your palms are sweating anyway.\n\nIn the corner, a cardboard box marked "DECOMMISSIONED — DO NOT REUSE" sits unopened. Inside: RAM, two SSDs, an old pager, and what appears to be an envelope of cash with no label and no explanation. The server room provides.',
    icon: '🏢',
    choices: [
      {
        text: 'Scavenge for parts (+40 gold, lose 10 HP)',
        outcome: { gold: 40, hp: -10, message: 'You got shocked by a loose cable and knocked over a UPS. The UPS beeped. You ran. You are fine. You have $40 in components and a new respect for grounding wires.' },
      },
      {
        text: 'Grab the on-call pager (Gain On-Call Rotation artifact)',
        outcome: { addItem: 'on_call_rotation', hp: -5, message: 'The pager vibrated the moment you picked it up. The message was from 2019. You are now on-call for a system you\'ve never seen. The rotation started immediately. This is your life now.' },
      },
      {
        text: 'Meditate among the servers (Heal 20 HP)',
        outcome: { hp: 20, message: 'You sat cross-legged on the floor between two racks and breathed deeply. The hum of 200 fans became white noise. The weight of your career dissolved into the 65-degree air. You feel restored. The servers continue running. As they always have. As they always will.' },
      },
    ],
  },

  // ── Risk/Reward Events ──

  {
    id: 'whiteboard_interview',
    title: 'The Whiteboard Interview',
    description: 'An interviewer slides a dry-erase marker across the table. It stops in front of you like a challenge. "Reverse a binary tree. On the whiteboard. While explaining your thought process aloud." There is a second interviewer in the corner you didn\'t notice until just now. They have a rubric.\n\nYour thought process is currently: heart rate, blood pressure, a highlight reel of every data structures course you half-finished. You think about Linus Torvalds once tweeting that whiteboard interviews are worthless. This thought does not help you. The marker is in your hand. The board is very white.\n\nYou can do this. You\'ve done this before. You brute-forced your way through a medium LeetCode at 11 PM last Thursday and it only took four hours. This will be fine.',
    icon: '📋',
    choices: [
      {
        text: 'Solve it perfectly (Upgrade random card, lose 12 HP)',
        outcome: { upgradeRandomCard: true, hp: -12, message: 'You nailed it. The second interviewer stopped writing mid-rubric. The first one slow-clapped without irony. You walked out into the parking lot, sat on a curb, and stared at the middle distance for several minutes. Your brain is on fire. In a good way. Probably.' },
      },
      {
        text: 'Brute force it (Gain random common, lose 5 HP)',
        outcome: { addCard: 'random_common', hp: -5, message: 'O(n²) and completely inelegant, but it compiled and it ran. "We\'ll be in touch," they said. The particular way they said it told you everything. You learned something anyway.' },
      },
      {
        text: 'Refuse to whiteboard (+30 gold, gain 15 stress)',
        outcome: { gold: 30, stress: 15, message: '"I don\'t believe whiteboard coding reflects real-world performance. I\'m happy to discuss systems design or review an actual codebase." You stormed out. Sent an invoice for your time. They paid it. You will never stop thinking about this.' },
      },
    ],
  },
  {
    id: 'recruiter_dm',
    title: 'The Recruiter\'s DM',
    description: '"Hi [Name]! I came across your profile and I think you\'d be an AMAZING fit for an exciting opportunity at a Series A startup disrupting [INDUSTRY]!" The message is 400 words. It mentions "passionate team" four times. It mentions salary zero times.\n\nThe role is "Senior Full Stack Engineer." The company is "like Airbnb but for [thing]." The compensation is "competitive." You know what competitive means. You know what unlimited PTO means. You know the Series A they raised was $3M in 2021 and the runway math is concerning.\n\nAnd yet. The recruiter has 1,200 connections and a smile that costs money to produce. They want "just 15 minutes to explore alignment." Fifteen minutes is never fifteen minutes. But the message was personalized. Kind of. Your name is spelled correctly.',
    icon: '💬',
    choices: [
      {
        text: 'Take the call (Upgrade random card, gain 10 stress)',
        outcome: { upgradeRandomCard: true, stress: 10, message: 'The call lasted 90 minutes. The recruiter was actually great. The role is real. The salary is... a number. You learned things about the market. Your ear is numb. You have a follow-up scheduled. This is how it starts.' },
      },
      {
        text: 'Counter with salary demands (+50 gold, lose 8 HP)',
        outcome: { gold: 50, hp: -8, message: '"I require $500k base, $2M in equity, a dedicated GPU, and no meetings before noon." You typed this as a joke. They replied "let me see what we can do." You are now in active conversation. Your heart rate is elevated. The negotiation has claimed some of your life force.' },
      },
      {
        text: 'Mark as spam (Remove chosen card, reduce 10 stress)',
        outcome: { removeChosenCard: 1, stress: -10, message: 'Blocked. Filtered. Reported. Three clicks and it\'s done. You feel lighter. You feel clean. One card from your deck — a dead weight you\'ve been dragging around — goes with it. Some losses are gains.' },
      },
    ],
  },
  {
    id: 'oss_maintainer',
    title: 'The Open Source Maintainer',
    description: 'A developer approaches. They have the look — the particular haunted quality of someone who has spent three years answering the same GitHub issue worded seventeen different ways. Their project has 50,000 weekly downloads. It has zero sponsors. There are 847 open issues. One of them is marked "critical" and is from 2021 and has 200 upvotes and no comments from the maintainer because the maintainer stopped responding in March.\n\n"Please," they say, "I just need someone to review PRs sometimes. Maybe handle releases. Shouldn\'t take more than a few hours a week." Their last commit was to update the README to say "looking for maintainers." The commit message was: "help."\n\nThis project is a critical dependency for 40% of npm. If it dies, things will break. If you take it on, you might also break. The maintainer is handing you something precious and terrible. Their eyes say: "I\'m so tired."',
    icon: '🌟',
    choices: [
      {
        text: 'Accept the project (Upgrade random card, gain 20 stress)',
        outcome: { upgradeRandomCard: true, stress: 20, message: 'You\'re a maintainer now. In the first week: 47 new issues, 12 PRs, a critical vulnerability report, and a user who opened three duplicates and got mad when you linked them. You learned things. Painful, structural things. The stress is high. The badge is real.' },
      },
      {
        text: 'Donate to them (Lose 35 gold, heal 25 HP, reduce 15 stress)',
        outcome: { gold: -35, hp: 25, stress: -15, message: 'You hit the GitHub Sponsors button. They got the notification mid-issue-response. They cried — a small, specific kind of crying that happens when someone is seen after a long time of not being seen. Open source is beautiful and thankless and you just made it slightly less thankless.' },
      },
      {
        text: 'Ghost them (Gain 10 stress)',
        outcome: { stress: 10, message: 'You walked away. You told yourself you\'d circle back. You didn\'t. The guilt arrives at 2 AM every few weeks, right before you use their library in production. Again.' },
      },
    ],
  },
  {
    id: 'performance_review',
    title: 'The Performance Review',
    description: 'The calendar invite appeared six weeks ago. Subject: "Q3 Development Opportunity Conversation." Everyone in the office received one. Nobody calls it what it is. The invite had no agenda attached. The agenda is your entire worth as an employee, distilled into a 1-5 rating scale across twelve competencies.\n\nYou\'ve been told to self-assess. The rubric is three pages. It uses the word "demonstrates" forty-seven times. You are to "demonstrate leadership," "demonstrate ownership," "demonstrate a growth mindset." You are demonstrating the growth mindset right now by reading this rubric at 10 PM the night before.\n\nYour manager has scheduled 30 minutes. The average review takes 45. The overtime is not compensated. The feedback will either devastate or mildly disappoint. There is no third outcome. The spreadsheet is open.',
    icon: '📊',
    choices: [
      {
        text: 'Exceed expectations (Upgrade random card, lose 15 HP)',
        outcome: { upgradeRandomCard: true, hp: -15, message: 'You presented a 30-slide impact deck with quantified outcomes and stakeholder testimonials. Your manager wrote "strong performer" in the system. You got a 3% raise. The market rate is 15% higher. The skill you gained is real. The exhaustion is also real.' },
      },
      {
        text: 'Meets expectations (+20 gold, gain 10 stress)',
        outcome: { gold: 20, stress: 10, message: '"Solid performance. Consistent contributor." The most lukewarm compliment in the history of HR language. You received a spot bonus equivalent to one tank of gas. You went home and lay on the floor for a while. The floor was helpful.' },
      },
      {
        text: 'Self-review: "I\'m a rockstar" (Heal 20 HP, gain 15 stress)',
        outcome: { hp: 20, stress: 15, message: 'You rated yourself 5/5 across all twelve competencies. You wrote 600 words in the self-assessment box. Your manager read it with an expression you couldn\'t interpret. They said "interesting perspective" and scheduled a follow-up. The confidence healed something. The follow-up created something else.' },
      },
    ],
  },
  {
    id: 'salary_negotiation',
    title: 'The Salary Negotiation',
    description: 'The offer letter arrived at 4:47 PM on a Friday. They always arrive at 4:47 PM on a Friday. "We\'re thrilled to extend this opportunity," it begins. The number at the bottom is... a number. It exists. It is technically enough to live on, if you live carefully and never get sick and don\'t have student loans and rent hasn\'t gone up since 2019.\n\nYou\'ve done the research. Glassdoor. Levels.fyi. That anonymous Slack in your industry where people sometimes post their comp. The market says this offer is 22% below the median. The offer includes "unlimited PTO" and "equity with a 4-year cliff." You know what unlimited PTO means. You\'ve seen the cliff.\n\nThe recruiter\'s email says "offer expires Monday." It always expires Monday. The Monday deadline is theater. You have the weekend. You have data. You have exactly one shot at this number before you\'re locked in for eighteen months minimum. The cursor is on the reply button.',
    icon: '💰',
    choices: [
      {
        text: 'Counter aggressively (+60 gold, lose 15 HP)',
        outcome: { gold: 60, hp: -15, message: '"I have a competing offer at 40% above this number." You don\'t. They don\'t know that. "We can make this work," they said, and then they did. The negotiation left marks. Physical ones, somehow. But the comp is right. Worth it.' },
      },
      {
        text: 'Accept gracefully (+25 gold, gain 15 stress)',
        outcome: { gold: 25, stress: 15, message: 'You replied "this looks great, I\'ll sign by EOD." The recruiter messaged back within sixty seconds — something that has never happened before or since. "Usually people negotiate," they said. You will think about this on your commute. Every commute. For as long as you have this job.' },
      },
      {
        text: 'Leak the offer on Blind (Remove chosen card, +40 gold)',
        outcome: { removeChosenCard: 1, gold: 40, message: 'Anonymous post. Title: "Is [COMPANY] lowballing everyone or just me?" 200 upvotes in one hour. HR panicked. An all-hands was called. Everyone got a "compensation review." You got a raise. And then a severance package. Worth it? You\'re still deciding.' },
      },
    ],
  },
  {
    id: 'vendor_pitch',
    title: 'The Vendor Pitch',
    description: 'The calendar invite said "Partnership Discussion (30 min)" and you accepted thinking it was internal. It was not. There is a man. He has AirPods Pro. He has a MacBook with a company sticker on it that reads the company name in a font that was very expensive. He is already twelve slides into a deck called "Transforming Your Infrastructure Journey."\n\nThe product is AI-powered. Everything is AI-powered. The AI is a regex expression wrapped in a loading animation. The case study is a company you\'ve never heard of. The logo tier slide has one logo on it and it is their own logo. Slide 31 says "Questions?" in 72-point font. You are on slide 16. There are 47 slides.\n\nHe has not made eye contact since slide 4. He is reading the slides. You know this because you can see his eyes moving. There is a QR code. You are not going to scan the QR code. There is free swag on the table. You are going to take the swag.',
    icon: '📢',
    choices: [
      {
        text: 'Endure the full pitch (Gain random rare card, gain 20 stress)',
        outcome: { addCard: 'random_rare', stress: 20, message: 'You survived all 47 slides. The Q&A lasted 40 minutes. Somewhere in slides 32-38, buried under three layers of jargon, was an actually interesting architecture pattern. You wrote it down on a branded notepad. The notepad was good. The pen was better.' },
      },
      {
        text: 'Steal their free swag (+30 gold)',
        outcome: { gold: 30, message: 'You grabbed five branded water bottles, two notebooks, a premium pen, and a stress ball shaped like a server rack. "That\'s not — " the vendor started. You were already at the door. Their loss. Your gain. Literally.' },
      },
      {
        text: 'Flip the table (Lose 10 HP, reduce 20 stress)',
        outcome: { hp: -10, stress: -20, message: 'You flipped the demo table. The laptop went one way. The slide clicker went another. Security escorted you out through the lobby in full view of the reception desk. You said nothing. They said nothing. The vendor is still on slide 23. The clarity you feel is real and total and worth every bit of the bruised hip.' },
      },
    ],
  },
  {
    id: 'imposter_spiral',
    title: 'The Imposter Syndrome Spiral',
    description: 'It started with a PR comment. "Might be worth reconsidering this approach?" Just a suggestion. Casual. You\'ve been staring at your own code for two hours wondering if you\'ve ever written anything real.\n\nYou Googled "how to know if you\'re a bad programmer." The first result is a blog post from 2013 by someone who now works at Google. They have a smiling photo. You read the post. You read the comments. A commenter said "if you\'re asking the question, you\'re probably fine." This did not help. You read 40 more comments. Three of them were worse than you in ways that should have been reassuring but weren\'t.\n\nYou look at the code again. It\'s actually good? You didn\'t write this. You definitely wrote this. There\'s your name in the git blame right there. You have a decision to make about how to feel about yourself and you need to make it now.',
    icon: '🎭',
    choices: [
      {
        text: 'Confront your fears (Upgrade random card, lose 10 HP, gain 10 stress)',
        outcome: { upgradeRandomCard: true, hp: -10, stress: 10, message: 'You accepted — out loud, to yourself, in the bathroom — that you are competent. That you earned your seat. That the PR comment was feedback, not a verdict. It was the hardest thing you\'ve said this year. You came back to your desk and refactored something you\'d been afraid to touch for months. It went fine.' },
      },
      {
        text: 'Fake it till you make it (+25 gold)',
        outcome: { gold: 25, message: '"I designed the entire distributed caching layer," you said in the meeting, with complete conviction. You copy-pasted it from a Stack Overflow answer in 2021. The answer had 847 upvotes. It was a good answer. You presented it with such confidence that two colleagues took notes. Fake it until it becomes real. It\'s becoming real.' },
      },
      {
        text: 'Have a breakdown (Lose 20 HP, reduce 25 stress)',
        outcome: { hp: -20, stress: -25, message: 'You cried in the single-occupancy bathroom for 25 minutes. Not spiral-crying. Productive crying — the kind that releases pressure and resets the system. You came out feeling scoured clean. You ate a granola bar. You read no more comments for the rest of the day. This was the right call.' },
      },
    ],
  },
  {
    id: 'unpaid_internship',
    title: 'The Unpaid Internship',
    description: 'The LinkedIn posting went up at 9 AM. By 9:23 AM there were 200 applicants. By 9:47 AM there were 400. The job requires five years of experience, proficiency in React, Node, Python, and "a passion for disrupting traditional paradigms." The compensation is "academic credit and exposure." The exposure is to the inside of an open floor plan office with no windows.\n\nThe Glassdoor rating is 2.7. The top review says "great if you don\'t need money or sleep." The CEO replied to the review: "We\'re always looking for ways to improve! Please DM me directly." Nobody DMed. The DM offer stands. It will always stand.\n\nYou need the line on your resume. You also need groceries. These facts are in direct conflict. A decision is required.',
    icon: '🎓',
    choices: [
      {
        text: 'Take it for experience (Upgrade random card, lose 30 gold)',
        outcome: { upgradeRandomCard: true, gold: -30, message: 'You took it. The work was real. The experience was real. The commute was real ($30 round-trip). The ramen was real. You learned things you couldn\'t have learned anywhere else and paid for them in the oldest currency: your twenties. The card in your deck is better. So are you, technically.' },
      },
      {
        text: 'Demand payment (+40 gold)',
        outcome: { gold: 40, message: '"My time has market value. I\'ll need $25/hour and expense reimbursement." They were so thrown off by the confidence that they just... agreed. They had budget. They always had budget. They just didn\'t expect to be asked. The lesson here is worth more than the money.' },
      },
      {
        text: 'Report to labor board (Remove chosen card, heal 15 HP)',
        outcome: { removeChosenCard: 1, hp: 15, message: 'You filed the complaint. The review took six weeks. The company got a citation and was required to pay interns going forward. The intern who replaced you makes $18/hour. You never saw a dime. You sleep fine. Better than fine, actually.' },
      },
    ],
  },
];
