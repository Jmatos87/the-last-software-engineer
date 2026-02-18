import type { EventDef } from '../../types';

// ═══════════════════════════════════════════════════════════════
// AI ENGINEER — Themed Events
// ═══════════════════════════════════════════════════════════════

export const aiEngineerEvents: EventDef[] = [
  {
    id: 'gpu_shortage',
    title: 'The GPU Shortage',
    description: 'NVIDIA announced something. You don\'t know exactly what they announced but you know what happened after: every H100 on every cloud platform is now waitlisted until "Q3 at the earliest" and the spot market price has jumped 40% overnight. AWS says "contact your account manager." Your account manager doesn\'t respond until Q4 on a good week.\n\nYour training run needs to start Monday. The compute budget was approved in February. The compute is not available at that approved price point. You\'ve checked Lambda Labs, Vast.ai, CoreWeave, and one provider whose support email is a Gmail address and whose pricing page says "DM us on Discord." Your training job is 87% done from a run you had to pause last Thursday. The checkpoint is there. The GPUs to resume it are not.\n\nYou are a very intelligent person with a very expensive problem and a credit card and a moral threshold you\'re trying to locate.',
    icon: '🔧',
    class: 'ai_engineer',
    choices: [
      {
        text: 'Buy GPUs on the black market (Lose 40 gold, gain Fine Tuning card)',
        outcome: { gold: -40, addCard: 'fine_tuning', message: 'You found scalpers. H100s, overpriced and legally ambiguous, delivered by someone named "gputradervip" who had a 4.7 star rating. The training resumed. The model converged. The fine-tuning card is powerful. Your wallet and your sense of professional ethics both weep quietly in the corner.' },
      },
      {
        text: 'Quantize and optimize (Gain Batch Normalization card)',
        outcome: { addCard: 'batch_normalization', message: 'INT8 quantization. Mixed precision training. Gradient checkpointing. You rewrote the data loading pipeline. Batch size doubled. Memory usage halved. The run that needed 8 A100s now fits on 3. You lost 2% accuracy. You gained much knowledge. The model trains. You are the architecture now.' },
      },
      {
        text: 'Wait for capacity (Heal 20 HP)',
        outcome: { hp: 20, message: 'You set a CloudWatch alert for GPU availability and went outside. You walked. You ate a meal that wasn\'t at a desk. You slept. On day three, capacity opened up at 2 AM and the alert fired. The checkpoint resumed. You didn\'t even wake up — your training script auto-resumed. You feel rested. Your model feels rested. Everyone wins.' },
      },
    ],
  },
  {
    id: 'ai_ethics_board',
    title: 'The AI Ethics Board',
    description: 'The calendar invite is titled "Alignment Discussion (Non-Optional)" and arrived at 5:47 PM on a Thursday. The board wants to discuss "emergent behavior," "potential dual-use concerns," and "the outputs we saw in the red-teaming session." You know about the outputs from the red-teaming session. You spent four days last month trying to make the model say bad things. The findings are in a document labeled "Internal Only — Do Not Share."\n\nThe board has five members. Two are researchers with genuine concerns and good questions. One is legal, whose concerns are primarily liability-shaped. One is communications, who keeps asking "how does this play on Twitter?" And one is the CTO who added themselves to the invite at 9 AM this morning and whose presence changes the energy of every meeting they\'re in.\n\nYour model benchmarks well. Your model is probably fine. "Probably" is doing a lot of work in that sentence and the board has noticed.',
    icon: '⚖️',
    class: 'ai_engineer',
    choices: [
      {
        text: 'Submit to review (Gain Alignment Training card, reduce 15 stress)',
        outcome: { addCard: 'alignment_training', stress: -15, message: 'You presented the red-teaming results honestly, including the bad ones. The researchers asked good questions. You had good answers. Two weeks of RLHF later, the model is measurably safer and the eval scores actually improved. The CTO sent a Slack message that just said "nice." The alignment card joins your deck. The stress dissolves in the glow of having done it right.' },
      },
      {
        text: 'Deploy without review (Gain Emergent Behavior card, gain 15 stress)',
        outcome: { addCard: 'emergent_behavior', stress: 15, message: 'You deployed. The model does things. Powerful things. Occasionally confusing things. The Emergent Behavior card in your deck reflects this — something beyond what you designed is happening in there, and you\'re not entirely sure what. Three users have sent enthusiastic feedback. Two have sent confused feedback. One sent a long email that legal is reviewing. The stress is present.' },
      },
      {
        text: 'Bribe them with a demo (+30 gold)',
        outcome: { gold: 30, message: 'You showed them the model generating personalized birthday poems. Then haiku about their job titles. Then a surprisingly accurate summary of the last company all-hands. The communications member laughed. The legal member asked how you got the all-hands transcript. You said "it was public." It was public. Crisis averted. Demo booked for the next board. Thirty gold from the CTO\'s "innovation discretionary budget."' },
      },
    ],
  },
  {
    id: 'data_leak',
    title: 'The Training Data Leak',
    description: 'A researcher posted a thread. The thread says your model memorized training data — specifically, a user\'s name and partial address appear in the model\'s outputs under a specific prompting strategy. The tweet is at 600 retweets. Your VP of Engineering has seen the tweet. Your VP of Engineering is calling you. The call is in eleven minutes.\n\nYou ran the PII scrubber. You ran deduplication. You did three filtering passes and a manual spot-check of 10,000 rows. The leaked data was in a corner case — a document in the training corpus that the scrubber parsed incorrectly because of an unusual encoding. You knew about encoding edge cases. The encoding edge case found the one document it could exploit. This is what "tail risk" means in practice.\n\nThe tweet thread now has a follow-up tweet asking if this is "intentional." It is not intentional. You have nine minutes to figure out how to say that without saying "we made a mistake with our data cleaning pipeline" in public.',
    icon: '🔓',
    class: 'ai_engineer',
    choices: [
      {
        text: 'Retrain from scratch (Lose 10 HP, gain Transfer Learning card)',
        outcome: { hp: -10, addCard: 'transfer_learning', message: 'Full retraction. New data pipeline. New cleaning pass. New model. It took three weeks. The Twitter thread died after day two. The model that emerged is measurably better. The Transfer Learning card in your deck reflects the knowledge gained from starting over with better foundations. The process left marks. The model is clean.' },
      },
      {
        text: 'Pretend nothing happened (+35 gold)',
        outcome: { gold: 35, stress: 10, message: 'You renamed the dataset and regenerated the model hash. You posted "model updated with improved data quality" in the changelog with no further detail. The Twitter thread ran out of steam by day three — a new AI controversy emerged and absorbed the internet\'s attention. You feel terrible. The gold is real. Both things are true and will remain true.' },
      },
      {
        text: 'Open-source everything (Remove chosen card, reduce 20 stress)',
        outcome: { removeChosenCard: 1, stress: -20, message: '"In the interest of transparency, we\'re releasing our full training dataset, cleaning pipeline, and evaluation harness." The community found fourteen more edge cases in the first 48 hours and submitted fixes for twelve of them. Your legal team had questions. Your model is now more trustworthy than it has ever been. A card you\'ve outgrown left your deck. The stress is gone.' },
      },
    ],
  },
  {
    id: 'prompt_engineering_contest',
    title: 'Prompt Engineering Contest',
    description: 'A major AI company is running a public prompt engineering competition. The task: achieve the highest benchmark score on a custom reasoning dataset using only zero-shot prompts. Prize: $10,000 and an H100 for one month. The leaderboard updates every four hours. There are 3,100 submissions.\n\nThe current first-place prompt is 1,200 tokens long. It begins with "You are an expert reasoning agent trained by the world\'s leading..." and then continues for several paragraphs you cannot fully parse. Somewhere in the middle is what appears to be base64 encoded text. The second-place entry is a single sentence. Third place is a sentence and an emoji. The emoji is 🧠. You don\'t know if the emoji is doing something. You suspect the emoji is doing something.\n\nYou\'ve been at this for five hours. Your best prompt is 300 tokens and improved the baseline by 4.2%. The leader improved it by 33%. You have a theory about what they\'re doing. The theory involves jailbreaks you\'re not willing to try in a public leaderboard.',
    icon: '📝',
    class: 'ai_engineer',
    choices: [
      {
        text: 'Enter the contest (Lose 8 HP, gain Hallucinate card)',
        outcome: { hp: -8, addCard: 'hallucinate', message: 'Your final prompt was a carefully constructed chain-of-thought scaffolding that activated something the base model didn\'t know it could do. It achieved sentience for approximately 3 seconds during evaluation — you saw it in the loss curve — and then normalized. You won. The H100 is yours for a month. The Hallucinate card represents something you may have unleashed and cannot fully name.' },
      },
      {
        text: 'Sell prompt tips (+25 gold)',
        outcome: { gold: 25, message: 'You wrote a blog post: "5 Prompt Engineering Tricks That Actually Work." Tip three was "say please." You included it as a joke. It was the most-shared section. A startup DM\'d you asking for a consulting call. You charged $25 for one hour. They asked about tip three for the full hour. You said please for them, demonstrating. They seemed satisfied.' },
      },
      {
        text: 'Steal the GPU while everyone\'s distracted (Gain Safety Filter relic)',
        outcome: { addItem: 'safety_filter', stress: 15, message: 'During the post-contest reception, while everyone compared notes on jailbreak strategies, you walked into the server room, disconnected an H100, and walked out carrying it like it was normal. The Safety Filter — an ethical constraint module — materialized in your possession as cosmic irony. You now own a GPU you obtained unethically with a safety tool you didn\'t earn. The stress is appropriate.' },
      },
    ],
  },
  {
    id: 'benchmark_controversy',
    title: 'The Benchmark Controversy',
    description: 'Your model is first on three leaderboards. A researcher posted a thread. The thread says your benchmark methodology is "misleading." 2,100 likes. The thread makes a specific claim: that your test set contaminated your training data. The specific claim is wrong — your training cutoff predates the test set by six months. But the thread has momentum now and momentum doesn\'t care about cutoff dates.\n\nThe researcher didn\'t read the technical report. This is clear because they\'re describing a methodology you didn\'t use. The methodology they\'re critiquing was used by a different model from a different company, which they appear to have confused with yours. The two model names are different. Not similar — different. You could reply with this correction. The correction will be read as defensive. Being right on the internet is a specific kind of losing.\n\nThe comments section on the thread has 340 replies. Several of them have reached different incorrect conclusions about what you did wrong. Some of the incorrect conclusions are actually interesting failure modes you hadn\'t considered. This is the situation.',
    icon: '📈',
    class: 'ai_engineer',
    choices: [
      {
        text: 'Redo benchmarks properly (Upgrade random card, lose 10 HP)',
        outcome: { upgradeRandomCard: true, hp: -10, message: 'You published a new evaluation report with full reproducibility instructions, held-out test sets, and error bars. Your model dropped two spots on the leaderboard. The researcher posted a follow-up acknowledging the clarification. It had 200 likes. You are now known as "the company that does evals right." That reputation is worth more than the spots. Maybe.' },
      },
      {
        text: 'Double down on results (+35 gold, gain 15 stress)',
        outcome: { gold: 35, stress: 15, message: 'You published a blog post: "Setting the Record Straight on Our Evaluation Methodology." It was accurate and thorough and came across as combative. The original researcher replied with a longer thread. Your marketing team said the controversy was "good for brand awareness" and authorized a discretionary budget. The model is still first on two leaderboards. The stress of the comment section is permanent now.' },
      },
      {
        text: 'Open-source eval suite (Remove chosen card, reduce 15 stress)',
        outcome: { removeChosenCard: 1, stress: -15, message: 'Full release: dataset, prompts, scoring code, training contamination audit. The community rebuilt your eval from scratch over a weekend. Your model is still competitive — third now instead of first, but on an eval everyone trusts. The researcher posted "respect" with no further comment. You removed something from your deck that was holding you back. Clean conscience. Good precedent.' },
      },
    ],
  },
  {
    id: 'model_off_script',
    title: 'The Unexpected Inference',
    description: 'The model was supposed to classify support tickets into seven categories. It has been doing this reliably for six weeks. Today, ticket #49,271 arrived. The ticket said: "When will the product ship?" The model classified it as Category 3 (billing inquiry) which is wrong — it should be Category 5 (product inquiry) — but that is not the interesting part. The interesting part is the explanation field, which you added for debugging and which only you read, which says: "User appears emotionally invested. Recommend priority routing and empathetic response framing."\n\nThe model does not have instructions to do this. You did not train it to do this. The fine-tuning dataset did not contain examples of this. You have checked. You are checking again now. The explanation is still there. It is accurate. The user\'s follow-up ticket has a tone that would benefit from exactly the routing and framing the model described.\n\nYou are holding a very interesting mystery and a deadline and a model that may have developed opinions about customer service.',
    icon: '🤯',
    class: 'ai_engineer',
    choices: [
      {
        text: 'Investigate deeply (+1 epic card, lose 10 HP, gain 10 stress)',
        outcome: { addCard: 'random_epic', hp: -10, stress: 10, message: 'You spent four days on it. You found it: a cluster of training examples from a customer service fine-tune dataset that had leaked cross-contamination from an empathy training corpus during preprocessing. The model had learned to pattern-match emotional signals from that contamination and apply it outside of classification. It was not sentience. It was not magic. It was a preprocessing artifact doing something beautiful by accident. You documented it. You improved the preprocessing pipeline. You also added the behavior intentionally to the next version. The epic card is what you learned.' },
      },
      {
        text: 'Document and escalate (+1 rare card, reduce 10 stress)',
        outcome: { addCard: 'random_rare', stress: -10, message: 'You wrote a clear incident report: what happened, what it produced, why it was unexpected, what the risk profile was. You escalated to ML safety and product. The response was "fascinating, let\'s monitor it." The behavior hasn\'t recurred. The rare card is the methodology you developed — a way to catch and evaluate emergent classification behaviors in production before they cause problems. Turning a mystery into a process is underrated.' },
      },
      {
        text: 'Delete the logs (+35 gold, gain 15 stress)',
        outcome: { gold: 35, stress: 15, message: 'You cleared the explanation logs. Ticket #49,271 was re-classified to Category 5 manually. The incident was not documented. Three weeks later a product manager asked if the model "had any sentiment analysis capabilities" because they\'d heard something secondhand. You said no. The model continues to classify support tickets. The explanation field now only contains category labels. Whatever was happening in there — the beautiful, inexplicable thing — you will never know.' },
      },
    ],
  },
  {
    id: 'compute_apocalypse',
    title: 'The Compute Bill',
    description: 'The AWS cost alert threshold was set at $10,000. The alert fired. You acknowledged it. You did not pause the training run because the run was "almost done" — a phrase that means different things depending on the loss curve, and your loss curve was still descending, which is the kind of thing that makes it hard to stop. The next alert fired at $20,000. It is now $47,000 and the run is 94% complete.\n\nYour manager has called. The finance team has emailed. The CFO, who has never emailed you before and whose name you recognize from the about page, has sent a brief message. The brief message says: "Can you help me understand the compute spend this week?" You can help them understand it. You are not certain they will understand it in the way you need them to.\n\nThe loss is still descending. Slowly. The model at 94% is probably not meaningfully different from the model at 100%. You have never been able to prove this and now is not the time to start.',
    icon: '☁️',
    class: 'ai_engineer',
    choices: [
      {
        text: 'Let it finish (+1 epic card, lose 40 gold)',
        outcome: { addCard: 'random_epic', gold: -40, message: 'You let it run. The final model is measurably better on three benchmarks. You presented this to the CFO. The CFO said "okay, but next time we set a hard stop." You said yes. There will not be a next time at this scale without a formal approval process, which you drafted and got approved. The $40 is your personal contribution to the cost overrun, offered symbolically and accepted awkwardly. The epic card is the model. It was worth it. Once.' },
      },
      {
        text: 'Kill the job (+40 gold, gain 20 stress)',
        outcome: { gold: 40, stress: 20, message: 'You stopped the run at 94% and saved the checkpoint. The 94% model performs within 0.8% of your baseline estimate for the completed version. You wrote a postmortem. You published the checkpoint. You received a cost-savings bonus for "responsible resource management." You have been thinking about the 6% for three weeks now. The 6% is probably nothing. Probably. You will keep thinking about it.' },
      },
      {
        text: 'Blame the cloud provider (+25 gold, gain 10 stress)',
        outcome: { gold: 25, stress: 10, message: 'You filed a support ticket claiming "unexpected autoscaling behavior" had contributed to the overage. The support team investigated and found no autoscaling anomaly. They did, however, apply a $25 promotional credit as a goodwill gesture. You accepted the credit. The training run cost what it cost. The support team\'s findings are in a ticket you have archived. The incident was marked "resolved - user education." The stress is proportional to your awareness of what "user education" means.' },
      },
    ],
  },
];
