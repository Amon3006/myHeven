import React, { useRef } from 'react';
    import { Upload, Camera, ArrowRight, LayoutDashboard, Sparkles, TrendingUp } from 'lucide-react';
    
    interface HomeViewProps {
      onImageSelect: (file: File) => void;
    }
    
    const HomeView: React.FC<HomeViewProps> = ({ onImageSelect }) => {
      const fileInputRef = useRef<HTMLInputElement>(null);
    
      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
          onImageSelect(e.target.files[0]);
        }
      };
    
      const triggerFileInput = () => {
        fileInputRef.current?.click();
      };
    
      return (
        <div className="px-6 pt-8 pb-24">
          <header className="flex justify-between items-center mb-8">
            <div>
              <p className="text-sm text-gray-500 font-medium tracking-wide">WELCOME BACK</p>
              <h1 className="text-3xl font-serif text-gray-800">My HAVEN</h1>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                <img src="https://picsum.photos/100/100" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </header>
    
          {/* Main Action Cards */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <button onClick={triggerFileInput} className="flex flex-col items-center gap-2 p-3 bg-[#C68E68] text-white rounded-2xl shadow-lg shadow-[#C68E68]/20 transition active:scale-95">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Camera size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wide">Scan Room</span>
            </button>
    
            <button className="flex flex-col items-center gap-2 p-3 bg-[#8B9B86] text-white rounded-2xl shadow-lg shadow-[#8B9B86]/20 transition active:scale-95">
               <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <LayoutDashboard size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wide">Organize</span>
            </button>
    
            <button className="flex flex-col items-center gap-2 p-3 bg-white text-gray-400 rounded-2xl border border-gray-100 shadow-sm transition active:scale-95">
               <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wide">Progress</span>
            </button>
          </div>
    
          {/* Quick Upload Area */}
          <div 
            className="w-full aspect-[4/3] bg-white rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer mb-8"
            onClick={triggerFileInput}
          >
            <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-16 h-16 rounded-full bg-[#8B9B86]/10 text-[#8B9B86] flex items-center justify-center mb-3 relative z-10">
              <Upload size={28} />
            </div>
            <p className="text-gray-500 font-medium relative z-10">Upload from Gallery</p>
            <p className="text-xs text-gray-400 mt-1 relative z-10">Supports JPG, PNG</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>
    
          {/* Recent Scans / Mock Data */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-serif text-gray-800">Recent Spaces</h3>
            <button className="text-xs font-bold text-gray-400 hover:text-[#8B9B86]">View All</button>
          </div>
    
          <div className="space-y-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                <img src="https://picsum.photos/seed/room1/200/200" className="w-20 h-20 rounded-xl object-cover" alt="Living Room" />
                <div className="flex-1 py-1">
                    <h4 className="font-bold text-gray-800">Living Room</h4>
                    <p className="text-xs text-gray-500 mb-2">Scanned 2 days ago</p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#8B9B86]">
                        <Sparkles size={12} />
                        <span>3 Improvements found</span>
                    </div>
                </div>
            </div>
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                <img src="https://picsum.photos/seed/room2/200/200" className="w-20 h-20 rounded-xl object-cover" alt="Bedroom" />
                <div className="flex-1 py-1">
                    <h4 className="font-bold text-gray-800">Master Bedroom</h4>
                    <p className="text-xs text-gray-500 mb-2">Scanned 1 week ago</p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#8B9B86]">
                        <Sparkles size={12} />
                        <span>All clean!</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      );
    };
    
    export default HomeView;
    