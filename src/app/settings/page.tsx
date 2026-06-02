"use client";

import { useAppStore, AIModel } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Save, Settings2 } from 'lucide-react';
import { ManageSkills } from '@/components/ManageSkills';

const MODELS: { id: AIModel; name: string }[] = [
  { id: 'gemini', name: 'Gemini (Google)' },
  { id: 'groq', name: 'Groq (Fast)' },
  { id: 'openrouter', name: 'OpenRouter' },
  { id: 'huggingface', name: 'HuggingFace' },
  { id: 'ollama', name: 'Ollama (Local)' },
];

export default function SettingsPage() {
  const { settings, updateSettings } = useAppStore();
  const [model, setModel] = useState<AIModel>(settings.model);
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings({ model, apiKey });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <Settings2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-white/60 text-sm mt-1">Configure your AI models and preferences</p>
        </div>
      </div>

      <Card className="glass-panel border-white/10">
        <CardHeader>
          <CardTitle className="text-xl text-white">AI Configuration</CardTitle>
          <CardDescription className="text-white/50">
            Select your preferred AI model and enter the corresponding API key.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-white/80">AI Model</Label>
            <Select value={model} onValueChange={(val: AIModel) => setModel(val)}>
              <SelectTrigger className="w-full bg-black/20 border-white/10 text-white focus:ring-blue-500/50 rounded-xl h-12">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-xl border-white/10 text-white">
                {MODELS.map((m) => (
                  <SelectItem key={m.id} value={m.id} className="focus:bg-white/10 focus:text-white cursor-pointer rounded-lg mx-1 my-1">
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {model !== 'ollama' && (
            <div className="space-y-3">
              <Label className="text-white/80">API Key</Label>
              <Input 
                type="password" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Enter your ${MODELS.find(m => m.id === model)?.name} API Key`}
                className="bg-black/20 border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl focus-visible:ring-blue-500/50"
              />
              <p className="text-xs text-white/40">Your key is stored locally in your browser and never sent to our servers.</p>
            </div>
          )}

          <Button 
            onClick={handleSave} 
            className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 mt-4"
          >
            <Save className="h-4 w-4 mr-2" />
            {saved ? 'Saved Successfully' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>

      <ManageSkills />
    </div>
  );
}
