import type { EventDef } from '../../types';

// ═══════════════════════════════════════════════════════════════
// BACKEND DEV — Themed Events
// ═══════════════════════════════════════════════════════════════

export const backendEvents: EventDef[] = [
  {
    id: 'production_incident',
    title: 'Production Incident',
    description: 'PagerDuty fired at 3:47 AM. The alert says "P1 — Customer-Facing API Degraded." The error rate is 34%. The latency p99 is off the chart — not trending toward the top, actually off the chart, as in the charting library has stopped rendering because the numbers are that bad. You were asleep eleven minutes ago.\n\nYou are now in bed with a laptop, squinting at a Datadog dashboard in the dark, wearing no pants. The logs show a null pointer exception in a service that has not been touched in nine months. The last person who touched it is on parental leave in a different timezone. Their Slack status is 🍼. You are not going to message them. You would rather fix this with your bare hands.\n\nThe Slack thread has fourteen engineers pinging. None of them can reproduce. The database CPU is at 99%. You have a theory. The theory is bad. The theory might work.',
    icon: '🔥',
    class: 'backend',
    choices: [
      {
        text: 'Fix it with a raw SQL query (Gain Stored Procedure card)',
        outcome: { addCard: 'stored_procedure', hp: -6, message: 'You wrote a 200-line SQL query at 4 AM using only the dim glow of your laptop screen. It bypassed the ORM entirely. It worked. The incident resolved at 4:23 AM. The postmortem asks "what caused the fix?" You write "intuition and suffering." This is accepted.' },
      },
      {
        text: 'Restart the server and pray (+20 gold, heal 10 HP)',
        outcome: { gold: 20, hp: 10, message: 'You typed `sudo systemctl restart api-service`. You pressed enter. You watched the logs scroll. The error rate dropped to zero. You have no idea why. The postmortem will say "resolved by service restart" and everyone will nod and nobody will ask follow-up questions. This is called "production incident culture."' },
      },
      {
        text: 'Blame the frontend team (Reduce 15 stress)',
        outcome: { stress: -15, message: '"It\'s a CORS misconfiguration on the client side." You typed this in the Slack thread with complete confidence. It was not CORS. The frontend team investigated and found it was not CORS. By then, the real issue had self-healed. You have been absolved by timing. The stress is gone. The cause is unresolved. This is Tuesday.' },
      },
    ],
  },
  {
    id: 'legacy_migration',
    title: 'The Legacy Migration',
    description: 'You\'ve found it: a server running Windows Server 2003, tucked in a rack at the back of the server room, humming quietly, doing its job. The job it has been doing since 2008. The job is running a COBOL application that processes payroll for 400 employees. The application works perfectly. It has always worked perfectly. It was built by a contractor named Gary who retired in 2014 and cannot be reached.\n\nA sticky note on the rack says "DO NOT TOUCH" in three different handwriting styles, suggesting the warning has been transcribed across generations of engineers, each terrified of Gary\'s creation. The documentation is a Word document last updated in 2011. One section is titled "How It Works (Mostly)." The "Mostly" is never explained.\n\nManagement wants it migrated to a modern cloud stack. The timeline is Q3. It is Q2. The codebase is 180,000 lines. Three variable names are in German.',
    icon: '💾',
    class: 'backend',
    choices: [
      {
        text: 'Migrate to modern stack (Gain Index Optimization card, lose 10 HP)',
        outcome: { addCard: 'index_optimization', hp: -10, message: 'You spent three days reading COBOL. You spent two days debugging the migration. You spent one day weeping softly in a conference room. On day six, it worked. All 400 employees were paid correctly. Gary\'s ghost, you sense, is at peace. The modern stack hums. You are tired in a proud way.' },
      },
      {
        text: 'Scavenge the hardware (+35 gold)',
        outcome: { gold: 35, message: 'You inventoried the rack. Inside: gold-plated PCIe connectors from 2003, vintage RAM worth money to collectors, and a PCI card with a product number that doesn\'t appear in any database you can find. Sold it all. Gary would have approved. Gary was practical.' },
      },
      {
        text: 'Leave it running',
        outcome: { message: 'You walked away. The server continues. The COBOL application processes payroll flawlessly, as it has since 2008, as it will until the hardware fails or the sun expands, whichever comes first. You add the sticky note a fourth handwriting style. "DO NOT TOUCH. (Seriously.)"' },
      },
    ],
  },
  {
    id: 'dns_propagation',
    title: 'DNS Propagation',
    description: 'You changed a DNS record four hours ago. You did everything right. You waited for the TTL. You flushed your local cache. You checked propagation on three different tools. Two of them show the new record. One still shows the value from 2019. This is fine. DNS propagates at its own pace. The internet is large. The large internet does not care about your timeline.\n\nYour client has emailed six times. The emails escalate in font size, emotionally speaking. The first said "any update?" The sixth says "this is unacceptable, our business is impacted." Their business is a landing page with a contact form. The contact form still works. The contact form has always been on a subdomain you didn\'t touch. You cannot explain this to them in a way that will help.\n\n"It\'s always DNS," said every engineer who has ever lived. You are now one of those engineers. Welcome to the club. The meetings are indefinitely postponed because of a DNS issue.',
    icon: '🌐',
    class: 'backend',
    choices: [
      {
        text: 'Debug until it resolves (Gain Firewall Rules card, lose 8 HP)',
        outcome: { addCard: 'firewall_rules', hp: -8, message: 'You tracked it down. The registrar had a caching layer on their nameservers that honored the old TTL before the new one. You found a workaround. You configured it. It propagated. It was DNS, and also specifically a registrar edge case, and also specifically a feature of how Cloudflare interacts with this registrar. You know things now. Dark things. DNS things.' },
      },
      {
        text: 'Wait 48 hours (Heal 20 HP)',
        outcome: { hp: 20, message: 'You set an auto-reply on your email. You took a walk. You made soup. You read a book — not a technical book, a real one with characters and feelings. Forty-eight hours later, you checked the propagation tool. All nodes: updated. You replied to the client with "resolved." They said "thanks." This was the correct approach.' },
      },
    ],
  },
  {
    id: 'crypto_mining_rig',
    title: 'The Crypto Mining Rig',
    description: 'You found something in the server closet while looking for a patch cable. Seven GPUs, zip-tied to a repurposed server rack shelf, connected to a UPS, running warm and quiet and very busy. A startup script runs on system boot. The script mines Ethereum. The power comes from the office circuit. The electric bill goes to the company. Nobody has noticed.\n\nThe rig has been here for at least ten months — you can tell by the dust accumulation pattern on the intake fans. The wallet is attached to a GitHub username. The GitHub username has commits in this company\'s private repository. The inference is uncomfortable. The financial opportunity is also uncomfortable but differently so.\n\nYou stand in the server closet with a patch cable in your hand and a moral quandary in your heart.',
    icon: '⛏️',
    class: 'backend',
    choices: [
      {
        text: 'Mine some crypto (+50 gold, gain 15 stress)',
        outcome: { gold: 50, stress: 15, message: 'You adjusted the wallet address. Subtly. Just for a few hours. The ETH flows into your account. You feel the weight of the decision in real-time. The stress is immediate and justified. The gold is also immediate. You are not the first person to make this choice and that doesn\'t make it better.' },
      },
      {
        text: 'Repurpose for load testing (Gain Brute Force Attack card)',
        outcome: { addCard: 'brute_force_attack', message: 'Seven GPUs, redirected. Your load testing suite has never run faster. You discover three performance bottlenecks that have been invisible at normal testing scale. You fix two of them. The third one is Gary\'s fault somehow. You gain knowledge and a powerful new tool.' },
      },
      {
        text: 'Report it to management',
        outcome: { gold: 15, message: 'You filed an IT security report. Management investigated. The rig was confiscated. You received a $15 Amazon gift card for "ethical behavior." A trophy for doing the right thing, priced at approximately the cost of a phone charger. You are a good person. It cost you relatively nothing and also feels hollow.' },
      },
    ],
  },
  {
    id: 'n_plus_one_query',
    title: 'The N+1 Query',
    description: 'The page takes 7.3 seconds to load. You open the SQL profiler. There are 1,047 queries running for a single page request. They run sequentially. They all ask for the same foreign key relationship. Your ORM is very thorough. Your ORM is very, very thorough. Your ORM is looping through a list of users and, for each user, making a separate database call to retrieve their associated organization. There are 1,046 users.\n\nA // TODO comment lives above the code in question. The comment says `// TODO: add eager loading here`. The comment has your name on it. The commit was eight months ago. The feature shipped. The comment remained. Three users have complained about page load times. Internally, silently, you have also complained while staring at your own code in a private browser tab.\n\nThe DBA sent you an email this morning with the subject line: "Quick chat?" The DBA never wants a quick chat about good things.',
    icon: '🔍',
    class: 'backend',
    choices: [
      {
        text: 'Optimize with joins (Upgrade random card, lose 10 HP)',
        outcome: { upgradeRandomCard: true, hp: -10, message: 'You wrote a single query with four JOINs and three subselects that retrieves everything in one round trip. It is 47 lines long. You do not fully understand it anymore. It runs in 80ms. The DBA looked at it and said "hm" in a tone that could mean anything. The page loads instantly. You have achieved something.' },
      },
      {
        text: 'Add a cache layer (+25 gold, gain 10 stress)',
        outcome: { gold: 25, stress: 10, message: 'Redis. You threw Redis at it. Fifteen-minute TTL, cache key by user-org pair. The page now loads in 300ms for cached requests. The DBA stopped emailing. The stress comes from knowing you\'ve introduced cache invalidation bugs you haven\'t found yet. They\'re in there. Waiting. Patient.' },
      },
      {
        text: '"It works on my machine" (Heal 15 HP, gain 20 stress)',
        outcome: { hp: 15, stress: 20, message: 'You closed the profiler. You opened the ticket. You typed "Cannot reproduce on local environment — local DB has limited dataset, performance characteristics differ." The ticket moved to "Backlog." Your local DB has 12 users. Production has 47,000. The DBA knows where you sit. The stress of knowing they know grows daily.' },
      },
    ],
  },
  {
    id: 'gdpr_request',
    title: 'The GDPR Request',
    description: 'The email arrived from a user who knows exactly what their rights are. Subject line: "Data Subject Access Request — Article 15 GDPR." The body is five sentences, three of which are legal citations. The signature links to a professional profile that lists "digital rights advocate" as a current role. You have thirty days to comply. You have noted the thirty days. You have also noted that your data infrastructure was not designed with this use case in mind.\n\nThe user\'s data exists across four databases, two S3 buckets, three third-party analytics integrations, and one logging system that your DevOps lead describes as "legacy but stable, don\'t touch it." The analytics integrations have their own GDPR terms. Two of them technically own a copy of the data under their ToS. The legal team has sent the ticket back to Engineering with the note "y\'all handle this."\n\nThe thirty-day clock is ticking. The data is scattered. The user knows their rights. You are learning yours.',
    icon: '🔏',
    class: 'backend',
    choices: [
      {
        text: 'Comply fully (Remove chosen card, heal 15 HP, reduce 20 stress)',
        outcome: { removeChosenCard: 1, hp: 15, stress: -20, message: 'You built a data aggregation pipeline over four days that pulled from every data source, deduplicated, anonymized third-party references, and produced a clean JSON export. You sent it within the deadline with a cover letter explaining the data categories included. The user replied: "This is the most thorough DSAR response I have ever received." You added the pipeline to the internal tooling docs. Your data infrastructure is now something you understand completely. The card you shed was dead weight — complexity you\'d been maintaining for the wrong reasons.' },
      },
      {
        text: 'Partially comply (+25 gold, gain 15 stress)',
        outcome: { gold: 25, stress: 15, message: 'You exported what was easy to export — the primary database records, the user table, the transaction history. You technically satisfied the request in the narrow legal sense. The analytics integrations were excluded with a footnote citing their own compliance status. The user accepted it without follow-up. Legal was satisfied. You received a spot bonus for "rapid turnaround." The stress is a permanent background process running the probability of them requesting a follow-up.' },
      },
      {
        text: 'Document the "complexity" (+40 gold, gain 30 stress)',
        outcome: { gold: 40, stress: 30, message: 'You responded with a 20-page document describing your data architecture\'s distributed nature, the compliance posture of each third-party integration, and a timeline for "phased data portability improvements." Legal loved it. The user\'s advocate did not. They escalated to the data protection authority. The DPA found the response technically sufficient and administratively troubling. You received no fine. You received a recommendation to implement a proper DSAR pipeline. The stress of the next DSAR request starts now.' },
      },
    ],
  },
  {
    id: 'disk_space_emergency',
    title: 'The Disk Space Emergency',
    description: 'The alert fires at 6:47 AM. Disk usage: 98%. The threshold was 90% before the alert escalates. The alert has been at 91% for three weeks. The alert at 91% was acknowledged. Nobody actioned the acknowledgment. Now it is 98% and the database is beginning to refuse writes, which the users are experiencing as an error message that says "Something went wrong. Please try again." They are trying again. It is not helping.\n\nYou SSH in. You run df -h. You run du -sh /* to find the culprit. The culprit is logs. It is always logs. There are 847 GB of application logs dating back to 2021. The log rotation policy was configured and then, at some point, not configured. The exact date of the not-configuring is visible in git blame and you recognize the committer\'s name because it is your name.\n\nYou have four options: fast, right, cheap, or clever. You cannot have more than one of these at once.',
    icon: '💾',
    class: 'backend',
    choices: [
      {
        text: 'Delete and fix root cause (Upgrade random card, lose 8 HP)',
        outcome: { upgradeRandomCard: true, hp: -8, message: 'You deleted the logs from 2021-2022 (exported to cold storage first, you\'re not a monster), fixed the log rotation policy, set up a monitoring alert for log volume specifically, and added a runbook entry for the next time this happens. The disk went from 98% to 34%. The database resumed writes. You wrote a postmortem that was two paragraphs and actually useful. The card upgrade represents what you learned about your own infrastructure by being forced to understand it under pressure.' },
      },
      {
        text: 'Buy emergency cloud storage (Heal 10 HP, lose 40 gold)',
        outcome: { hp: 10, gold: -40, message: 'You spun up a 2TB EBS volume, mounted it, and pointed the log directory at it within twenty minutes. The immediate crisis resolved. The logs are still growing. The rotation policy is still broken. The new volume will hit 90% in approximately six weeks. You set a calendar reminder for five weeks from now. The $40 is the monthly cost, which you expensed. The HP recovery is relief — temporary, priced, and absolutely worth it in the moment.' },
      },
      {
        text: 'Archive to S3 and call it solved (+20 gold, gain 15 stress)',
        outcome: { gold: 20, stress: 15, message: 'You wrote a script that compressed and archived logs older than 30 days to S3 Glacier. You set it to run on cron. You set the cron to run monthly. The disk usage dropped to 61%. You marked the incident resolved. The script ran correctly for two months. On month three, the cron server was rotated as part of infrastructure updates and the cron entry did not transfer. The logs are accumulating. You will remember this stress at 6:47 AM in approximately four months.' },
      },
    ],
  },
];
