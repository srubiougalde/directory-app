import React from "react";
import { Helmet } from "react-helmet";


const PageTitle = ({ children }: { children: string }) => {
  return (
    <Helmet>
      <title> Directory - {children}</title>
    </Helmet>
  );
};

export default PageTitle;
