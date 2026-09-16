const fs = require('fs');
let code = fs.readFileSync('src/components/ActivityReviewModal.tsx', 'utf8');

const interfaceOld = `interface ActivityReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  committeeName: string;
  committeeId: string;
  onSubmitReview: (committeeId: string, review: { activityName: string; rating: number; comment: string }) => void;
}`;
const interfaceNew = `interface ActivityReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  committeeName: string;
  committeeId: string;
  initialActivityName?: string;
  onSubmitReview: (committeeId: string, review: { activityName: string; rating: number; comment: string }) => void;
}`;
code = code.replace(interfaceOld, interfaceNew);

const componentOld = `export default function ActivityReviewModal({ isOpen, onClose, committeeName, committeeId, onSubmitReview }: ActivityReviewModalProps) {
  const { addToast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    activityName: '',
    comment: ''
  });`;

const componentNew = `import { useEffect } from 'react';
export default function ActivityReviewModal({ isOpen, onClose, committeeName, committeeId, initialActivityName, onSubmitReview }: ActivityReviewModalProps) {
  const { addToast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    activityName: '',
    comment: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, activityName: initialActivityName || '' }));
      setRating(0);
    }
  }, [isOpen, initialActivityName]);`;

// Need to remove the extra import { useEffect } from 'react'; because it's already there? Let's check imports.
code = code.replace(componentOld, componentNew);

fs.writeFileSync('src/components/ActivityReviewModal.tsx', code);
