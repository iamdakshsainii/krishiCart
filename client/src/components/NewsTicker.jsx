import React from 'react';
import { Zap } from 'lucide-react';

export default function NewsTicker({ items = [] }) {
  if (!items.length) return null;

  return (
    <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="max-w-6xl mx-auto py-3 overflow-hidden">
        <div className="flex items-center gap-3">
          {/* Breaking News Label */}
          <div className="flex-shrink-0 flex items-center gap-2 px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full">
            <Zap size={14} className="text-yellow-300" />
            <span className="font-bold text-sm">LATEST</span>
          </div>

          {/* Scrolling Content */}
          <div className="flex-1 relative">
            <div className="animate-[marquee_25s_linear_infinite] whitespace-nowrap">
              {items.map((item, i) => (
                <span key={i} className="mx-8 text-sm font-medium">
                  • {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </div>
  );
}


// // components/NewsTicker.jsx
// export default function NewsTicker({ headlines }) {
//   return (
//     <div className="bg-green-700 text-white py-2 overflow-hidden">
//       <div className="animate-marquee whitespace-nowrap">
//         {headlines.map((h, i) => (
//           <span key={i} className="mx-4">{h}</span>
//         ))}
//       </div>
//     </div>
//   );
// }
