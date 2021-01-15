import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";

import Bio from "../components/bio";
import Layout from "../components/layout";
import SEO from "../components/seo";

class Uses extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    location: PropTypes.object,
  };

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
          I love bikeshedding about tools. Here&rsquo;s what I&rsquo;m currently
          using.
        </p>
        <h2>Editor & Terminal</h2>
        <ul>
          <li>
            <a href="https://code.visualstudio.com">Visual Studio Code</a> is my
            editor. A younger me would be horrified that I was both using and
            enjoying a Microsoft product.
          </li>
          <li>
            I mostly use Wes Bos&rsquo;s{" "}
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
            I use Apple Reminders and Calendar in concert with{" "}
            <a href="https://www.calnewport.com/blog/2013/12/21/deep-habits-the-importance-of-planning-every-minute-of-your-work-day/">
              timeblock planning.
            </a>
          </li>
          <li>
            All of my notes go into <a href="https://bear.app">Bear</a>.
          </li>
        </ul>
        <h2>The Rest</h2>
        <p>
          You can see the rest of what I&rsquo;m using in my{" "}
          <a href="https://github.com/wesbaker/dotfiles">dotfiles</a>{" "}
          repository. It&rsquo;s probably most interesting to look at the{" "}
          <code>
            <a href="https://github.com/wesbaker/dotfiles/blob/main/Brewfile">
              Brewfile
            </a>
          </code>
          .
        </p>
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
