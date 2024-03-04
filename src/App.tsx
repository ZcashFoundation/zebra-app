import { Router, Route, RouteSectionProps, A, useMatch } from "@solidjs/router";
import { styled } from "solid-styled-components";

import { NAVIGATION_BAR_HEIGHT } from "./constants";
import Logs from "./Logs";
import Configuration from "./Configure";

const TabNavigation = styled("header")`
  display: flex;
  position: fixed;
  font-size: 12px;
  background-color: #1c1c1c;
  margin: 0;
  height: ${NAVIGATION_BAR_HEIGHT};
  width: 100%;
  box-sizing: border-box;
  list-style-type: none;
  padding: 0 0 12px;
`;

const Container = styled("div")`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: #1c1c1c;
`;

const ClearFixedNavSpace = styled("div")`
  padding-top: ${NAVIGATION_BAR_HEIGHT};
`;

const NavItem = ({ children, href }: { children: string; href: string }) => {
  const is_active = useMatch(() => href);
  return (
    <A
      href={href}
      style={{
        "text-transform": "uppercase",
        "font-family": "sans-serif",
        padding: "16px 4px 6px",
        margin: "0 20px",
        "vertical-align": "middle",
        "border-bottom": is_active()
          ? "solid 1px #fff"
          : "solid 1px transparent",
        color: is_active() ? "#fff" : "#888",
        "text-decoration": "none",
      }}
    >
      {children}
    </A>
  );
};

const AppContainer = ({ children }: RouteSectionProps) => (
  <Container>
    <TabNavigation>
      <NavItem href="/">Logs</NavItem>
      <NavItem href="/configure">Configure</NavItem>
    </TabNavigation>
    <ClearFixedNavSpace />
    {children}
  </Container>
);

function App() {
  return (
    <Router root={AppContainer}>
      <Route path="/" component={Logs} />
      <Route path="/configure" component={Configuration} />
    </Router>
  );
}

export default App;
