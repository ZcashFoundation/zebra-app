import { listen, Event, UnlistenFn } from "@tauri-apps/api/event";

import { createSignal, onCleanup, onMount } from "solid-js";
import { styled } from "solid-styled-components";

import { EXAMPLE_LOGS } from "./tests/example_logs";

const NAVIGATION_BAR_HEIGHT = "50px";

const TabNavigation = styled("ul")`
  display: flex;
  position: fixed;
  font-size: 11px;
  background-color: #1c1c1c;
  margin: 0;
  height: ${NAVIGATION_BAR_HEIGHT};
  width: 100%;
  box-sizing: border-box;
  list-style-type: none;
  padding: 0 0 12px;
`;

const TabItem = styled("li")`
  text-transform: uppercase;
  font-family: sans-serif;
  padding: 16px 4px 6px;
  margin: 0 20px;
  vertical-align: middle;
  border-bottom: solid 1px #fff;
`;

const LogPage = styled("div")`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: #1c1c1c;
`;

const LogContainer = styled("div")`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: end;
  background-color: #1c1c1c;
  padding: 4px;
  margin-top: ${NAVIGATION_BAR_HEIGHT};
`;

const LogLine = styled("div")`
  display: block;
  font-size: 12px;
  margin: 0;
  padding: 2px 4px;
`;

const LogTimestamp = styled("code")`
  display: inline;
  margin: 0;
  color: #888;
`;

const LogLevel = styled("code")`
  display: inline;
  margin: 0;
  color: ${({ children }: { children: string }) =>
    ({
      INFO: "green",
      WARN: "orange",
      TRACE: "blue",
      DEBUG: "purple",
    }[children.trim()] || "white")}};
  padding-left: 6px;
`;

const LogMessage = styled("code")`
  display: inline;
  margin: 0;
  color: #eee;
`;

const Log = ({ children }: { children: string }) => (
  <LogLine>
    <LogTimestamp>{children.slice(0, 27)}</LogTimestamp>
    <LogLevel>{children.slice(27, 34)}</LogLevel>
    <LogMessage>{children.slice(34)}</LogMessage>
  </LogLine>
);

function App() {
  const is_tauri_app = window.hasOwnProperty("__TAURI_INTERNALS__");
  const [logs, set_logs] = createSignal<Array<string>>([]);

  if (is_tauri_app) {
    let stop_listening: UnlistenFn;

    onMount(async () => {
      stop_listening = await listen("log", (event: Event<string>) => {
        set_logs([...logs(), event.payload]);
      });
    });

    onCleanup(() => stop_listening());
  } else {
    let example_log_index = 0;
    const interval = setInterval(() => {
      set_logs([...logs(), EXAMPLE_LOGS[example_log_index]]);
      example_log_index += 1;

      if (example_log_index >= EXAMPLE_LOGS.length) {
        clearInterval(interval);
      }
    }, 100);
  }

  return (
    <LogPage>
      <TabNavigation>
        <TabItem>Logs</TabItem>
      </TabNavigation>
      <LogContainer>
        {logs().map((log) => (
          <Log>{log}</Log>
        ))}
        <LogLine>&gt; _</LogLine>
      </LogContainer>
    </LogPage>
  );
}

export default App;