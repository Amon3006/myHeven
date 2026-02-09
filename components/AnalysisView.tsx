import React from 'react';
import { RoomAnalysis, DeclutterItem, FurnitureItem } from '../types';
import { CheckCircle2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

interface AnalysisViewProps {
  analysis: RoomAnalysis;
  image: string;
  onReset: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ analysis, image, onReset }) => {
  return (
    <div className="pb-24 animate-fade-in">
      <div className="relative h-64 w-full">
        <img 
          src={image} 
          alt="Analyzed Room" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 text-white w-full">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm font-medium opacity-90 uppercase tracking-wider mb-1">Analysis Complete</p>
                <h2 className="text-3xl font-serif font-bold">{analysis.roomType}</h2>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs border border-white/30">
                {analysis.styleAnalysis.split(' ').slice(0, 3).join(' ')}...
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-[#C68E68]" size={20} />
            <h3 className="text-lg font-bold text-gray-800">Style Analysis</h3>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm">
            {analysis.styleAnalysis}
          </p>
        </div>

        <h3 className="text-lg font-serif font-bold text-gray-800 mb-3 ml-1">Decluttering Plan</h3>
        <div className="space-y-3 mb-8">
          {analysis.decluttering.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-start">
              <div className="mt-1 text-[#8B9B86]">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{item.action}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-serif font-bold text-gray-800 mb-3 ml-1">Furniture Refresh</h3>
        <div className="space-y-4 mb-8">
          {analysis.furniture.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-800">{item.item}</h4>
                  <span className="text-xs font-bold text-[#C68E68] bg-[#C68E68]/10 px-2 py-1 rounded-md">
                    {item.priceEstimate || "Estimate varies"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3">{item.suggestion}</p>
                <button className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-[#8B9B86] border border-[#8B9B86] rounded-lg hover:bg-[#8B9B86] hover:text-white transition">
                  <ShoppingBag size={14} />
                  Shop Similar Items
                </button>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={onReset}
          className="w-full bg-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-300 transition mb-4"
        >
          Analyze Another Room
        </button>
      </div>
    </div>
  );
};

export default AnalysisView;
