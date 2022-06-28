import * as NextLink from 'next/link';
import { Link as MUILink } from '@mui/material';

type LinkProps = NextLink.LinkProps & { children?: React.ReactNode };

const Link = ({ children, href }: LinkProps) => (
  <NextLink.default href={href} passHref>
    <MUILink>{children}</MUILink>
  </NextLink.default>
);

export default Link;
