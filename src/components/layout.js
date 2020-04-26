import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
import styled from "styled-components";

import { rhythm, scale } from "../utils/typography";

const MainLayout = styled.div`
  margin: 0 auto;
  max-width: ${rhythm(28)};
  padding: ${rhythm(1.5)} ${rhythm(3 / 4)};
`;

const StyledLink = styled(Link)`
  box-shadow: none;
  text-decoration: none;
  color: inherit;
`;

class Layout extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    title: PropTypes.string,
    children: PropTypes.children,
  };

  render() {
    const { location, title, children } = this.props;
    const rootPath = `${__PATH_PREFIX__}/`; // eslint-disable-line no-undef
    let header;

    if (location.pathname === rootPath) {
      header = (
        <h1
          style={{
            ...scale(1.5),
            marginBottom: rhythm(1.5),
            marginTop: 0,
          }}
        >
          <StyledLink to={`/`}>{title}</StyledLink>
        </h1>
      );
    } else {
      header = (
        <h3 style={{ marginTop: 0 }}>
          <StyledLink to={`/`}>{title}</StyledLink>
        </h3>
      );
    }
    return (
      <MainLayout>
        <header>{header}</header>
        <main>{children}</main>
        <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
      </MainLayout>
    );
  }
}

export default Layout;
