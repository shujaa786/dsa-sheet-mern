import React, { memo } from 'react';

function SubtopicTable({ subs = [], onCheck = () => {}, progressSet = new Set() }) {
  return (
    <div className="table-wrap">
      <table className="subtable">
        <thead>
          <tr>
            <th style={{width:'40%'}}>Name</th>
            <th>LeetCode Link</th>
            <th>YouTube Link</th>
            <th>Article Link</th>
            <th>Level</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {subs.map(st => {
            const id = st._id || st.id;
            const done = id && progressSet.has(id);
            return (
              <tr key={id || Math.random()}>
                <td>
                  <label style={{display:'flex', alignItems:'center', gap:8}}>
                    <input
                      type="checkbox"
                      checked={!!done}
                      onChange={() => onCheck(id)}
                      style={{ cursor: 'pointer' }}   /* <- makes cursor pointer */
                    />
                    <span>{st.name}</span>
                  </label>
                </td>
                <td>{st.leetcode ? <a href={st.leetcode} target="_blank" rel="noreferrer">Practice</a> : '-'}</td>
                <td>{st.youtube ? <a href={st.youtube} target="_blank" rel="noreferrer">Watch</a> : '-'}</td>
                <td>{st.article ? <a href={st.article} target="_blank" rel="noreferrer">Read</a> : '-'}</td>
                <td>{st.level || 'Easy'}</td>
                <td>{done ? <span className="status done">Done</span> : <span className="status pending">Pending</span>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default memo(SubtopicTable);
