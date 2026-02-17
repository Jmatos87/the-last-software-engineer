import type { EventDef } from '../../types';

// ═══════════════════════════════════════════════════════════════
// AI ENGINEER — Themed Events
// ═══════════════════════════════════════════════════════════════

export const aiEngineerEvents: EventDef[] = [
  {
    id: 'gpu_shortage',
    title: 'The GPU Shortage',
    description: 'The cloud provider is out of A100s. Your training run is paused. The model was 87% done.',
    icon: '🔧',
    class: 'ai_engineer',
    choices: [
      {
        text: 'Buy GPUs on the black market (Lose 40 gold, gain Fine Tuning card)',
        outcome: { gold: -40, addCard: 'fine_tuning', message: 'Scalpers had H100s. Your wallet weeps. Your model trains.' },
      },
      {
        text: 'Quantize and optimize (Gain Batch Normalization card)',
        outcome: { addCard: 'batch_normalization', message: 'INT8 quantization. 4x faster, only 2% accuracy loss. Acceptable.' },
      },
      {
        text: 'Wait for capacity (Heal 20 HP)',
        outcome: { hp: 20, message: 'You took a break while waiting. First break in 3 weeks.' },
      },
    ],
  },
  {
    id: 'ai_ethics_board',
    title: 'The AI Ethics Board',
    description: 'The Ethics Board wants to review your model. They have concerns about "emergent behavior" and "catastrophic misalignment."',
    icon: '⚖️',
    class: 'ai_engineer',
    choices: [
      {
        text: 'Submit to review (Gain Alignment Training card, reduce 15 stress)',
        outcome: { addCard: 'alignment_training', stress: -15, message: 'They approved your model. RLHF saves the day. Your conscience is clear.' },
      },
      {
        text: 'Deploy without review (Gain Emergent Behavior card, gain 15 stress)',
        outcome: { addCard: 'emergent_behavior', stress: 15, message: 'YOLO deployment. The model does... things. Powerful things. Scary things.' },
      },
      {
        text: 'Bribe them with a demo (+30 gold)',
        outcome: { gold: 30, message: 'You showed them the model generating cat memes. They were distracted. Crisis averted.' },
      },
    ],
  },
  {
    id: 'data_leak',
    title: 'The Training Data Leak',
    description: 'Your training dataset was accidentally made public. It contains PII, copyrighted text, and someone\'s entire diary.',
    icon: '🔓',
    class: 'ai_engineer',
    choices: [
      {
        text: 'Retrain from scratch (Lose 10 HP, gain Transfer Learning card)',
        outcome: { hp: -10, addCard: 'transfer_learning', message: 'Clean data, clean conscience. The retraining was worth it.' },
      },
      {
        text: 'Pretend nothing happened (+35 gold)',
        outcome: { gold: 35, stress: 10, message: 'You changed the dataset name and re-uploaded it. Nobody noticed. You feel terrible.' },
      },
      {
        text: 'Open-source everything (Remove chosen card, reduce 20 stress)',
        outcome: { removeChosenCard: 1, stress: -20, message: '"If everyone has the data, nobody has the data." — Your lawyer disagreed.' },
      },
    ],
  },
  {
    id: 'prompt_engineering_contest',
    title: 'Prompt Engineering Contest',
    description: 'A group of AI engineers are competing to see who can write the most effective prompt. The prize: a single H100 GPU.',
    icon: '📝',
    class: 'ai_engineer',
    choices: [
      {
        text: 'Enter the contest (Lose 8 HP, gain Hallucinate card)',
        outcome: { hp: -8, addCard: 'hallucinate', message: 'Your prompt was so effective the model achieved sentience for 3 seconds. You won.' },
      },
      {
        text: 'Sell prompt tips (+25 gold)',
        outcome: { gold: 25, message: '"Just say please and thank you to the AI." They paid $25 for this advice.' },
      },
      {
        text: 'Steal the GPU while everyone\'s distracted (Gain Safety Filter relic)',
        outcome: { addItem: 'safety_filter', stress: 15, message: 'You now own an H100. The guilt is immense but the inference speed is incredible.' },
      },
    ],
  },
  {
    id: 'benchmark_controversy',
    title: 'The Benchmark Controversy',
    description: 'Your model tops every leaderboard. Twitter is suspicious. "Show us the eval suite." Someone found your test set leaked into training data.',
    icon: '📈',
    class: 'ai_engineer',
    choices: [
      {
        text: 'Redo benchmarks properly (Upgrade random card, lose 10 HP)',
        outcome: { upgradeRandomCard: true, hp: -10, message: 'Clean benchmarks. Model dropped 5 spots. But your integrity went up 100 spots.' },
      },
      {
        text: 'Double down on results (+35 gold, gain 15 stress)',
        outcome: { gold: 35, stress: 15, message: '"The benchmarks are valid." You published a blog post. The replies are... heated.' },
      },
      {
        text: 'Open-source eval suite (Remove chosen card, reduce 15 stress)',
        outcome: { removeChosenCard: 1, stress: -15, message: 'Full transparency. The community rebuilt the eval. Your model is still good. Relief.' },
      },
    ],
  },
];
