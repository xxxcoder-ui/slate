import * as React from "react";
import * as Styles from "~/common/styles";
import * as System from "~/components/system";
import * as Jumper from "~/components/core/Jumper";
import * as SVG from "~/common/svg";
import * as Actions from "~/common/actions";
import * as UserBehaviors from "~/common/user-behaviors";
import * as Constants from "~/common/constants";
import * as MobileJumper from "~/components/system/components/GlobalCarousel/jumpers/MobileLayout";

import { Show } from "~/components/utility/Show";
import { css } from "@emotion/react";
import { AnimateSharedLayout, motion } from "framer-motion";
import { v4 as uuid } from "uuid";
import { useEventListener } from "~/common/hooks";

const STYLES_CHANNEL_BUTTON = (theme) => css`
  position: relative;
  ${Styles.BUTTON_RESET};
  padding: 5px 12px 7px;
  border: 1px solid ${theme.semantic.borderGrayLight4};
  border-radius: 12px;
  color: ${theme.semantic.textBlack};
  background-color: transparent;
  transition: background-color 0.3 ease-in-out;
`;

const STYLES_CHANNEL_BUTTON_SELECTED = (theme) => css`
  background-color: ${theme.semantic.bgGrayLight4};
`;

function ChannelButton({ children, isSelected, css, ...props }) {
  return (
    <button
      css={[STYLES_CHANNEL_BUTTON, isSelected && STYLES_CHANNEL_BUTTON_SELECTED, css]}
      {...props}
    >
      {children}
    </button>
  );
}

/* -----------------------------------------------------------------------------------------------*/

const STYLES_RETURN_KEY = (theme) => css`
  padding: 0px 2px;
  border-radius: 6px;
  background-color: ${theme.semantic.bgGrayLight};
`;

function ChannelKeyboardShortcut({ searchResults, searchQuery, onAddFileToChannel }) {
  const [isFileAdded, setIsFileAdded] = React.useState(false);
  React.useLayoutEffect(() => {
    if (isFileAdded) {
      setIsFileAdded(false);
    }
  }, [searchQuery]);

  const { publicChannels, privateChannels } = searchResults;
  const selectedChannel = [...publicChannels, ...privateChannels][0];

  useEventListener({
    type: "keyup",
    handler: (e) => {
      if (e.key === "Enter") {
        onAddFileToChannel(selectedChannel, selectedChannel.doesContainFile);
        setIsFileAdded(true);
      }
    },
  });

  if (isFileAdded) return null;

  return (
    <div css={Styles.HORIZONTAL_CONTAINER_CENTERED}>
      <System.P3 color="textGray">
        Select {selectedChannel.isPublic ? "public" : "private"} tag "{selectedChannel.slatename}"
      </System.P3>
      <System.P3 css={STYLES_RETURN_KEY} style={{ marginLeft: 4 }}>
        ⏎
      </System.P3>
    </div>
  );
}

const STYLES_SEARCH_CHANNELS_INPUT = (theme) => css`
  background-color: transparent;
  ${theme.semantic.textGray};
  box-shadow: none;
  height: 52px;
  padding: 0px;
  ::placeholder {
    color: ${theme.semantic.textGray};
  }
`;

