import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Dog, Home, User, Heart, RotateCcw, CheckCircle } from 'lucide-react';
import { Puppy } from '../types';
import { EditableImage } from './ImageEditContext';

interface PuppyMatcherQuizProps {
  puppies: Puppy[];
  onMatch: (puppyName: string) => void;
  setTab: (tab: string) => void;
}

export default function PuppyMatcherQuiz({ puppies, onMatch, setTab }: PuppyMatcherQuizProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Puppy | null>(null);

  const questions = [
    {
      id: 'energy',
      question: 'What energy level best fits your daily lifestyle?',
      icon: <Dog className="w-5 h-5" />,
      options: [
        { label: 'Athletic & Active (Daily hikes/runs)', value: 'high' },
        { label: 'Moderate & Playful (Daily walks)', value: 'mid' },
        { label: 'Calm & Cuddly (Relaxed home life)', value: 'low' }
      ]
    },
    {
      id: 'family',
      question: 'Will the puppy be living with young children or other pets?',
      icon: <Home className="w-5 h-5" />,
      options: [
        { label: 'Yes, both children and pets.', value: 'social' },
        { label: 'Just other pets.', value: 'pets' },
        { label: 'No, just adults.', value: 'adults' }
      ]
    },
    {
      id: 'look',
      question: 'Do you have a preferred Golden coat color?',
      icon: <Heart className="w-5 h-5" />,
      options: [
        { label: 'Deep Mahogany / Red Golden', value: 'Red Golden' },
        { label: 'Classic Honey / Light Golden', value: 'Light Golden' },
        { label: 'English Cream (White/Cream)', value: 'Cream' },
        { label: 'No preference!', value: 'any' }
      ]
    }
  ];

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[step].id]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: Record<string, string>) => {
    // Basic heuristic matching
    const availablePups = puppies.filter(p => p.status === 'Available');
    if (availablePups.length === 0) return;

    let bestMatch = availablePups[0];

    // Priority color matching
    if (finalAnswers.look !== 'any') {
      const colorMatch = availablePups.find(p => p.color.includes(finalAnswers.look));
      if (colorMatch) bestMatch = colorMatch;
    }

    // Energy / Personality matching based on descriptions/characteristics
    if (finalAnswers.energy === 'low') {
      const calmMatch = availablePups.find(p => p.characteristics.includes('Calm Energy') || p.characteristics.includes('Cuddle Bug'));
      if (calmMatch) bestMatch = calmMatch;
    } else if (finalAnswers.energy === 'high') {
      const activeMatch = availablePups.find(p => p.characteristics.includes('Athletic') || p.characteristics.includes('Bold'));
      if (activeMatch) bestMatch = activeMatch;
    }

    setResult(bestMatch);
    setStep(questions.length);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-150 shadow-xl overflow-hidden text-left">
      <div className="bg-[#0d2244] p-6 text-white border-b border-yellow-500/20">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-yellow-500/80">Breeders Match Tool</span>
        </div>
        <h3 className="text-xl font-black mt-1">Golden Personality Matcher</h3>
        <p className="text-[11px] text-gray-400 mt-1">Answer 3 questions to find the puppy that fits your family's unique lifestyle.</p>
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {step < questions.length ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-yellow-500/10 text-yellow-700 rounded-xl">
                  {questions[step].icon}
                </div>
                <h4 className="font-bold text-[#0d2244] leading-tight">
                  {questions[step].question}
                </h4>
              </div>

              <div className="space-y-3">
                {questions[step].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    className="w-full p-4 bg-gray-50 hover:bg-yellow-50 border border-gray-150 hover:border-yellow-500/50 rounded-2xl text-left transition-all duration-200 flex items-center justify-between group"
                  >
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-[#0d2244]">{opt.label}</span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-yellow-600 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>

              {/* Progress bar */}
              <div className="pt-4 flex items-center space-x-2">
                <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 transition-all duration-300"
                    style={{ width: `${(step / questions.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-[10px] font-mono font-bold text-gray-400">Step {step + 1} of 3</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="inline-flex p-3 bg-green-500/10 text-green-600 rounded-full mb-2">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-black text-[#0d2244]">We found a match!</h4>
                <p className="text-xs text-gray-500">Based on your choices, we recommend meeting:</p>
              </div>

              {result && (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 flex items-center space-x-4">
                  <EditableImage imageId={`puppy-image-${result.id}-current`} src={result.image} alt={result.name} className="w-20 h-20 rounded-xl object-cover shadow-sm border border-white" />
                  <div className="text-left">
                    <h5 className="font-black text-lg text-[#0d2244]">{result.name}</h5>
                    <p className="text-[11px] text-gray-500 line-clamp-2">{result.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {result.characteristics.slice(0, 2).map((c, i) => (
                        <span key={i} className="text-[9px] font-mono font-bold text-yellow-700 bg-yellow-500/10 px-2 py-0.5 rounded-full">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => {
                    if (result) {
                      onMatch(result.name);
                      setTab('apply');
                    }
                  }}
                  className="w-full sm:flex-1 py-3.5 bg-[#0d2244] text-white font-black text-xs rounded-xl shadow-lg hover:scale-105 transition-all"
                >
                  APPLY FOR {result?.name.toUpperCase()}
                </button>
                <button
                  onClick={reset}
                  className="flex items-center justify-center space-x-2 text-[10px] font-mono font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Retake Quiz</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
