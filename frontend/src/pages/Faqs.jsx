import React, { useState } from 'react';

const FAQ_ITEMS = [
  { q: 'How long can I rent a vault piece?', a: 'Standard rental cycles are 3, 5, or 7 days. If you require longer periods for destination weddings, please contact our support desk.' },
  { q: 'Is the security deposit fully refundable?', a: 'Yes. The deposit is refunded in full to your original card payment once the jewelry returns and passes inspections.' },
  { q: 'How do you handle hygiene and safety?', a: 'Every vault piece is ultrasonically sanitized, polished, and vacuum-sealed in a clean box environment prior to delivery.' },
  { q: 'What happens if a piece is accidentally damaged?', a: 'We secure transit insurance on all orders. Basic wear is covered. Critical cracks or lost gemstones will involve deductions from the security deposit.' }
];

function Faqs() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-serif text-white text-center mb-10">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {FAQ_ITEMS.map((item, idx) => (
          <div key={idx} className="glass-panel rounded-xl overflow-hidden border border-slate-800">
            <button onClick={() => setOpenIdx(openIdx === idx ? null : idx)} className="w-full p-5 text-left text-sm text-white font-serif flex justify-between items-center focus:outline-none">
              <span>{item.q}</span>
              <span>{openIdx === idx ? '▲' : '▼'}</span>
            </button>
            {openIdx === idx && (
              <div className="p-5 border-t border-slate-900 text-xs text-slate-400 leading-relaxed font-light bg-luxury-dark/30">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Faqs;