function ChannelInput({ value, searchResults, onChange, onAddFileToChannel, ...props }) {
  const { publicChannels, privateChannels } = searchResults;
  const showShortcut = publicChannels.length + privateChannels.length === 1;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <System.Input
        full
        value={value}
        onChange={onChange}
        name="search"
        placeholder="Search or create a new channel"
        inputCss={STYLES_SEARCH_CHANNELS_INPUT}
        {...props}
      />
      <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", right: 20 }}>
        {showShortcut ? (
          <ChannelKeyboardShortcut
            searchQuery={value}
            searchResults={searchResults}
            onAddFileToChannel={onAddFileToChannel}
          />
        ) : null}
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------------------------------------*/
const STYLES_TAG = (theme) => css`
  padding: 7px 12px 9px;
  border-radius: 12px;
  background-color: ${theme.semantic.bgGrayLight4};
`;

function ChannelsEmpty() {
  return (
    <div css={Styles.VERTICAL_CONTAINER_CENTERED}>
      <System.P2 color="textGrayDark" style={{ textAlign: "center" }}>
        You don’t have any tags yet. <br /> Start typing above to create one.
      </System.P2>
      <div css={STYLES_TAG} style={{ marginTop: 19 }}>
        <SVG.Hash width={16} height={16} style={{ display: "block" }} />
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------------------------------------*/

const STYLES_CHANNEL_BUTTONS_WRAPPER = css`
  display: flex;
  flex-wrap: wrap;
  margin: calc(-8px + 6px) 0 0 -8px;
  width: calc(100% + 8px);

  & > * {
    margin: 8px 0 0 8px !important;
  }
`;

function Channels({
  header,
  isPublic,

  searchQuery,
  isSearching,

  channels,
  isCreatingChannel,

  onAddFileToChannel,
  onCreateChannel,
}) {
  const showChannel = !isSearching && channels.length === 0;

  return !showChannel ? (
    <div>
      <System.H6 as="h2" color="textGray">
        {isCreatingChannel ? `Create ${header.toLowerCase()} tag` : header}
      </System.H6>

      <Show when={isCreatingChannel && isPublic}>
        <System.P3 color="textGray" style={{ marginTop: 2 }}>
          Objects with a public tag will show up on your public profile.
        </System.P3>
      </Show>

      <AnimateSharedLayout>
        <div css={STYLES_CHANNEL_BUTTONS_WRAPPER}>
          {channels.map((channel) => (
            <motion.div layoutId={`jumper-${channel.id}`} initial={false} key={channel.slatename}>
              <ChannelButton
                isSelected={channel.doesContainFile}
                onClick={() => onAddFileToChannel(channel, channel.doesContainFile)}
              >
                {channel.slatename}
              </ChannelButton>
            </motion.div>
          ))}

          <Show when={isCreatingChannel}>
            <motion.div initial={{ opacity: 0.5, y: 4 }} animate={{ opacity: 1, y: 0 }}>
              <ChannelButton
                css={Styles.HORIZONTAL_CONTAINER_CENTERED}
                onClick={() => onCreateChannel(searchQuery)}
              >
                <SVG.Plus width={16} height={16} style={{ pointerEvents: "none" }} />
                <span style={{ marginLeft: 4 }}>{searchQuery}</span>
              </ChannelButton>
            </motion.div>
          </Show>
        </div>
      </AnimateSharedLayout>
    </div>
  ) : null;
}

/* -----------------------------------------------------------------------------------------------*/

const useChannelHandlers = ({ viewer, file, onAction }) => {
  const handleAddFileToChannel = async (slate, isSelected) => {
    const prevSlates = [...viewer.slates];
    const resetViewerSlates = () =>
      onAction({ type: "UPDATE_VIEWER", viewer: { slates: prevSlates } });

    if (isSelected) {
      const newSlates = viewer.slates.map((item) => {
        if (slate.id === item.id) {
          return { ...item, objects: item.objects.filter((object) => object.id !== file.id) };
        }
        return item;
      });
      onAction({ type: "UPDATE_VIEWER", viewer: { slates: newSlates } });

      const response = await UserBehaviors.removeFromSlate({ slate, ids: [file.id] });
      if (!response) resetViewerSlates();
      return;
    }

    const newSlates = viewer.slates.map((item) => {
      if (slate.id === item.id) return { ...item, objects: [...item.objects, file] };
      return item;
    });
    onAction({ type: "UPDATE_VIEWER", viewer: { slates: newSlates } });

    const response = await UserBehaviors.saveCopy({ slate, files: [file], showAlerts: false });
    if (!response) resetViewerSlates();
  };

  const handleCreateSlate = (isPublic) => async (name) => {
    //TODO(amine): find better solution to show the channel optimistically
    onAction({
      type: "UPDATE_VIEWER",
      viewer: {
        slates: [...viewer.slates, { id: uuid(), slatename: name, isPublic, objects: [file] }],
      },
    });

    const response = await Actions.createSlate({
      name: name,
      isPublic,
    });

    await handleAddFileToChannel(response?.slate);
  };
  return { handleCreateSlate, handleAddFileToChannel };
};

const useGetPrivateAndPublicChannels = ({ slates, file }) =>
  React.useMemo(() => {
    const privateChannels = [];
    const publicChannels = [];

    slates.forEach((slate) => {
      const doesContainFile = slate.objects.some((item) => item.id === file.id);

      if (slate.isPublic) {
        publicChannels.push({ ...slate, doesContainFile });
        return;
      }
      privateChannels.push({ ...slate, doesContainFile });
    });

    privateChannels.sort((a, b) => a.createdAt - b.createdAt);
    publicChannels.sort((a, b) => a.createdAt - b.createdAt);

    return { privateChannels, publicChannels };
  }, [slates, file.id]);

const useChannelsSearch = ({ privateChannels, publicChannels }) => {
  const [query, setQuery] = React.useState("");

  const { results, canCreatePrivateChannel, canCreatePublicChannel } = React.useMemo(() => {
    let canCreatePrivateChannel = true;
    let canCreatePublicChannel = true;

    const results = { privateChannels: [], publicChannels: [] };
    const searchRegex = new RegExp(query, "gi");

    results.privateChannels = privateChannels.filter((channel) => {
      if (channel.slatename === query) canCreatePrivateChannel = false;
      return searchRegex.test(channel.slatename);
    });

    results.publicChannels = publicChannels.filter((channel) => {
      if (channel.slatename === query) canCreatePublicChannel = false;
      return searchRegex.test(channel.slatename);
    });

    return { results, canCreatePrivateChannel, canCreatePublicChannel };
  }, [query, privateChannels, publicChannels]);

  const handleQueryChange = (e) => setQuery(e.target.value);
  const clearQuery = () => setQuery("");

  return [
    { searchQuery: query, searchResults: results, canCreatePrivateChannel, canCreatePublicChannel },
    { handleQueryChange, clearQuery },
  ];
};

const STYLES_EDIT_CHANNELS_HEADER = (theme) => css`
  ${Styles.HORIZONTAL_CONTAINER_CENTERED};
  color: ${theme.semantic.textGray};
`;

export function EditChannels({ file, viewer, isOpen, onClose, onAction }) {
  const { privateChannels, publicChannels } = useGetPrivateAndPublicChannels({
    slates: viewer.slates,
    file,
  });

  const [
    { searchQuery, searchResults, canCreatePrivateChannel, canCreatePublicChannel },
    { handleQueryChange, clearQuery },
  ] = useChannelsSearch({
    privateChannels: privateChannels,
    publicChannels: publicChannels,
  });

  const { handleAddFileToChannel, handleCreateSlate } = useChannelHandlers({
    viewer,
    file,
    onAction,
  });

  const isSearching = searchQuery.length > 0;

  const showEmptyState = !isSearching && viewer.slates.length === 0;

  return isOpen ? (
    <Jumper.Root onClose={onClose}>
      <Jumper.Header
        css={STYLES_EDIT_CHANNELS_HEADER}
        style={{ paddingTop: 0, paddingBottom: 0, paddingRight: 0 }}
      >
        <SVG.Hash width={16} />
        <ChannelInput
          value={searchQuery}
          onChange={handleQueryChange}
          searchResults={searchResults}
          autoFocus={viewer?.slates?.length === 0}
          onAddFileToChannel={handleAddFileToChannel}
        />
      </Jumper.Header>
      <Jumper.Divider />
      <Jumper.Item>
        <Jumper.ObjectPreview file={file} />
      </Jumper.Item>
      <Jumper.Divider />
      {showEmptyState ? (
        <Jumper.Item style={{ flexGrow: 1 }} css={Styles.CONTAINER_CENTERED}>
          <ChannelsEmpty />
        </Jumper.Item>
      ) : (
        <Jumper.Item>
          <Channels
            header="Private"
            isSearching={isSearching}
            isCreatingChannel={isSearching && canCreatePrivateChannel}
            channels={isSearching ? searchResults.privateChannels : privateChannels}
            searchQuery={searchQuery}
            onAddFileToChannel={handleAddFileToChannel}
            onCreateChannel={handleCreateSlate(false)}
            file={file}
            viewer={viewer}
            onAction={onAction}
          />
          <div style={{ marginTop: 20 }}>
            <Channels
              header="Public"
              isPublic
              isSearching={isSearching}
              searchQuery={searchQuery}
              isCreatingChannel={isSearching && canCreatePublicChannel}
              channels={isSearching ? searchResults.publicChannels : publicChannels}
              onAddFileToChannel={handleAddFileToChannel}
              onCreateChannel={handleCreateSlate(true)}
            />
          </div>
        </Jumper.Item>
      )}
    </Jumper.Root>
  ) : null;
}

export function EditChannelsMobile({ file, viewer, onAction, isOpen, onClose }) {
  const { privateChannels, publicChannels } = useGetPrivateAndPublicChannels({
    slates: viewer.slates,
    file,
  });

  const [
    { searchQuery, searchResults, canCreatePrivateChannel, canCreatePublicChannel },
    { handleQueryChange, clearQuery },
  ] = useChannelsSearch({
    privateChannels: privateChannels,
    publicChannels: publicChannels,
  });

  const { handleAddFileToChannel, handleCreateSlate } = useChannelHandlers({
    viewer,
    file,
    onAction,
  });

  const isSearching = searchQuery.length > 0;

  return isOpen ? (
    <MobileJumper.Root>
      <MobileJumper.Header
        css={STYLES_EDIT_CHANNELS_HEADER}
        style={{ paddingTop: 0, paddingBottom: 0, paddingRight: 0 }}
      >
        <SVG.Hash width={16} />
        <ChannelInput
          value={searchQuery}
          onChange={handleQueryChange}
          searchResults={searchResults}
          onAddFileToChannel={handleAddFileToChannel}
          autoFocus={viewer?.slates?.length === 0}
        />
      </MobileJumper.Header>
      <System.Divider height={1} color="borderGrayLight" />
      <div style={{ padding: "13px 16px 11px" }}>
        <Jumper.ObjectPreview file={file} />
      </div>
      <System.Divider height={1} color="borderGrayLight" />
      <MobileJumper.Content>
        <Channels
          header="Private"
          isSearching={isSearching}
          isCreatingChannel={isSearching && canCreatePrivateChannel}
          channels={isSearching ? searchResults.privateChannels : privateChannels}
          searchQuery={searchQuery}
          onAddFileToChannel={handleAddFileToChannel}
          onCreateChannel={handleCreateSlate(false)}
        />
        <div style={{ marginTop: 20 }}>
          <Channels
            header="Public"
            isPublic
            isSearching={isSearching}
            searchQuery={searchQuery}
            isCreatingChannel={isSearching && canCreatePublicChannel}
            channels={isSearching ? searchResults.publicChannels : publicChannels}
            onAddFileToChannel={handleAddFileToChannel}
            onCreateChannel={handleCreateSlate(true)}
          />
        </div>
      </MobileJumper.Content>
      <MobileJumper.Footer css={Styles.HORIZONTAL_CONTAINER_CENTERED}>
        <button
          type="button"
          css={Styles.BUTTON_RESET}
          style={{ width: 32, height: 32 }}
          onClick={onClose}
        >
          <SVG.Hash width={16} height={16} style={{ color: Constants.system.blue }} />
        </button>
      </MobileJumper.Footer>
    </MobileJumper.Root>
  ) : null;
}
