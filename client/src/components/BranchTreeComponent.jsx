import React from 'react';

const Branch = ({ branch, onDelete, onSelect }) => (
    <div className="branch-node">
        <div className="branch-name" onClick={() => onSelect(branch.id)}>
            {branch.name}
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(branch.id); }}
                style={{ background: '#ac1a1a', padding: '2px 4px', marginLeft: '10px' }}
            >
                🗑️
            </button>
            {branch.children?.length > 0 && (
                <span style={{ color: '#666', fontSize: '0.8em' }}>(↓ {branch.children.length})</span>
            )}
        </div>
        {branch.children?.length > 0 && (
            <div className="branch-children">
                {branch.children.map(child => (
                    <Branch
                        key={child.id}
                        branch={child}
                        onDelete={onDelete}
                        onSelect={onSelect}
                    />
                ))}
            </div>
        )}
    </div>
);

export const BranchTree = ({ branches, onBranchSelect, onBranchDelete }) => {
    return (
        <div className="tree">
            {branches.map(branch => (
                <Branch
                    key={branch.id}
                    branch={branch}
                    onDelete={onBranchDelete}
                    onSelect={onBranchSelect}
                />
            ))}
        </div>
    );
};