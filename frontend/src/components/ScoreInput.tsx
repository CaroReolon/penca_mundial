import { Button } from '@/components/ui/button';

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export function ScoreInput({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => onChange(Math.max(0, value - 1))}
      >
        -
      </Button>

      <span className="w-8 text-center text-lg font-bold">{value}</span>

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => onChange(value + 1)}
      >
        +
      </Button>
    </div>
  );
}
