import { HelmetProvider, Helmet } from "react-helmet-async";
import { useEffect } from "react";

const PageMeta = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
  </Helmet>
);

export const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return <HelmetProvider>{children}</HelmetProvider>;
};

export default PageMeta;
