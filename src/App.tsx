import VideoAnalyzer from './components/VideoAnalyzer';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <div className="min-h-screen bg-[#fdfcfb]">
      <VideoAnalyzer />
      <Toaster position="top-center" />
    </div>
  );
}
