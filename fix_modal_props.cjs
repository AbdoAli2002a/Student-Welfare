const fs = require('fs');
let code = fs.readFileSync('src/components/ActivityGuide.tsx', 'utf8');

const modalOld = `<ActivityReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          committeeName={committees.find(c => c.id === activeCommittee)?.name || ''}
          committeeId={activeCommittee}
          onSubmitReview={handleAddReview}
        />`;

const modalNew = `<ActivityReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedReviewActivity('');
          }}
          committeeName={committees.find(c => c.id === activeCommittee)?.name || ''}
          committeeId={activeCommittee}
          initialActivityName={selectedReviewActivity}
          onSubmitReview={handleAddReview}
        />`;

if(code.includes(modalOld)) {
   code = code.replace(modalOld, modalNew);
} else {
   // regex replace
   code = code.replace(/<ActivityReviewModal[\s\S]*?onSubmitReview={handleAddReview}\s*\/>/, modalNew);
}

fs.writeFileSync('src/components/ActivityGuide.tsx', code);
