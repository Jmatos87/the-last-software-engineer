import type { EventDef } from '../../types';

// ═══════════════════════════════════════════════════════════════
// BACKEND DEV — "The Elemental Architect"
// DnD × Software Engineering — class events by act
// ═══════════════════════════════════════════════════════════════

export const backendEvents: EventDef[] = [
  // ── ACT 1: Application Abyss ──
  {
    id: 'database_dungeon',
    title: 'The Database Dungeon',
    icon: '🗄️',
    act: 1,
    class: 'backend',
    description: 'You descend into a vault of unindexed tables. Rows stretch to infinity. Foreign keys dangle, unlinked, pointing to tables that may not exist. A query has been running since Tuesday. The DBA\'s ghost haunts the index suggestions, whispering "EXPLAIN ANALYZE" to anyone who\'ll listen. A cursor blinks in the darkness.',
    choices: [
      {
        text: 'Add indexes and optimize',
        outcome: {
          upgradeRandomCard: true,
          hp: -8,
          message: 'You add a composite index on (user_id, created_at). The 47-second query drops to 12 milliseconds. The DBA\'s ghost weeps with joy and dissolves into the query planner. You feel the weight of every unindexed table in your career.',
        },
      },
      {
        text: 'Write raw SQL — bypass the ORM',
        outcome: {
          addCard: 'random_rare',
          stress: 5,
          message: 'You draft a 200-line query with four JOINs, three subselects, and a window function. The ORM layer watches in horror. The query runs in 80ms. Nobody will ever be able to read it, including future you. But it WORKS.',
        },
      },
      {
        text: 'Throw Redis at it',
        outcome: {
          gold: 20,
          addConsumable: 'random_common',
          stress: 8,
          message: 'Cache everything. 15-minute TTL. The pages load instantly — for cached requests. The stress comes from knowing cache invalidation bugs are in there. Waiting. Patient. The two hardest problems in computer science mock you.',
        },
      },
    ],
  },

  {
    id: 'server_room_sanctum',
    title: 'The Server Room Sanctum',
    icon: '🖥️',
    act: 1,
    class: 'backend',
    description: 'A door marked "DO NOT ENTER — AUTHORIZED PERSONNEL ONLY" stands ajar. Inside, racks of servers hum in cold blue light. One rack in the corner is older than the company. A sticky note reads: "DO NOT TOUCH — GARY, 2016." Beside it: seven GPUs zip-tied to a shelf, running warm, mining something. The power bill goes to the company.',
    choices: [
      {
        text: 'Repurpose the hardware for load testing',
        outcome: {
          addCard: 'random_rare',
          message: 'Seven GPUs, redirected. Your load tests have never run faster. You discover three bottlenecks invisible at normal scale. Gary\'s ghost nods approvingly from behind the cooling unit.',
        },
      },
      {
        text: 'Scavenge the old rack for parts',
        outcome: {
          gold: 35,
          message: 'Gold-plated connectors from 2003. Vintage RAM worth money to collectors. A PCI card with no documentation. You sell it all. Gary would have approved. Gary was practical.',
        },
      },
      {
        text: 'Leave a fourth sticky note and walk away',
        outcome: {
          hp: 8,
          stress: -5,
          message: 'You add the fourth "DO NOT TOUCH" in your own handwriting. Gary\'s legacy endures. The mining rig continues. The old server hums its ancient song. Some things are beyond your pay grade. You feel at peace with that.',
        },
      },
    ],
  },

  // ── ACT 2: Interview Gauntlet ──
  {
    id: 'production_inferno',
    title: 'The Production Inferno',
    icon: '🔥',
    act: 2,
    class: 'backend',
    description: 'PagerDuty fires at 3:47 AM. "P1 — CUSTOMER-FACING API DEGRADED." Error rate: 34%. Latency p99 is off the chart — the charting library stopped rendering. You\'re in bed with a laptop, squinting at Datadog in the dark, wearing no pants. The Slack thread has fourteen engineers pinging. None can reproduce. The database CPU is at 99%.',
    choices: [
      {
        text: 'Fix it with raw SQL at 4 AM',
        outcome: {
          addCard: 'random_rare',
          hp: -12,
          message: 'A 200-line query. At 4 AM. By laptop-glow. It bypasses the ORM entirely. It works. Incident resolved at 4:23 AM. The postmortem asks "what caused the fix?" You write "intuition and suffering." Accepted.',
        },
      },
      {
        text: 'Restart the server and pray',
        outcome: {
          hp: 10,
          gold: 20,
          message: '`sudo systemctl restart api-service`. Error rate drops to zero. You have no idea why. The postmortem says "resolved by service restart" and everyone nods. Nobody asks follow-up questions. This is production culture.',
        },
      },
      {
        text: '"It\'s a frontend CORS issue"',
        outcome: {
          stress: -15,
          message: 'You type it in Slack with complete confidence. It\'s not CORS. By the time the frontend team proves it\'s not CORS, the real issue has self-healed. You\'ve been absolved by timing. The stress is gone. The cause is unresolved. This is Tuesday.',
        },
      },
    ],
  },

  {
    id: 'legacy_catacombs',
    title: 'The Legacy Catacombs',
    icon: '💀',
    act: 2,
    class: 'backend',
    description: 'Deep in the infrastructure, you find it: a server running Windows Server 2003. It processes payroll for 400 employees. It has worked perfectly since 2008. It was built by a contractor named Gary who retired in 2014. The documentation is a Word doc last updated in 2011. One section: "How It Works (Mostly)." The "Mostly" is never explained.',
    choices: [
      {
        text: 'Migrate to the cloud',
        outcome: {
          upgradeRandomCard: true,
          removeChosenCard: 1,
          hp: -10,
          message: 'Three days reading COBOL. Two days debugging the migration. One day weeping in a conference room. On day six: all 400 employees paid correctly. Gary\'s ghost is at peace. The modern stack hums. You shed old dead weight. Worth it.',
        },
      },
      {
        text: 'Document what you can and leave it',
        outcome: {
          addConsumable: 'random_rare',
          gold: 15,
          message: 'You spend a day writing the documentation Gary never did. "How It Actually Works (Completely)." You add a fifth sticky note: "I DOCUMENTED THIS." The next engineer will know what they\'re dealing with. The server hums on, immortal.',
        },
      },
      {
        text: 'Sacrifice gold to appease Gary\'s ghost',
        outcome: {
          gold: -20,
          hp: 15,
          stress: -10,
          message: 'You leave $20 at the server rack as tribute. The ambient hum shifts pitch — lower, warmer. The logs clear their oldest errors. You feel genuinely rested. Gary\'s ghost, wherever it is, seems satisfied.',
        },
      },
    ],
  },

  // ── ACT 3: Corporate Final Round ──
  {
    id: 'scaling_summit',
    title: 'The Scaling Summit',
    icon: '⛰️',
    act: 3,
    class: 'backend',
    description: 'You stand at the peak of Mount Infrastructure. Below, a tidal wave of traffic approaches — ten million requests, and it\'s not even Black Friday. Your auto-scaler is theoretically configured. Your load balancer is theoretically balanced. The database has a read replica that is theoretically in sync. "Theoretically" is doing a lot of work. The wave hits in thirty seconds.',
    choices: [
      {
        text: 'Trust the architecture and hold the line',
        outcome: {
          addCard: 'random_epic',
          hp: -15,
          stress: 10,
          message: 'The wave hits. Auto-scaler spins up 47 instances. The load balancer distributes. The read replica lags by 3 seconds but holds. One queue backs up, recovers. Latency spikes to 800ms, then settles. You survive. Barely. The architecture held. YOUR architecture held.',
        },
      },
      {
        text: 'Activate maintenance mode — buy time',
        outcome: {
          gold: 30,
          addConsumable: 'random_rare',
          stress: 5,
          message: 'You flip the switch. "We\'ll be right back!" The wave crashes against a static page. Behind the wall, you frantically pre-warm caches, spin up instances, and tune connection pools. Five minutes later, you drop the wall. The traffic flows in smoothly. Nobody noticed. That\'s the point.',
        },
      },
      {
        text: 'Route everything through the CDN',
        outcome: {
          upgradeRandomCard: true,
          gold: -20,
          message: 'You cache everything at the edge. HTML, API responses, user sessions — everything has a TTL now. It\'s aggressive. It\'s expensive. It\'s also 40ms response times worldwide. The CDN bill is staggering but the performance is transcendent.',
        },
      },
    ],
  },

  {
    id: 'incident_postmortem',
    title: 'The Postmortem Chamber',
    icon: '📋',
    act: 3,
    class: 'backend',
    description: 'A solemn chamber. In the center, a table with chairs arranged in a circle. On the table: a document titled "INCIDENT POSTMORTEM — BLAMELESS." Everyone is here. The VP. The SRE lead. The engineer whose commit caused the outage. (It\'s you. The engineer is you.) The document has a section called "Root Cause" with your commit hash in it.',
    choices: [
      {
        text: 'Own it completely — blameless means honest',
        outcome: {
          upgradeRandomCard: true,
          removeChosenCard: 1,
          stress: -10,
          message: '"I deployed without checking the migration. Here\'s what I\'ve built to prevent it." You present a pre-deploy checklist, a staging gate, and a canary deployment pipeline. The room is silent. Then the VP nods. "This is what blameless looks like." You shed dead weight from your deck. What remains is battle-hardened.',
        },
      },
      {
        text: 'Focus on systemic failures, not personal ones',
        outcome: {
          addCard: 'random_rare',
          gold: 20,
          message: '"The deploy pipeline had no guardrails. Any of us could have made this mistake." You present the system-level fixes: automated rollback, health checks, deploy windows. The VP approves the budget. The SRE lead looks relieved. The system improves. You were right — it WAS a systemic failure.',
        },
      },
      {
        text: 'Write the most thorough postmortem ever written',
        outcome: {
          addCard: 'random_epic',
          hp: -8,
          stress: 5,
          message: 'Twelve pages. Timeline accurate to the second. Five contributing factors. Three systemic recommendations. An appendix with the exact database state at T-minus-30. The VP calls it "the gold standard." It gets shared company-wide. Other teams start writing better postmortems. You\'re exhausted but your legacy is a culture shift.',
        },
      },
    ],
  },
];
