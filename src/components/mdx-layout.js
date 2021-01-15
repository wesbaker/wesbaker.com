import React from "react";
import PropTypes from "prop-types";
import Layout from "./layout";
import Bio from "../components/bio";
import SEO from "../components/seo";

function MdxLayout({
  children,
  pageContext: {
    frontmatter: { path, title },
  },
}) {
  return (
    <Layout location={{ pathname: path }}>
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
