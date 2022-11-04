import { css } from '@emotion/react';
import { useState } from 'react';

import { LoadingSpinner } from './LoadingSpinner';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element | string;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  accented?: boolean;
  onClick?: () => void;
}

export const ButtonSmall: React.FC<Props> = ({
  children,
  onClick,
  className,
  loading,
  disabled,
  ...props
}: Props) => {
  const [loadingClick, setLoadingClick] = useState(false);
  return (
    <div
      {...props}
      className={`cursor-pointer flex items-center justify-center gap-1 rounded-xl border-[0px] border-border px-3 py-2 transition-all ${className} ${
        disabled ? 'bg-blueGray-400' : 'bg-blueGray-600 hover:shadow-lg'
      }`}
      css={css`
        white-space: break-spaces;
      `}
      onClick={async () => {
        if (!onClick || disabled) return;
        try {
          setLoadingClick(true);
          await onClick();
        } finally {
          setLoadingClick(false);
        }
      }}
    >
      {loadingClick || loading ? <LoadingSpinner height="25px" /> : children}
    </div>
  );
};
