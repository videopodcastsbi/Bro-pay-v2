import React from 'react';
import './Skeleton.css';

export const SkeletonText: React.FC<{ width?: string; className?: string }> = ({ width = '100%', className = '' }) => (
  <div className={`skeleton-box skeleton-text-box ${className}`} style={{ width }}></div>
);

export const SkeletonAvatar: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <div className="skeleton-box skeleton-avatar-box" style={{ width: size, height: size }}></div>
);

export const SkeletonCard: React.FC<{ height?: number }> = ({ height = 200 }) => (
  <div className="skeleton-box skeleton-card-box" style={{ height }}></div>
);
