import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface QuestionCardProps {
  image?: string;
  progress: number; // 0..100
  title: string;
  description?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ image, progress, title, description }) => {
  return (
    <Card>
      {image && (
        <div className="h-36 w-full overflow-hidden bg-slate-100 sm:h-44 lg:h-56">
          <img src={image} alt={title} className="h-full w-full object-cover" />
        </div>
      )}

      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        {description && <p className="mb-4 text-sm text-slate-600">{description}</p>}
        <Progress value={progress} className="h-2 rounded-full" />
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
