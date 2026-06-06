"use client";

import { useAppStore, AIModel } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Save, Settings2, LogIn, LogOut, UserCircle } from 'lucide-react';
import { ManageSkills } from '@/components/ManageSkills';
import { useAuth } from '@/lib/auth-context';

const MODELS: { id: AIModel; name: string }[] = [
  { id: 'gemini-flash-lite-latest', name: 'Gemini Flash Lite (Fastest & Free)' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro (Heavy Duty)' },
  { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash (Cutting Edge)' },
];

export default function SettingsPage() {
  const { settings, updateSettings } = useAppStore();
  const [model, setModel] = useState<AIModel>(settings.model);
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [saved, setSaved] = useState(false);
  const { user, loading, login, logout } = useAuth();

  const handleSave = () => {
    updateSettings({ model, apiKey });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
          <Settings2 className="h-6 w-6 text-slate-800 dark:text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-500 dark:text-white/60 text-sm mt-1">Configure your AI models and preferences</p>
        </div>
      </div>

      <Card className="glass-panel border-slate-200 dark:border-white/10 mb-8">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-blue-500" /> Account
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-white/50">
            Manage your profile and history synchronization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-slate-500">Loading...</p>
          ) : user ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                {user.photoURL ? (
                  <img src={user.photoURL} referrerPolicy="no-referrer" alt="Profile" className="w-16 h-16 rounded-full shadow-md object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shadow-md">
                    <UserCircle className="w-8 h-8 text-blue-500" />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">{user.displayName || 'User'}</h2>
                  <p className="text-sm text-slate-500 dark:text-white/60">{user.email}</p>
                </div>
              </div>
              <Button onClick={logout} variant="outline" className="w-full sm:w-auto">
                <LogOut className="w-4 h-4 mr-2" /> Log Out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-slate-600 dark:text-white/70 text-sm max-w-md text-center sm:text-left">
                Sign in to save your history and access your vocabulary from anywhere.
              </p>
              <Button onClick={login} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                <LogIn className="w-4 h-4 mr-2" /> Sign In
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass-panel border-slate-200 dark:border-white/10 mb-8">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900 dark:text-white">AI Configuration</CardTitle>
          <CardDescription className="text-slate-500 dark:text-white/50">
            Select your preferred AI model.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-slate-700 dark:text-white/80">AI Model</Label>
            <Select value={model} onValueChange={(val) => { if (val) setModel(val as AIModel); }}>
              <SelectTrigger className="w-full bg-slate-100 dark:bg-black/20 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-blue-500/50 rounded-xl h-12">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 dark:bg-background/95 backdrop-blur-xl border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                {MODELS.map((m) => (
                  <SelectItem key={m.id} value={m.id} className="focus:bg-slate-100 dark:focus:bg-white/10 focus:text-slate-900 dark:focus:text-white cursor-pointer rounded-lg mx-1 my-1">
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
