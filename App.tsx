import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import HomeView from './components/HomeView';
import AnalysisView from './components/AnalysisView';
import ChatOverlay from './components/ChatOverlay';
import { analyzeRoomImage } from './services/geminiService';
import { RoomAnalysis, AppView } from './types';
import { Home, Scan, Lightbulb, User } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [analyzedData, setAnalyzedData] = useState<RoomAnalysis | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Convert File to Base64
  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      // Remove data URL prefix for Gemini API (it expects raw base64 sometimes, but the SDK helper handles inlineData nicely usually if we strip prefix for some manual calls, 
      // but strictly the SDK `inlineData` expects the base64 string WITHOUT the `data:image/...;base64,` prefix)
      const base64Data = base64.split(',')[1];
      
      setUploadedImage(base64); // Keep full string for <img> src
      setCurrentView(AppView.UPLOAD); // Temporary loading state view
      setIsAnalyzing(true);

      try {
        const result = await analyzeRoomImage(base64Data);
        setAnalyzedData(result);
        setCurrentView(AppView.RESULTS);
      } catch (error) {
        alert("Failed to analyze image. Please try again.");
        setCurrentView(AppView.HOME);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setAnalyzedData(null);
    setUploadedImage(null);
    setCurrentView(AppView.HOME);
  };

  const renderContent = () => {
    if (isAnalyzing) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F8F5F1] p-6 text-center">
                <div className="relative w-32 h-32 mb-8">
                    <div className="absolute inset-0 border-4 border-[#C68E68]/30 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[#C68E68] rounded-full border-t-transparent animate-spin"></div>
                    <Scan className="absolute inset-0 m-auto text-[#8B9B86] animate-pulse" size={40} />
                </div>
                <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Analyzing Your Haven</h2>
                <p className="text-gray-500">Identifying furniture styles and clutter patterns...</p>
            </div>
        );
    }

    switch (currentView) {
      case AppView.HOME:
        return <HomeView onImageSelect={handleImageSelect} />;
      case AppView.RESULTS:
        return analyzedData && uploadedImage ? (
          <AnalysisView 
            analysis={analyzedData} 
            image={uploadedImage} 
            onReset={handleReset} 
          />
        ) : null;
      default:
        return <HomeView onImageSelect={handleImageSelect} />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F8F5F1] shadow-2xl relative overflow-hidden no-scrollbar">
      {renderContent()}

      {/* Persistent Chat Overlay */}
      <ChatOverlay analyzedImage={uploadedImage?.split(',')[1]} />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 max-w-md w-full bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center z-40 text-xs font-medium text-gray-400">
        <button 
          onClick={() => setCurrentView(AppView.HOME)} 
          className={`flex flex-col items-center gap-1 transition ${currentView === AppView.HOME && !isAnalyzing ? 'text-[#8B9B86]' : 'hover:text-gray-600'}`}
        >
          <Home size={24} strokeWidth={currentView === AppView.HOME ? 2.5 : 2} />
          <span>Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:text-gray-600 transition">
          <Scan size={24} />
          <span>Scan</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:text-gray-600 transition">
          <Lightbulb size={24} />
          <span>Ideas</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:text-gray-600 transition">
          <User size={24} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
