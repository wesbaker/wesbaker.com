import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";

import Bio from "../components/bio";
import Layout from "../components/layout";
import SEO from "../components/seo";

class Now extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    location: PropTypes.object,
  };

  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="Now" />
        <h1>Now</h1>
        <p>
          <small>
            This is <a href="https://nownownow.com/about">a now page</a>.
          </small>
        </p>
        <h2>Writing Code and Managing a Team</h2>
        <p>
          I currently work at <a href="https://kuali.co/">Kuali</a>. I&rsquo;m
          an engineering manager which means I manage a team, write code, and
          work with product, design, and engineering to deliver a compelling
          product.
        </p>
        <h2>Personal Projects</h2>
        <p>
          I write and maintain a number of personal programming projects to
          scratch various itches I have:
        </p>
        <ul>
          <li>
            <a href="https://github.com/wesbaker/github-pinboard-star-sync">
              Syncing GitHub Stars to Pinboard
            </a>
          </li>
          <li>
            Sending board game plays to{" "}
            <a href="https://github.com/wesbaker/nemeslack">Slack</a> and{" "}
            <a href="https://github.com/wesbaker/nemecord">Discord</a>
          </li>
          <li>
            Running two Twitter Bots for{" "}
            <a href="https://github.com/wesbaker/enworld-twitterbot">
              ENWorld.org
            </a>{" "}
            and{" "}
            <a href="https://github.com/wesbaker/tenkarstavern-twitterbot">
              Tenkar&rsquo;s Tavern
            </a>{" "}
            (two RPG news sites)
          </li>
          <li>
            And{" "}
            <a href="https://github.com/wesbaker/alfred-goodreads-workflow">
              a
            </a>{" "}
            <a href="https://github.com/wesbaker/alfred-stardewvalleywiki">
              whole
            </a>{" "}
            <a href="https://github.com/wesbaker/alfred-kickstarter-workflow">
              bunch
            </a>{" "}
            <a href="https://github.com/wesbaker/alfred-boardgamegeek">of</a>{" "}
            <a href="https://github.com/wesbaker/alfred-dndbeyond-workflow">
              Alfred
            </a>{" "}
            <a href="https://github.com/wesbaker/alfred-drivethrurpg">
              workflows
            </a>
          </li>
        </ul>
        <h2>3D Printing</h2>
        <p>
          This is my newest hobby, and therefore, the one I&rsquo;m most into at
          the moment. I bought a{" "}
          <a href="https://www.prusa3d.com/original-prusa-i3-mk3/">
            Prusa i3 MK3S
          </a>{" "}
          and an <a href="https://epax3d.com/products/epax-printer">EPAX X1</a>{" "}
          and unless they&rsquo;re broken, they&rsquo;re probably printing
          something.
        </p>
        <h2>Roleplaying Games</h2>
        <p>
          Before 3D printing, roleplaying were my newest hobby and I still do a
          fair amount of reading and playing, but I&rsquo;ve started to decrease
          the number of games I run and play in to a reasonable number. I still
          very much enjoy it, but I&rsquo;m more realistic about how much I can
          actually play these days. I always want more though because
          there&rsquo;s so much out there.
        </p>
        <h2>Board Games</h2>
        <p>
          Before all of the above, there were board games and I still play them,
          but I&rsquo;ve reached the point in the hobby and my life where
          I&rsquo;m generally playing (and buying) fewer games. I used to buy
          nearly 100 games a year (and resell a bunch of those) and now I
          generally buy less than 10 in a year, which is still a lot.
          Additionally, members of my game group have moved away and kids can
          make playing games just a little bit harder.
        </p>
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
