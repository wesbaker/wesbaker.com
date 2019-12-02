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
        <p>
          I get{" "}
          <a href="https://wesbos.com/uses/">no emails about what I use</a>, but
          I love bikeshedding about tools. Here's what I'm currently using.
        </p>
        <h2>Editor & Terminal</h2>
        <ul>
          <li>
            <a href="https://code.visualstudio.com">Visual Studio Code</a> is my
            editor. A younger me would be horrified that I was both using and
            enjoying a Microsoft product.
          </li>
          <li>
            I mostly use Wes Bos's{" "}
            <a href="https://marketplace.visualstudio.com/items?itemName=wesbos.theme-cobalt2">
              Cobalt2
            </a>{" "}
            themes everywhere.
          </li>
          <li>
            I use{" "}
            <a href="https://www.typography.com/fonts/operator/overview">
              Operator Mono
            </a>{" "}
            for my editor font everywhere.
          </li>
          <li>
            I use <a href="https://iterm2.com">iTerm</a> for my terminal. I
            tried using <a href="https://hyper.is">Hyper</a>, but had a number
            of performance issues that are likely unique to anyone using a
            terminal where there are thousands of lines being added every
            minute.
          </li>
        </ul>
        <h2>Desktop Apps</h2>
        <ul>
          <li>
            I live by <a href="https://www.alfredapp.com">Alfred</a> and have
            made{" "}
            <a href="https://github.com/wesbaker?utf8=✓&tab=repositories&q=alfred&type=&language=">
              a number of workflows
            </a>{" "}
            for it.
          </li>
          <li>
            I use <a href="https://todoist.com/">Todoist</a> until Things
            supports teams/families.
          </li>
          <li>
            All of my notes go into <a href="https://bear.app">Bear</a>.
          </li>
        </ul>
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
