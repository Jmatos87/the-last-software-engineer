import type { EventDef } from '../../types';

// ═══════════════════════════════════════════════════════════════
// Consumable Events — Neutral + Class-Specific
// ═══════════════════════════════════════════════════════════════

export const consumableEvents: EventDef[] = [
  // ── Neutral Consumable Events ──

  {
    id: 'vending_machine_glitch',
    title: 'Vending Machine Glitch',
    description: 'The vending machine by the elevator bank is misbehaving. Not "sold out" misbehaving. Not "takes your dollar and gives nothing" misbehaving. The good kind: it accepted your card, dispensed your requested item, and then — without prompt — dispensed another one. And then a third. The coin return is rattling. Items are falling into the tray with the rhythm of a slot machine that has decided to give back.\n\nYou look left. You look right. The hallway is empty. The security camera in the corner has a piece of blue tape over the lens — someone got there before you, months ago, and you never noticed until now. The facilities manager checks these machines on the last Friday of the month. The last Friday of the month is three weeks away.\n\nYour laptop bag has a secondary compartment you\'ve never used. It could hold at least four items comfortably. A decision is forming.',
    icon: '🎰',
    choices: [
      {
        text: 'Grab everything you can (+2 common consumables, +10 stress)',
        outcome: { addConsumable: 'random_common_x2', stress: 10, message: 'You jammed both hands into the retrieval tray and grabbed until it stopped giving. Two items. You shoved them into your bag and walked away at a speed that was fast but not technically running. The stress comes from the next four days of wondering if anyone noticed. They didn\'t. You\'re almost sure they didn\'t.' },
      },
      {
        text: 'Take one carefully (+1 common consumable, +20 gold)',
        outcome: { addConsumable: 'random_common', gold: 20, message: 'You took one. Just one. The item you originally paid for. But the coin return kept rattling — quarters accumulated in the tray that you felt, morally, were yours by right of proximity. Twenty dollars in quarters. Heavy in the pocket. Light on the conscience. You left the rest.' },
      },
      {
        text: 'Walk away',
        outcome: { message: 'You did the right thing. You stepped back. You did not take what wasn\'t offered. The machine continued dispensing into an empty tray, alone. On your way back to your desk, you passed the facilities manager. They said nothing. They were looking at their phone. You will think about this for a long time.' },
      },
    ],
  },
  {
    id: 'senior_devs_desk',
    title: "The Senior Dev's Desk",
    description: 'They left three weeks ago. "Pursuing new opportunities," the all-hands said, which everyone understood to mean either "recruited out for 30% more" or "managed out with a quiet severance," and the energy of the announcement made the second option more likely. Their desk has not been cleared. Facilities is behind. The desk is, for now, a museum of a career: three monitors, a keyboard from a defunct manufacturer, a coffee mug that says "I Survived the AWS Outage of 2021" and means it.\n\nThe drawer is slightly open. Inside: premium tools, emergency supplies, and — tucked behind a dead plant — a Thermos that smells like it contains something that is not coffee but is performing coffee\'s spiritual function. They planned for collapse. They always plan for collapse. That\'s what separates seniors from the rest of us.\n\nNobody will know. The onboarding coordinator is three weeks behind on desk reassignment. The supplies are here. You are here. The question is what kind of person you are.',
    icon: '🧰',
    choices: [
      {
        text: 'Raid the good stuff (+1 rare consumable)',
        outcome: { addConsumable: 'random_rare', message: 'You found something premium in the back of the second drawer, wrapped in a Post-it that said "for real emergencies." This qualified. The item is high quality. The senior dev had good taste in emergency supplies. You take this as a parting lesson from someone who prepared better than you have.' },
      },
      {
        text: 'Leave a thank-you note (+25 gold)',
        outcome: { gold: 25, message: 'You left a Post-it that said "thank you for everything, the codebase is better for your time here." And then you took the petty cash from the pencil cup — $25 in fives — because it was just sitting there and they\'d want it to be useful. The note and the money feel proportional to each other somehow.' },
      },
      {
        text: 'Meditate at the empty desk (Heal 15 HP, -10 stress)',
        outcome: { hp: 15, stress: -10, message: 'You sat in the Herman Miller chair — the good one they brought from home and always swore they\'d take when they left, which they did not take, which tells you something about how the departure happened. The lumbar support was perfect. The desk was quiet. You stayed for twenty minutes. It was the most peaceful twenty minutes of your quarter.' },
      },
    ],
  },
  {
    id: 'conference_swag_table',
    title: 'Conference Swag Table',
    description: 'The conference ended an hour ago. The sponsor tables are being dismantled with the weary efficiency of people who have done this in seventeen cities this year. But the swag table for one company remains, abandoned — either forgotten or left intentionally for the scavengers, which at conferences is everyone once the sessions end.\n\nWhat remains at 5:15 PM on day two of a tech conference is a curated selection of the worst and the best. Branded pens that will all run out within a week. A stress ball shaped like a server rack. Three energy drinks in flavors that don\'t correspond to any real food. And, tucked behind the tablecloth, not on the table at all, resting against the table leg like it was placed there by someone who knew what they were doing: one premium item.\n\nA volunteer is watching. Loosely. They\'re scrolling. The premium item has a QR code on it. The QR code leads to a GitHub repo with 4,200 stars.',
    icon: '🎁',
    choices: [
      {
        text: 'Fill your bag (+2 common consumables, +5 stress)',
        outcome: { addConsumable: 'random_common_x2', stress: 5, message: 'You swept the table efficiently, making eye contact with the volunteer while doing it in the way that communicates "I belong here and this is fine." Two items acquired. The stress is from the two other people who had the same idea and arrived thirty seconds after you. Eye contact was made. Territorial feelings were felt.' },
      },
      {
        text: 'Go for the premium item (+1 rare consumable)',
        outcome: { addConsumable: 'random_rare', message: 'You reached past the stress balls and the branded pens and the energy drinks and found the item tucked against the table leg. Someone placed it there for someone like you. You are the intended recipient. The QR code leads to the repo. The repo is excellent. You star it. You keep the item.' },
      },
      {
        text: 'Sell your conference badge (+35 gold)',
        outcome: { gold: 35, message: 'Your VIP All-Access badge — actually general admission with a different lanyard color — sold to someone in the lobby who arrived on day two and needed in for the closing keynote. $35, cash, immediate handoff. You walked out of the conference with more money than you walked in with. This is the conference meta-game and you have mastered it.' },
      },
    ],
  },
  {
    id: 'code_archaeology',
    title: 'Code Archaeology',
    description: 'You were running `git log --all` to find when a certain function was introduced. You found it. But you also found something else: a commit from 2009. Author: `r.holloway@company.com` (email domain no longer active). Commit message: "initial implementation, probably works." The branch is `feature/the-big-one`, merged to main on a Friday.\n\nThe code is structured in a way that suggests the author had recently read the Gang of Four book and used every pattern in it for a single module. There are Factories, Observers, and one Decorator that\'s decorated a Singleton which has been subclassed. The comments are philosophical. "This is intentional," one says, without specifying what \'this\' refers to. Another says: "If you\'re reading this, I\'m sorry."\n\nOne function, at the very bottom, is called `emergencyFix`. It has been in production for fifteen years. It has no tests. Nobody knows exactly what it does. Your `git blame` shows it has not been modified since 2009. It runs on every request. Everything works.',
    icon: '🏺',
    choices: [
      {
        text: 'Study the ancient code (+1 rare consumable + upgrade random card, -10 HP)',
        outcome: { addConsumable: 'random_rare', upgradeRandomCard: true, hp: -10, message: 'You read every line. You traced every call. You mapped the entire Decorator-Singleton-Observer contraption on a piece of paper that is now three pages large. `emergencyFix` turns out to be a brilliant hack for a database inconsistency that was fixed at the DB level in 2017 but which still prevents a race condition nobody knew existed. Holloway was right. It was intentional. You feel the weight of fifteen years of invisible safety.' },
      },
      {
        text: 'Refactor it (Remove chosen card, heal 15 HP)',
        outcome: { removeChosenCard: 1, hp: 15, message: 'You rewrote it. Modern patterns. Tests. Documentation. The module is now elegant and explainable and half the size. You removed one card from your deck that had been doing the same kind of quietly complicated work — solved for free once the new clarity settled in. The codebase breathes better. Holloway\'s ghost seems neither pleased nor displeased.' },
      },
      {
        text: 'Add a TODO comment (+20 gold)',
        outcome: { gold: 20, message: '`// TODO: understand what this actually does and whether we still need it - 2026` You pushed the commit. Someone will find your comment in 2041. They will have the same conversation you\'re having now. The cycle continues. You\'ve been paid for the git log investigation. The tradition lives.' },
      },
    ],
  },

  // ── Class-Specific Consumable Events ──

  {
    id: 'npm_free_tier',
    title: 'NPM Free Tier Runs Out',
    description: 'Your CI pipeline failed at 2:47 AM with an error you\'ve never seen before. Not a test failure. Not a build error. A billing error. Your npm organization hit the free tier\'s private package limit and has been quietly refusing requests since 2:47 AM. Every build since then has failed. There have been seventeen builds since then — someone pushed eleven commits before they slept, which is a separate conversation.\n\nThe package in question is a private fork of a popular utility you forked in 2022 to fix a bug. The bug was fixed upstream in 2023. You never migrated back. The fork sits there, consuming private package quota, containing one modification that took four hours to make and would take thirty minutes to remove now that the upstream version is fixed.\n\nThe npm cache still has a warm copy. It\'s expired, technically. But it\'s there.',
    icon: '📦',
    class: 'frontend',
    choices: [
      {
        text: 'Raid the cache (+1 rare consumable, +5 stress)',
        outcome: { addConsumable: 'random_rare', stress: 5, message: 'You found a valid cached copy in `.npm/cache` and pointed the pipeline at it directly. It built. The builds started passing. The stress is from knowing you\'re technically running on cached state and the cache will eventually expire and this will happen again at 2 AM on a different Tuesday. But not today.' },
      },
      {
        text: 'Pay for premium (Lose 30 gold, +2 common consumables)',
        outcome: { gold: -30, addConsumable: 'random_common_x2', message: 'You upgraded the org plan. The pipeline started passing within ninety seconds of the billing update. You filed an expense report. The expense report was approved with a note that said "please evaluate whether this is still needed." It is not still needed. You know this. The evaluation is scheduled for Q3.' },
      },
      {
        text: 'Go open source (+20 gold)',
        outcome: { gold: 20, message: 'You deleted the private fork and published a clean public version of your fix — properly documented, with a test suite you wrote in the process of documenting it. The upstream maintainer merged a PR based on your write-up. A stranger starred your public fork within an hour. GitHub sent you a notification. $20 appeared from a sponsorship that had been pending. Community provides.' },
      },
    ],
  },
  {
    id: 'staging_is_down',
    title: 'Staging is Down (Again)',
    description: 'Staging is down. Not scheduled-downtime down. Not "someone forgot to restart the service" down. Down in a way that suggests something happened — the logs are corrupted, the database is in an inconsistent state, and the last successfully logged event is a deployment four days ago that "went fine" according to the Slack thread at the time.\n\nThe on-call rotation shows you\'re not on-call this week. You are looking at this anyway because your feature is blocked and QA needs staging to work and the feature is due on Friday and it is Wednesday. The on-call engineer is in a time zone where it is currently 3 AM. Their Slack status is 😴 and has been for four hours.\n\nIn the monitoring dashboard\'s wreckage, a few things are still intact. Resources that survived the incident, preserved in the parts of the system that didn\'t fall over. What you do with them is up to you.',
    icon: '🔥',
    class: 'backend',
    choices: [
      {
        text: 'Salvage from the wreckage (+1 rare consumable)',
        outcome: { addConsumable: 'random_rare', message: 'You pulled a functional tool from the parts of the monitoring stack that were still running. Health check endpoints. A working Redis instance. A database snapshot from 72 hours ago that\'s close enough. The staging environment is improvised, Frankenstein-style, but it works well enough for QA to run tomorrow\'s sessions. The feature stays on track.' },
      },
      {
        text: 'Fix staging properly (Upgrade random card, -8 HP)',
        outcome: { upgradeRandomCard: true, hp: -8, message: 'You took it apart. You rebuilt it. You found the root cause: a cron job that ran nightly, silently corrupt a config table, had been doing so for six months, and only caused a full failure now because a schema change removed the failsafe. You documented it. You fixed it. You wrote a runbook. It is 2 AM. You know things now that you didn\'t know before. The card is upgraded. So are you.' },
      },
      {
        text: 'Just use production (+10 stress, +25 gold)',
        outcome: { stress: 10, gold: 25, message: '"Feature flags on, non-destructive test cases only, rollback ready." You ran QA against production with careful, surgical precision. Everything passed. Nothing broke. You earned hazard pay — $25 from the sprint budget, no questions asked, because the PM was just happy the feature shipped. The stress is from knowing you did this. And knowing it worked. And knowing you\'ll do it again.' },
      },
    ],
  },
  {
    id: 'vendor_demo_kit',
    title: 'Vendor Demo Emergency Kit',
    description: 'You\'re presenting to the client in eighteen minutes. The deck is ready. The talking points are ready. You are wearing a blazer over a hoodie in what you believe is a professional but approachable silhouette. What is not ready is the demo environment, which has been "spinning up" for forty-five minutes, whose status page says "healthy," and which is definitively not healthy.\n\nThe conference room has a storage closet. Inside the storage closet, on the second shelf, is a duffel bag labeled "VENDOR DEMO EMERGENCY KIT — FOR AUTHORIZED USE ONLY." The bag belongs to a vendor who conducted demos here three months ago and never returned for their materials. The "authorized use" warning is on a piece of tape that is mostly unstuck.\n\nYou have sixteen minutes. The client is already in the lobby. The kit is here. The demo environment is not here. A decision is forming under time pressure, which is the only way decisions are made in this industry.',
    icon: '🧳',
    class: 'architect',
    choices: [
      {
        text: 'Take the premium supplies (+1 rare consumable, +10 stress)',
        outcome: { addConsumable: 'random_rare', stress: 10, message: 'You grabbed the premium item from the kit and incorporated it into your demo. The client was impressed. The vendor will be confused at their next demo engagement when the kit is lighter than expected. The stress is from presenting something you half-understand at full confidence. It worked. It usually works. This is demos.' },
      },
      {
        text: 'Return it for a favor (+30 gold, +1 common consumable)',
        outcome: { gold: 30, addConsumable: 'random_common', message: 'You called the vendor\'s sales team to report the kit. They were grateful enough to send over a backup demo environment link — their own staging instance, which they maintain specifically for situations like this one. The demo ran perfectly on their infrastructure. The client was impressed. The vendor sent a thank-you with a $30 gift card. Honesty, occasionally, is optimized.' },
      },
      {
        text: 'Study the demo architecture (Upgrade random card)',
        outcome: { upgradeRandomCard: true, message: 'You spent twelve of your sixteen minutes examining how the vendor\'s demo was architected: what was real, what was mocked, what was pre-rendered, and where the seams were. You applied what you learned to your own presentation, pivoting to a "conceptual walkthrough" format that the client later said was "the clearest demo we\'ve seen all quarter." The card is upgraded. The demo was not what you planned. It was better.' },
      },
    ],
  },
  {
    id: 'eval_cache_hit',
    title: 'The Eval Cache Hit',
    description: 'Your evaluation pipeline finished in four seconds. This is not normal. This eval takes forty minutes on a good day with prewarmed compute. You changed one comment in a config file and ran it. Four seconds. The results look correct. Suspiciously correct — actually identical to the results from last Tuesday\'s run, which was the last full eval you ran before the model checkpoint was updated.\n\nYou check the cache directory. The cache has entries. The entries are from eleven weeks ago. The cache keys are based on prompt hashes. Your prompt hashes haven\'t changed because you didn\'t change the prompts. You changed a comment. The cache doesn\'t know about comments. The eval ran against eleven-week-old cached results and reported them as fresh. Your model could be significantly worse and you would not know.\n\nThe eval framework documentation has a section on cache behavior that is four pages long and ends with: "cache invalidation is the user\'s responsibility." The resources in the cache are still technically valid. What you do with this information is a reflection of your values.',
    icon: '🗃️',
    class: 'ai_engineer',
    choices: [
      {
        text: 'Extract the cached resources (+1 rare consumable, +1 common consumable)',
        outcome: { addConsumable: 'random_rare', message: 'You extracted the cached eval outputs and checkpoint states as reusable resources — pre-computed embeddings, scored test cases, annotated failure modes from the last run. Eleven weeks of eval history, preserved. You cleared the cache and ran a fresh eval. The new results are 2.1% worse. You knew this was possible. You needed to know.' },
      },
      {
        text: 'Retrain with cached data (Upgrade random card, -6 HP)',
        outcome: { upgradeRandomCard: true, hp: -6, message: 'The cached eval results were gold-quality reference outputs from your best model checkpoint. You used them as soft labels for a lightweight fine-tuning pass. The model improved measurably on the dimensions those cached evals covered. Technically you bootstrapped quality from your own prior work. Whether this is cheating is a philosophy question. The card is upgraded. The eval was real.' },
      },
      {
        text: 'Sell the compute credits (+40 gold)',
        outcome: { gold: 40, message: 'The eval didn\'t use the compute it was budgeted for. The compute credits sat unused. You transferred them to a researcher friend who had a training job queued and no budget. They paid you $40 for the credits — below market, above zero. The eval was fake. The transaction was real. The friendship is intact. The model remains unevaluated. Tomorrow\'s problem.' },
      },
    ],
  },
  {
    id: 'abandoned_catering',
    title: 'The Abandoned Catering',
    description: 'The all-hands ended forty minutes ago. The catering remains. You know this because someone posted in #random: "hey there\'s like 800 sandwiches and 3 sheet cakes in the 4th floor conference room and nobody is eating them." Eleven people added the 👀 emoji. Two people added the 🏃 emoji. You are on the 4th floor.\n\nThe spread is impressive. It was ordered for 200 people and 60 attended because the all-hands conflicted with a sprint planning that nobody had the political will to reschedule. There are untouched trays of sandwiches — the good kind, the ones with real deli meat and those small toothpick flags — and what appears to be an entire tiered chocolate cake with "Q3 EXCELLENCE" written on it in fondant letters.\n\nExcellence is available. The question is what you do with it.',
    icon: '🥪',
    choices: [
      {
        text: 'Share the bounty in Slack (+1 common consumable, +20 gold)',
        outcome: { addConsumable: 'random_common', gold: 20, message: 'You posted in #general with a photo and floor directions. Fifty-three people responded. The conference room emptied in eleven minutes. You are credited in two people\'s Slack bios as "the one who found the sandwiches." The gold is the $20 Amazon gift card you received for "community building" from someone on the culture team who witnessed the stampede. The consumable is what you grabbed before the crowd arrived.' },
      },
      {
        text: 'Eat your fill (Heal 20 HP, reduce 10 stress)',
        outcome: { hp: 20, stress: -10, message: 'You ate two sandwiches, one scone, and a slice of Q3 Excellence. You took a second slice for later, wrapped in a napkin with "MINE" written on it, which is not professional behavior but is effective behavior. The HP and stress recovery are the direct physiological effects of sitting quietly with excellent food while everyone else is in meetings. You felt like you won something, which you did. You won lunch.' },
      },
      {
        text: 'Harvest the premium supplies (+1 rare consumable)',
        outcome: { addConsumable: 'random_rare', message: 'You were not interested in the sandwiches. You were interested in the catering supplies — the insulated bags, the stainless serving trays, the 96-pack of premium sparkling water tucked under the table that the catering company had forgotten to collect. You requisitioned them for "engineering team events" in a quick Slack to facilities who said "sure whatever." The rare consumable represents what you\'ve been quietly stockpiling for the right moment.' },
      },
    ],
  },
  {
    id: 'oncall_handoff',
    title: 'The On-Call Handoff',
    description: 'Your on-call week ended at 9 AM. You survived it. Four incidents, one P1, one memorable 3 AM database query that you fixed by adding a single index and felt disproportionately triumphant about. The rotation has handed off to your colleague. They are now wearing the pager. You are free.\n\nExcept. The outgoing on-call kit — the bag of equipment, the laminated runbook, the USB loaded with diagnostic scripts that your predecessor\'s predecessor built in 2019 and nobody has updated since — was left in the server room by the engineer before you, who forgot to pass it on. It\'s sitting on a shelf next to a decommissioned server labeled "PROD-OLD-2" and a sticky note that says "this still runs something."\n\nThe kit has things in it. The things might be useful. The next on-call rotation starts Monday.',
    icon: '📟',
    class: 'backend',
    choices: [
      {
        text: 'Take what you need (+1 rare consumable)',
        outcome: { addConsumable: 'random_rare', message: 'You went through the kit. The USB had seventeen scripts, three of which were actually useful, one of which was a complete database backup utility that you had been manually doing by hand for two years. You extracted the scripts, updated them, put them in the team\'s shared tooling repo, and took one consumable from the kit as payment for your labor. The kit is better now. You are better now. The on-call rotation is yours to own.' },
      },
      {
        text: 'Leave something, take something (+1 common consumable, upgrade random card)',
        outcome: { addConsumable: 'random_common', upgradeRandomCard: true, message: 'You added your own incident runbook — the one you wrote at 3 AM during the P1, clear-headed in the way that only fear produces — to the kit. You took the diagnostic USB. You updated the sticky note to say "this still runs something (payments service, do not touch until Dec)." The next on-call engineer will be slightly less lost than you were. The card upgrade represents your runbook making one of your own plays more effective.' },
      },
      {
        text: 'Leave it intact for the next person (+25 gold, heal 10 HP)',
        outcome: { gold: 25, hp: 10, message: 'You found the kit, confirmed its contents, labeled it clearly, and emailed the on-call rotation list with its location and an inventory. Professional. Thorough. You received a "thank you so much" reply from the engineer starting Monday who had been anxious about the missing kit for three days. Your manager noticed the email and gave you a spot bonus for "cross-functional ownership." The HP is the recovery from a week of being available at all hours. You earned it.' },
      },
    ],
  },
  {
    id: 'beta_access',
    title: 'The Beta Program',
    description: 'An email arrived from a company you respect. Subject: "We\'d love your feedback — exclusive beta access." The body explains that they\'ve been watching your public contributions (the blog posts, the conference talk, the GitHub repo with 300 stars that you built in one weekend and forgot about) and they think you\'d be a valuable tester for a product that isn\'t announced yet. There\'s an NDA linked in the email. The NDA is two pages, which in NDA terms means it\'s almost nothing.\n\nThe product is in the description that follows the NDA link: a development tool that solves a problem you have personally complained about in public at least three times. The beta is invite-only. The invite has a referral slot — you can bring one other person into the program. One person.\n\nYou have colleagues who would each individually benefit more than you. You also have colleagues who would use the referral slot for leverage, not learning. The choice of who to bring says something about you.',
    icon: '🎟️',
    choices: [
      {
        text: 'Use it immediately (+1 rare consumable)',
        outcome: { addConsumable: 'random_rare', message: 'You signed the NDA and dove in alone. The tool is as good as described — maybe better. You found three bugs in the first week, filed detailed reports, and became one of the more active beta participants. The company expanded your access level based on the quality of your feedback. The rare consumable represents something you extracted from the beta that makes your practice more capable. You never did figure out who to give the referral to. You probably should have given it to Maya.' },
      },
      {
        text: 'Share with a colleague (+1 common consumable, +15 gold)',
        outcome: { addConsumable: 'random_common', gold: 15, message: 'You gave the referral to the engineer who had complained about this exact problem most recently in your team\'s Slack. They signed up within the hour. You worked through the beta together, comparing notes, finding issues faster than either of you would have alone. The company asked you both to do a joint case study. The case study paid a $15 speaker honorarium. The consumable is what you kept for yourself from the collaboration.' },
      },
      {
        text: 'Sell the beta slot (+35 gold)',
        outcome: { gold: 35, message: 'You posted discreetly in a developer community: "Beta access slot available, looking for committed testers." Three people replied within an hour. You selected the most enthusiastic one, transferred the referral, and received $35 via Venmo described as "coffee money" which it clearly was not. The beta is being tested by someone else. The product launched six months later. You saw the launch announcement and thought about the $35 and whether that was the right trade. It was probably not. It was definitely $35.' },
      },
    ],
  },
];
