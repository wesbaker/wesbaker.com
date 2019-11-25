import React from "react";
import { graphql } from "gatsby";

import Bio from "../components/bio";
import Layout from "../components/layout";
import SEO from "../components/seo";

class Uses extends React.Component {
  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="Uses" />
        <h1>Uses</h1>
        <p>Sometimes I use things.</p>
        <hr style={{ marginBottom: "1.45rem" }} />
        <Bio />
      </Layout>
    );
  }
}

export default Uses;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
