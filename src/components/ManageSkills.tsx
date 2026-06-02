"use client";

import { useState } from 'react';
import { useAppStore, Skill } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

export function ManageSkills() {
  const { skills, addSkill, updateSkill, removeSkill } = useAppStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Skill>>({});
  const [isAdding, setIsAdding] = useState(false);

  const startEdit = (skill: Skill) => {
    setIsAdding(false);
    setEditingId(skill.id);
    setFormData({ name: skill.name, description: skill.description, promptTemplate: skill.promptTemplate });
  };

  const startAdd = () => {
    setEditingId(null);
    setIsAdding(true);
    setFormData({ name: '', description: '', promptTemplate: '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({});
  };

  const saveSkill = () => {
    if (!formData.name || !formData.promptTemplate) return;
    
    if (isAdding) {
      addSkill({
        name: formData.name,
        description: formData.description || '',
        promptTemplate: formData.promptTemplate
      });
    } else if (editingId) {
      updateSkill(editingId, formData);
    }
    cancelEdit();
  };

  return (
    <Card className="glass-panel border-white/10 mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl text-white">Learning Skills</CardTitle>
          <CardDescription className="text-white/50">
            Customize AI prompt templates for different learning modes.
          </CardDescription>
        </div>
        {!isAdding && !editingId && (
          <Button onClick={startAdd} variant="outline" size="sm" className="bg-white/5 border-white/10 text-white">
            <Plus className="h-4 w-4 mr-2" /> Add Skill
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {(isAdding || editingId) && (
          <div className="p-4 rounded-xl border border-white/10 bg-black/20 space-y-4 mb-6">
            <div className="space-y-2">
              <Label className="text-white/80">Skill Name</Label>
              <Input 
                value={formData.name || ''} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Creative Writing"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80">Description</Label>
              <Input 
                value={formData.description || ''} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Short description for the dropdown"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80">Prompt Template</Label>
              <Textarea 
                value={formData.promptTemplate || ''} 
                onChange={(e) => setFormData({ ...formData, promptTemplate: e.target.value })}
                placeholder="You are a creative writing coach. Explain the word..."
                className="bg-white/5 border-white/10 text-white min-h-[100px]"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="ghost" onClick={cancelEdit} className="text-white/60 hover:text-white">
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
              <Button onClick={saveSkill} className="bg-blue-600 hover:bg-blue-500 text-white">
                <Check className="h-4 w-4 mr-2" /> Save
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {skills.map((skill) => (
            <div key={skill.id} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5">
              <div>
                <h4 className="font-medium text-white">{skill.name}</h4>
                <p className="text-sm text-white/50">{skill.description}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => startEdit(skill)} className="text-white/60 hover:text-blue-400">
                  <Edit2 className="h-4 w-4" />
                </Button>
                {skills.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => removeSkill(skill.id)} className="text-white/60 hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
