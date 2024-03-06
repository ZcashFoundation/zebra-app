import { invoke } from "@tauri-apps/api/core";
import { Accessor, createSignal, onMount } from "solid-js";
import { styled } from "solid-styled-components";
import { EXAMPLE_CONFIG_CONTENTS } from "../tests/example_data";

const PageContainer = styled("div")`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  padding: 0 24px 24px;
  font-family: sans-serif;
`;

const FloatingButtonContainer = styled("div")`
  background: #1c1c1c;
  position: fixed;
  right: 8px;
  margin-top: 6px;
  padding: 8px;
`;

const Button = styled("button")`
  outline: none;
  border: solid 2px white;
  color: white;
  padding: 8px 14px;
  margin: 8px;
  border-radius: 8px;
  font-size: 14px;
  text-transform: uppercase;
  cursor: pointer;
  letter-spacing: 1px;
  background: none;

  &:hover {
    color: #aaa;
    border-color: #aaa;
  }
`;

const ConfigTextArea = styled("textarea")`
  display: flex;
  flex-grow: 1;
  background: none;
  color: white;
  padding: 0 8px;
`;

const ConfigDisplay = ({ children }: { children: Accessor<string> }) => {
  console.log(children().split("\n").length);

  return (
    <pre>
      <code>{children()}</code>
    </pre>
  );
};

const Configuration = () => {
  const is_tauri_app = window.hasOwnProperty("__TAURI_INTERNALS__");

  const [config_contents, set_config_contents] = createSignal<string>("");
  const [edited_config, set_edited_config] = createSignal<string | null>(null);

  onMount(async () => {
    if (is_tauri_app) {
      set_config_contents(await invoke("read_config"));
    } else {
      set_config_contents(EXAMPLE_CONFIG_CONTENTS);
    }
  });

  const save_and_apply = () => {
    invoke("save_config", { new_config: edited_config() });
  };

  const discard_changes = () => {
    set_edited_config(null);
  };

  const start_editing = () => {
    set_edited_config(config_contents());
  };

  const is_editable = () => edited_config() !== null;

  return (
    <PageContainer>
      <h1>Configuration</h1>

      {is_editable() ? (
        <>
          <ConfigTextArea
            value={edited_config() || ""}
            onChange={({ currentTarget: { value } }) =>
              set_edited_config(value)
            }
          />
          <FloatingButtonContainer>
            <Button onClick={discard_changes}>Discard Changes</Button>
            <Button onClick={save_and_apply}>Save & Apply</Button>
          </FloatingButtonContainer>
        </>
      ) : (
        <>
          <ConfigDisplay>{config_contents}</ConfigDisplay>
          <FloatingButtonContainer>
            <Button onClick={start_editing}>Edit</Button>
          </FloatingButtonContainer>
        </>
      )}
    </PageContainer>
  );
};

export default Configuration;
