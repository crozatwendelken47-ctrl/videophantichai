import React, { useState, useRef } from 'react';
import { Upload, FileVideo, Download, Loader2, Play, CheckCircle2, AlertCircle, Copy, Check, X, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { analyzeRescueVideo, generateSRT, AnalysisResponse } from '@/src/services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface VideoItem {
  id: string;
  file: File;
  url: string;
  status: 'idle' | 'analyzing' | 'completed' | 'error';
  progress: number;
  analysis: AnalysisResponse | null;
  error: string | null;
}

export default function VideoAnalyzer() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isBatchAnalyzing, setIsBatchAnalyzing] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []) as File[];
    if (selectedFiles.length === 0) return;

    const newVideos: VideoItem[] = [];
    const existingCount = videos.length;
    const remainingSlots = 5 - existingCount;

    if (remainingSlots <= 0) {
      toast.error("Maximum 5 videos allowed.");
      return;
    }

    const filesToAdd = selectedFiles.slice(0, remainingSlots);
    if (selectedFiles.length > remainingSlots) {
      toast.warning(`Only ${remainingSlots} more videos could be added.`);
    }

    filesToAdd.forEach(file => {
      if (file.size > 100 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large (max 100MB).`);
        return;
      }

      newVideos.push({
        id: Math.random().toString(36).substr(2, 9),
        file,
        url: URL.createObjectURL(file),
        status: 'idle',
        progress: 0,
        analysis: null,
        error: null
      });
    });

    setVideos(prev => [...prev, ...newVideos]);
    if (!selectedVideoId && newVideos.length > 0) {
      setSelectedVideoId(newVideos[0].id);
    }
  };

  const removeVideo = (id: string) => {
    setVideos(prev => {
      const filtered = prev.filter(v => v.id !== id);
      if (selectedVideoId === id) {
        setSelectedVideoId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const analyzeSingleVideo = async (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (!video || video.status === 'completed') return;

    setVideos(prev => prev.map(v => v.id === videoId ? { ...v, status: 'analyzing', progress: 10 } : v));

    try {
      const base64 = await fileToBase64(video.file);
      setVideos(prev => prev.map(v => v.id === videoId ? { ...v, progress: 30 } : v));
      
      const result = await analyzeRescueVideo(base64, video.file.type);
      
      setVideos(prev => prev.map(v => v.id === videoId ? { 
        ...v, 
        status: 'completed', 
        progress: 100, 
        analysis: result 
      } : v));
      
      toast.success(`Analysis complete for ${video.file.name}`);
    } catch (err: any) {
      console.error(err);
      setVideos(prev => prev.map(v => v.id === videoId ? { 
        ...v, 
        status: 'error', 
        error: "Analysis failed. Please try again." 
      } : v));
      toast.error(`Failed to analyze ${video.file.name}`);
    }
  };

  const startBatchAnalysis = async () => {
    const idleVideos = videos.filter(v => v.status === 'idle' || v.status === 'error');
    if (idleVideos.length === 0) return;

    setIsBatchAnalyzing(true);
    
    // Process in sequence to avoid hitting rate limits too hard
    for (const video of idleVideos) {
      await analyzeSingleVideo(video.id);
    }
    
    setIsBatchAnalyzing(false);
    toast.success("Batch analysis finished!");
  };

  const downloadSRT = (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (!video || !video.analysis) return;

    try {
      const srtContent = generateSRT(video.analysis.segments);
      const blob = new Blob([srtContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const baseName = video.file.name.replace(/\.[^/.]+$/, "") || 'rescue_script';
      a.download = `${baseName}.srt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Failed to download file.");
    }
  };

  const downloadAllSRTs = () => {
    const completedVideos = videos.filter(v => v.status === 'completed' && v.analysis);
    if (completedVideos.length === 0) return;

    completedVideos.forEach(video => {
      downloadSRT(video.id);
    });

    toast.success(`Downloading ${completedVideos.length} SRT files...`);
  };

  const selectedVideo = videos.find(v => v.id === selectedVideoId);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <header className="text-center space-y-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-2 px-3 py-1 border-amber-200 text-amber-700 bg-amber-50">
            Rescue Animal AI • Batch Mode
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Animal Rescue Scriptwriter
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload up to 5 videos and generate detailed voiceover scripts in batch.
          </p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Video List & Upload (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 overflow-hidden">
            <CardContent className="p-0">
              {videos.length < 5 ? (
                <div 
                  className="flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                    <Upload className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">Add videos ({videos.length}/5)</p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="video/*" 
                    multiple
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm font-medium text-slate-500">Maximum videos reached</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Queue</h3>
              {videos.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => setVideos([])}
                >
                  Clear All
                </Button>
              )}
            </div>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {videos.map((video) => (
                  <div 
                    key={video.id}
                    className={`group relative p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedVideoId === video.id 
                        ? 'bg-amber-50 border-amber-200 shadow-sm' 
                        : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                    onClick={() => setSelectedVideoId(video.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded bg-slate-100 flex items-center justify-center overflow-hidden">
                        {video.status === 'completed' ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        ) : video.status === 'analyzing' ? (
                          <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                        ) : (
                          <FileVideo className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{video.file.name}</p>
                        <p className="text-xs text-slate-500">
                          {video.status === 'idle' ? 'Ready' : video.status}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeVideo(video.id);
                        }}
                      >
                        <X className="h-4 w-4 text-slate-400" />
                      </Button>
                    </div>
                    {video.status === 'analyzing' && (
                      <Progress value={video.progress} className="h-1 mt-2 bg-slate-100" />
                    )}
                  </div>
                ))}
                {videos.length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    <p className="text-sm italic">No videos added yet</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {videos.length > 0 && (
            <div className="space-y-2">
              <Button 
                className="w-full h-11 bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-200"
                onClick={startBatchAnalysis}
                disabled={isBatchAnalyzing || videos.every(v => v.status === 'completed')}
              >
                {isBatchAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Batch...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4 fill-current" />
                    Analyze All
                  </>
                )}
              </Button>
              
              {videos.some(v => v.status === 'completed') && (
                <Button 
                  variant="outline"
                  className="w-full h-11 border-slate-200 text-slate-700"
                  onClick={downloadAllSRTs}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download All SRTs
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Preview & Results (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {selectedVideo ? (
              <motion.div
                key={selectedVideo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <Card className="overflow-hidden border-slate-200">
                  <video 
                    src={selectedVideo.url} 
                    controls 
                    className="w-full aspect-video bg-black object-contain"
                  />
                </Card>

                {selectedVideo.analysis ? (
                  <Card className="border-amber-100 shadow-xl shadow-amber-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-xl flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            Script for {selectedVideo.file.name}
                          </CardTitle>
                          <CardDescription>
                            {selectedVideo.analysis.summary}
                          </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => downloadSRT(selectedVideo.id)} className="gap-2">
                          <Download className="h-4 w-4" />
                          Download SRT
                        </Button>
                      </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="p-0">
                      <ScrollArea className="h-[400px] p-6">
                        <div className="space-y-8">
                          {selectedVideo.analysis.segments.map((segment, idx) => (
                            <div key={idx} className="relative pl-8 border-l-2 border-slate-100 last:border-0 pb-2">
                              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-amber-500 border-4 border-white shadow-sm" />
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">
                                      {segment.startTime}s - {segment.endTime}s
                                    </span>
                                    <span className="text-xs font-medium text-slate-500 italic">
                                      {segment.description}
                                    </span>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-slate-400 hover:text-amber-600"
                                    onClick={() => copyToClipboard(segment.script, idx)}
                                  >
                                    {copiedIndex === idx ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                  </Button>
                                </div>
                                <p className="text-slate-800 leading-relaxed font-medium">
                                  "{segment.script}"
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                    <CardFooter className="bg-slate-50/50 p-4">
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                        Analyzed by Gemini 3 Flash • Rescue Edition
                      </p>
                    </CardFooter>
                  </Card>
                ) : selectedVideo.status === 'analyzing' ? (
                  <Card className="p-12 text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-amber-500 mx-auto" />
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Analyzing Video...</h3>
                      <p className="text-sm text-slate-500 max-w-xs mx-auto">
                        We are processing {selectedVideo.file.name}. This may take a moment.
                      </p>
                    </div>
                    <Progress value={selectedVideo.progress} className="max-w-xs mx-auto h-2" />
                  </Card>
                ) : selectedVideo.status === 'error' ? (
                  <Card className="p-12 text-center space-y-4 border-red-100 bg-red-50/30">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-red-900">Analysis Failed</h3>
                      <p className="text-sm text-red-700 max-w-xs mx-auto">
                        {selectedVideo.error}
                      </p>
                    </div>
                    <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-100" onClick={() => analyzeSingleVideo(selectedVideo.id)}>
                      Retry Analysis
                    </Button>
                  </Card>
                ) : (
                  <Card className="p-12 text-center space-y-4 border-dashed border-2">
                    <Layers className="h-12 w-12 text-slate-300 mx-auto" />
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-slate-900">Ready for Analysis</h3>
                      <p className="text-sm text-slate-500 max-w-xs mx-auto">
                        Click "Analyze All" or start individual analysis for this video.
                      </p>
                    </div>
                    <Button onClick={() => analyzeSingleVideo(selectedVideo.id)}>
                      Analyze This Video
                    </Button>
                  </Card>
                )}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/30 min-h-[500px]">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <FileVideo className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-medium text-slate-900">Select or upload videos</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-xs">
                  You can upload up to 5 videos at once and process them in a batch.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
