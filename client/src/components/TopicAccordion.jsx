import React, { memo, Suspense } from 'react';
const SubtopicTable = React.lazy(() => import('./SubtopicTable.jsx'));

function TopicAccordion({ name, subs, expanded, onToggle, onCheck, done, progressSet }) {
  return (
    <div className="accordion">
      <div className="accordion-header" onClick={() => onToggle(name)}>
        <div>{name} <span className={`badge ${done ? 'done' : 'pending'}`}>{done ? 'Done' : 'Pending'}</span></div>
        <div className="chev">{expanded ? '▴' : '▾'}</div>
      </div>

      {expanded && (
        <div className="accordion-body">
          <h3>Sub Topics</h3>
          <Suspense fallback={<div>Loading table…</div>}>
            {/* pass progressSet down so table shows correct checked state */}
            <SubtopicTable subs={subs} onCheck={onCheck} progressSet={progressSet} />
          </Suspense>
        </div>
      )}
    </div>
  );
}

export default memo(TopicAccordion);
