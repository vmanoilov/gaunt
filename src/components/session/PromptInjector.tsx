import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface PromptInjectorProps {
  seedPrompt: string;
  onUpdate: (prompt: string) => void;
}

export function PromptInjector({ seedPrompt, onUpdate }: PromptInjectorProps) {
  const [prompt, setPrompt] = useState(seedPrompt);

  const handleSave = () => {
    onUpdate(prompt);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seed Prompt</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter the seed prompt for the Gauntlet session..."
          rows={4}
        />
        <Button onClick={handleSave} size="sm">
          Update Prompt
        </Button>
      </CardContent>
    </Card>
  );
}
