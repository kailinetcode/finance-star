import Anthropic from '@anthropic-ai/sdk';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const SIGN_META = {
  Aries:       { element: 'Fire',  ruling: 'Mars',    dates: 'Mar 21 – Apr 19' },
  Taurus:      { element: 'Earth', ruling: 'Venus',   dates: 'Apr 20 – May 20' },
  Gemini:      { element: 'Air',   ruling: 'Mercury', dates: 'May 21 – Jun 20' },
  Cancer:      { element: 'Water', ruling: 'Moon',    dates: 'Jun 21 – Jul 22' },
  Leo:         { element: 'Fire',  ruling: 'Sun',     dates: 'Jul 23 – Aug 22' },
  Virgo:       { element: 'Earth', ruling: 'Mercury', dates: 'Aug 23 – Sep 22' },
  Libra:       { element: 'Air',   ruling: 'Venus',   dates: 'Sep 23 – Oct 22' },
  Scorpio:     { element: 'Water', ruling: 'Pluto',   dates: 'Oct 23 – Nov 21' },
  Sagittarius: { element: 'Fire',  ruling: 'Jupiter', dates: 'Nov 22 – Dec 21' },
  Capricorn:   { element: 'Earth', ruling: 'Saturn',  dates: 'Dec 22 – Jan 19' },
  Aquarius:    { element: 'Air',   ruling: 'Uranus',  dates: 'Jan 20 – Feb 18' },
  Pisces:      { element: 'Water', ruling: 'Neptune', dates: 'Feb 19 – Mar 20' },
};

const client = new Anthropic();

async function generateReading(sign, date) {
  const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const { element, ruling } = SIGN_META[sign];

  const prompt = `Generate a daily financial horoscope reading for ${sign} (${element} sign, ruled by ${ruling}) for ${dateStr}.

Return ONLY a valid JSON object with exactly these fields:
{
  "daily": "one sentence — a pointed financial observation specific to ${sign}'s money psychology. Not advice. A mirror.",
  "house2": { "label": "2nd house · earning", "text": "one sentence about ${sign}'s relationship to earning, self-worth, and possessions today" },
  "house8": { "label": "8th house · debt & shared", "text": "one sentence about ${sign}'s relationship to debt, shared finances, or transformation of resources today" },
  "house11": { "label": "11th house · long-term", "text": "one sentence about ${sign}'s relationship to long-term wealth, investments, and financial goals today" },
  "spending": "one sentence about ${sign}'s spending patterns or impulses today",
  "saving": "one sentence about ${sign}'s saving behavior or resistance to it today",
  "investing": "one sentence about ${sign}'s investment psychology today",
  "debt": "one sentence about ${sign}'s relationship to debt and obligation today",
  "income": "one sentence about ${sign}'s earning patterns or income opportunities today",
  "mindset": "one sentence — the core money belief ${sign} is operating from today",
  "goodFor": ["2-word phrase", "2-word phrase"],
  "badFor": ["2-word phrase", "2-word phrase"]
}

Style requirements:
- Co-Star financial aesthetic: terse, aphoristic, slightly confrontational
- No platitudes, no "you can do it", no vague affirmations
- Each sentence under 20 words
- Specific to the sign's financial archetype (Aries = impulsive, Taurus = hoarding, etc.)
- goodFor/badFor: lowercase 2-word financial activity phrases only
- Return raw JSON only, no markdown, no explanation`;

  const message = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 700,
    thinking: { type: 'adaptive' },
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content.find(b => b.type === 'text')?.text || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`No JSON in response for ${sign}: ${text}`);
  return JSON.parse(jsonMatch[0]);
}

async function main() {
  const date = new Date();
  console.log(`Generating financial readings for ${date.toDateString()}...`);

  const readings = {};

  for (const sign of SIGNS) {
    console.log(`  ${sign}...`);
    try {
      readings[sign] = await generateReading(sign, date);
    } catch (err) {
      console.error(`  Error for ${sign}:`, err.message);
      process.exit(1);
    }
  }

  const output = {
    generated: date.toISOString(),
    date: date.toISOString().split('T')[0],
    readings,
  };

  const outPath = join(__dirname, '..', 'public', 'daily-readings.json');
  writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`Done. Written to ${outPath}`);
}

main();
