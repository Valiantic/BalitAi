export interface MainSectionProps {
  onScanNews: () => Promise<void>;
  loading: boolean;
  error: string | null;
  onClearError: () => void;
}