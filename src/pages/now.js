import React from "react";
import { Link, graphql } from "gatsby";

import Bio from "../components/bio";
import Layout from "../components/layout";
import SEO from "../components/seo";

class Now extends React.Component {
  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="Now" />
        <h1>Now</h1>
        <p>Sometimes I use things.</p>
        <hr style={{ marginBottom: "1.45rem" }} />
        <Bio />
      </Layout>
    );
  }
}

export default Now;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
