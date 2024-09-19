import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

interface BasicBreadcrumbsProps {
  setViewType: (view: 'feeds' | 'following') => void; // Function to change view type
}

const BasicBreadcrumbs: React.FC<BasicBreadcrumbsProps> = ({ setViewType }) => {
  const [feDecoration, setFeDecoration] = React.useState('underline');
  const [foDecoration, setFoDecoration] = React.useState('none');

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, view: 'feeds' | 'following') => {
    event.preventDefault();
    setViewType(view);
  };

  return (
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="none" // Remove MUI's default underline behavior
          sx={{ textDecoration: feDecoration }}
          color="inherit"
          href="#"
          onClick={(event) => {
            handleClick(event, 'feeds');
            setFeDecoration('underline');
            setFoDecoration('none');
          }}
        >
          Feeds
        </Link>
        <Link
          underline="none" // Remove MUI's default underline behavior
          sx={{ textDecoration: foDecoration }}
          color="inherit"
          href="#"
          onClick={(event) => {
            handleClick(event, 'following');
            setFeDecoration('none');
            setFoDecoration('underline');
          }}
        >
          Following
        </Link>
      </Breadcrumbs>
    </div>
  );
};

export default BasicBreadcrumbs;
