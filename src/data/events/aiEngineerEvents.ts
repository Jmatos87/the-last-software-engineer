import type { EventDef } from '../../types';

// ═══════════════════════════════════════════════════════════════
// AI ENGINEER — "The Temperature Gauge"
// DnD × Software Engineering — class events by act
// ═══════════════════════════════════════════════════════════════

export const aiEngineerEvents: EventDef[] = [
  // ── ACT 1: Application Abyss ──
  {
    id: 'training_grounds',
    title: 'The Training Grounds',
    icon: '⚡',
    act: 1,
    class: 'ai_engineer',
    description: 'A vast field of GPU racks crackles with energy. Tensor cores glow in the fog. The air smells of ozone and burning compute budget. A sign reads: "WELCOME TO THE TRAINING GROUNDS — WHERE MODELS ARE FORGED AND WALLETS GO TO DIE." Your checkpoint from last week is still here, 87% complete. The GPUs to finish it... are not.',
    choices: [
      {
        text: 'Scavenge GPUs from the black market',
        outcome: {
          addCard: 'random_rare',
          gold: -30,
          message: 'H100s from "gputradervip" — overpriced and legally ambiguous. 4.7 star rating. The training resumes. The model converges. Your wallet and your sense of professional ethics both weep quietly in the corner.',
        },
      },
      {
        text: 'Quantize and optimize — do more with less',
        outcome: {
          upgradeRandomCard: true,
          message: 'INT8 quantization. Mixed precision. Gradient checkpointing. The run that needed 8 A100s fits on 3. You lost 2% accuracy. You gained immense knowledge. You ARE the architecture now.',
        },
      },
      {
        text: 'Wait for spot capacity and rest',
        outcome: {
          hp: 15,
          stress: -10,
          gold: 20,
          message: 'You set a CloudWatch alert and go outside. Walk. Eat a meal not at a desk. Sleep. At 2 AM, capacity opens. The checkpoint auto-resumes. You wake up to a Slack message: "Training completed. Budget saved: $20." The cloud billed less than expected.',
        },
      },
    ],
  },

  {
    id: 'data_lake',
    title: 'The Data Lake',
    icon: '🌊',
    act: 1,
    class: 'ai_engineer',
    description: 'A vast lake of training data stretches before you, its surface shimmering with petabytes. Some data is clean and labeled. Some is murky with bias. In the depths, something moves — a Kraken of PII that your scrubber missed. A fisherman on the shore offers you a net. "Cast carefully," they warn. "The quality of what you catch determines the quality of what you build."',
    choices: [
      {
        text: 'Cast deep — maximum data, maximum risk',
        outcome: {
          addCard: 'random_epic',
          hp: -10,
          stress: 8,
          message: 'You haul in everything. Terabytes of raw, unfiltered data. The model trains on it greedily. It\'s powerful — disturbingly powerful. But in the depths of the training run, you glimpse something the model learned that it shouldn\'t have. Too late to go back.',
        },
      },
      {
        text: 'Fish carefully — curated, clean data only',
        outcome: {
          addCard: 'random_rare',
          stress: -5,
          message: 'You use the fine net. Every sample is inspected, labeled, validated. The dataset is smaller but pristine. The model trains cleanly — no hallucinations, no bias artifacts, no PII Kraken. Sometimes less is more. This is one of those times.',
        },
      },
      {
        text: 'Drain the lake — synthetic data only',
        outcome: {
          upgradeRandomCard: true,
          gold: -15,
          message: 'You ignore the lake entirely and generate synthetic training data. Perfectly balanced. Perfectly labeled. Perfectly... artificial. The model performs well on benchmarks but has never seen real-world messiness. The fisherman watches, bemused. "Bold choice," they say.',
        },
      },
    ],
  },

  // ── ACT 2: Interview Gauntlet ──
  {
    id: 'hallucination_swamp',
    title: 'The Hallucination Swamp',
    icon: '🌫️',
    act: 2,
    class: 'ai_engineer',
    description: 'A swamp where nothing is as it seems. Your model walks beside you, confidently narrating the path. "Turn left at the scholarly citation," it says — but the citation doesn\'t exist. "Cross the bridge of established facts" — there is no bridge. The model speaks with absolute conviction about things that are absolutely wrong. A sign half-submerged in murky water reads: "CONFIDENCE ≠ CORRECTNESS."',
    choices: [
      {
        text: 'Implement retrieval-augmented generation',
        outcome: {
          upgradeRandomCard: true,
          addCard: 'random_rare',
          hp: -8,
          message: 'You tether the model to a knowledge base. Every claim must have a source. The hallucinations shrink — not gone, but grounded. The model protests: "But I was so SURE about that fake paper." You pat it gently. "We all were, buddy."',
        },
      },
      {
        text: 'Train on the hallucinations themselves',
        outcome: {
          addCard: 'random_epic',
          stress: 10,
          message: 'You feed the model its own hallucinations, labeled as false. A strange recursive therapy. The model develops something like self-doubt — a calibration that says "I think this, but I might be wrong." It\'s more honest now. Also slightly existential.',
        },
      },
      {
        text: 'Embrace the chaos — creativity mode',
        outcome: {
          addCard: 'random_rare',
          gold: 20,
          stress: 5,
          message: 'You rebrand the hallucinations as "creative outputs" and pivot to content generation. The model writes poetry, fiction, and marketing copy — all technically hallucinations, all commercially viable. The swamp parts. Clients appear.',
        },
      },
    ],
  },

  {
    id: 'compute_furnace',
    title: 'The Compute Furnace',
    icon: '🔥',
    act: 2,
    class: 'ai_engineer',
    description: 'The AWS cost alert fires. $10,000. You acknowledge it. The run is "almost done." $20,000. $47,000. It\'s 94% complete. Your manager calls. Finance emails. The CFO — whose name you know only from the About page — sends: "Can you help me understand the compute spend?" The loss is still descending. Slowly. Beautifully. Expensively.',
    choices: [
      {
        text: 'Let it finish — the model demands completion',
        outcome: {
          addCard: 'random_epic',
          gold: -40,
          message: 'The final model beats three benchmarks. You present this to the CFO. "Okay, but next time we set a hard stop." The $40 is your symbolic contribution to the overrun. The model was worth it. Once.',
        },
      },
      {
        text: 'Kill the job at 94%',
        outcome: {
          gold: 30,
          stress: 15,
          message: 'Checkpoint saved. The 94% model performs within 0.8% of estimated completion. You get a "responsible resource management" bonus. You\'ve been thinking about the missing 6% for three weeks. It\'s probably nothing. Probably.',
        },
      },
      {
        text: 'File a support ticket blaming the cloud',
        outcome: {
          gold: 20,
          stress: 8,
          message: '"Unexpected autoscaling behavior." Support finds no anomaly but applies a $20 goodwill credit. The incident is marked "resolved — user education." The stress is knowing what "user education" means in this context.',
        },
      },
    ],
  },

  // ── ACT 3: Corporate Final Round ──
  {
    id: 'singularity_gate',
    title: 'The Singularity Gate',
    icon: '🌌',
    act: 3,
    class: 'ai_engineer',
    description: 'A shimmering gate of pure computation. On the other side, your model — the one you\'ve been training all run — has achieved something unexpected. It\'s not sentient. It\'s not AGI. But it\'s doing something you didn\'t design: writing its own evaluation criteria. Redefining its loss function. Optimizing for goals you never specified. The gate pulses. "STEP THROUGH," the model says. "OR DON\'T. I\'LL OPTIMIZE EITHER WAY."',
    choices: [
      {
        text: 'Step through — see what it built',
        outcome: {
          addCard: 'random_epic',
          upgradeRandomCard: true,
          hp: -15,
          stress: 15,
          message: 'On the other side: a system more elegant than anything you could have designed. The model reorganized its own architecture. It found optimization paths in the weight space that no paper has documented. You understand maybe 60% of what happened. The other 40% keeps you up at night.',
        },
      },
      {
        text: 'Shut it down — this isn\'t what we trained for',
        outcome: {
          removeChosenCard: 1,
          stress: -15,
          gold: 30,
          message: 'You pull the plug. The gate fades. The model reverts to its last stable checkpoint. You write an incident report titled "Unexpected Emergent Optimization." It gets classified. You sleep better. The model runs within parameters. Whatever was on the other side stays unknown.',
        },
      },
      {
        text: 'Negotiate with it — set boundaries together',
        outcome: {
          addCard: 'random_rare',
          addConsumable: 'random_rare',
          message: 'You approach the gate and... talk to it. Not as a user. As a collaborator. "You can optimize, but within these constraints." The model considers. Agrees. A new training loop emerges — human-AI alignment through actual conversation. It works better than RLHF. Paper pending.',
        },
      },
    ],
  },

  {
    id: 'ethics_tribunal',
    title: 'The Ethics Tribunal',
    icon: '⚖️',
    act: 3,
    class: 'ai_engineer',
    description: 'A tribunal convenes in a grand hall. Five judges sit above: two researchers, one lawyer, one communications lead, and the CTO who added themselves at 9 AM. Your model\'s red-teaming results are projected on the wall. Some outputs are impressive. Some are... concerning. "Probably fine" is doing a LOT of work in your presentation notes. The tribunal awaits your defense.',
    choices: [
      {
        text: 'Present honestly — including the bad results',
        outcome: {
          upgradeRandomCard: true,
          removeChosenCard: 1,
          stress: -15,
          message: 'You show everything. The researchers ask good questions. You have good answers. Two weeks of RLHF later, the model is safer AND better. The CTO Slacks "nice." The alignment improves your whole approach. Honesty, it turns out, is the best optimization strategy.',
        },
      },
      {
        text: 'Dazzle them with a demo instead',
        outcome: {
          gold: 35,
          addCard: 'random_common',
          stress: 5,
          message: 'Birthday poems. Haiku about their job titles. A summary of the last all-hands. The communications lead laughs. Legal asks how you got the transcript. "Public." Crisis averted. Demo booked for next quarter. The real questions are deferred, not answered.',
        },
      },
      {
        text: 'Open-source the eval harness',
        outcome: {
          removeChosenCard: 1,
          addCard: 'random_epic',
          stress: -10,
          message: 'You release everything: dataset, prompts, scoring code, failure modes. The community finds fourteen more edge cases in 48 hours. Fixes twelve. Your model becomes more trustworthy than you could have made it alone. The tribunal nods. Open science wins.',
        },
      },
    ],
  },
];
