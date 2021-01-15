import React from "react";
import PropTypes from "prop-types";
import { graphql, useStaticQuery } from "gatsby";
import Layout from "./layout";
import Bio from "../components/bio";
import SEO from "../components/seo";

function MdxLayout({
  children,
  pageContext: {
    frontmatter: { path, title },
  },
}) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  );

  return (
    <Layout location={{ pathname: path }} title={site.siteMetadata.title}>
      <SEO title={title} />
      {children}
      <hr style={{ marginBottom: "1.45rem" }} />
      <Bio />
    </Layout>
  );
}

MdxLayout.propTypes = {
  children: PropTypes.node,
  pageContext: PropTypes.shape({
    frontmatter: PropTypes.shape({
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
  }),
};

export default MdxLayout;
