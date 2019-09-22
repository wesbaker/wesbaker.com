import React from "react";
import { Link, graphql } from "gatsby";

import Bio from "../components/bio";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { rhythm } from "../utils/typography";
import styled from "styled-components";

const BlogPost = styled.article`
  margin: 2rem 0;
`;

const BlogPostDate = styled.small`
  text-transform: uppercase;
  margin: 0.3rem 0;
  display: block;
  color: #666;
`;

const Pagination = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 5rem 0;
`;

const PageNumber = styled(Link)`
  padding: ${rhythm(1 / 4)};
  text-decoration: none;
  color: ${props => (props.active ? "#ffffff" : "")};
  background: ${props => (props.active ? "#38657D" : "")};
  border-radius: 3px;
`;

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title;
    const posts = data.allMarkdownRemark.edges;

    // Pagination Data
    const { currentPage, numPages } = this.props.pageContext;
    const isFirst = currentPage === 1;
    const isLast = currentPage === numPages;
    const prevPage =
      currentPage - 1 === 1 ? "/" : `/page/${(currentPage - 1).toString()}`;
    const nextPage = `/page/${(currentPage + 1).toString()}`;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="All posts" />
        <Bio />
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug;
          return (
            <BlogPost key={node.fields.slug}>
              <header>
                <h3
                  style={{
                    marginBottom: rhythm(1 / 4),
                  }}
                >
                  <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                    {title}
                  </Link>
                </h3>
                <BlogPostDate>{node.frontmatter.date}</BlogPostDate>
              </header>
              <section>
                <p
                  dangerouslySetInnerHTML={{
                    __html: node.frontmatter.description || node.excerpt,
                  }}
                />
              </section>
            </BlogPost>
          );
        })}
        <Pagination>
          {!isFirst && (
            <Link to={prevPage} rel="prev">
              ← Previous Page
            </Link>
          )}
          {Array.from({ length: numPages }, (_, i) => (
            <li
              key={`pagination-number${i + 1}`}
              style={{
                margin: 0,
              }}
            >
              <PageNumber
                to={i === 0 ? "" : `/page/${i + 1}`}
                active={i + 1 === currentPage}
              >
                {i + 1}
              </PageNumber>
            </li>
          ))}
          {!isLast && (
            <Link to={nextPage} rel="next">
              Next Page →
            </Link>
          )}
        </Pagination>
      </Layout>
    );
  }
}

export default BlogIndex;

export const pageQuery = graphql`
  query blogPageQuery($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM do, YYYY")
            title
            description
          }
        }
      }
    }
  }
`;
