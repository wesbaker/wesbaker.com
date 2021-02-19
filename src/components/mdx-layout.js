import React from "react";
import PropTypes from "prop-types";
import { graphql, useStaticQuery, Link } from "gatsby";
import { MDXProvider } from "@mdx-js/react";
import Layout from "./layout";
import Bio from "../components/bio";
import SEO from "../components/seo";

const shortcodes = { Link };

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
    <MDXProvider components={shortcodes}>
      <Layout location={{ pathname: path }} title={site.siteMetadata.title}>
        <SEO title={title} />
        {children}
        <hr style={{ marginBottom: "1.45rem" }} />
        <Bio />
      </Layout>
    </MDXProvider>
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
