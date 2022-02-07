import * as React from "react";
import * as SVG from "~/common/svg";
import * as Styles from "~/common/styles";
import * as Events from "~/common/custom-events";
import * as Typography from "~/components/system/components/Typography";
import * as Utilities from "~/common/utilities";
import * as Tooltip from "~/components/system/components/fragments/Tooltip";
import * as System from "~/components/system";
import * as Actions from "~/common/actions";
import * as RovingTabIndex from "~/components/core/RovingTabIndex";

import ProfilePhoto from "~/components/core/ProfilePhoto";

import { css } from "@emotion/react";
import { useFilterContext } from "~/components/core/Filter/Provider";
import { Link } from "~/components/core/Link";
import { ButtonPrimary, ButtonSecondary } from "~/components/system/components/Buttons";
import { FocusRing } from "../FocusRing";
import { Show } from "~/components/utility/Show";

/* -------------------------------------------------------------------------------------------------
 *  Shared components between filters
 * -----------------------------------------------------------------------------------------------*/

const STYLES_FILTER_BUTTON_HIGHLIGHTED = (theme) => css`
  background-color: ${theme.semantic.bgGrayLight};
`;

const STYLES_FILTER_BUTTON = (theme) => css`
  display: flex;
  align-items: center;
  width: 100%;
  height: 32px;
  ${Styles.BUTTON_RESET};
  padding: 5px 8px 7px;
  border-radius: 8px;
  color: ${theme.semantic.textBlack};
  &:hover {
    background-color: ${theme.semantic.bgGrayLight};
    color: ${theme.semantic.textBlack};
  }

  &:disabled {
    color: ${theme.semantic.textGray};
    pointer-events: none;
    cursor: not-allowed;
  }
`;

const STYLES_FILTER_TITLE_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  padding: 5px 8px 3px;
  border-radius: 8px;
  &:hover {
    background-color: ${theme.semantic.bgGrayLight};
    color: ${theme.semantic.textBlack};
  }
`;

const STYLES_FILTERS_GROUP = css`
  & > * + * {
    ${"" /* margin-top: 4px !important; */}
  }
  li {
    list-style: none;
  }
`;

const STYLES_ICON_CONTAINER = css`
  padding: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: inherit;
`;

const FilterButton = React.forwardRef(({ children, Icon, image, isSelected, ...props }, ref) => (
  <Link {...props} ref={ref}>
    <span as="span" css={[STYLES_FILTER_BUTTON, isSelected && STYLES_FILTER_BUTTON_HIGHLIGHTED]}>
      {Icon ? (
        <div css={STYLES_ICON_CONTAINER}>
          <Icon height={16} width={16} style={{ flexShrink: 0 }} />
        </div>
      ) : null}
      {image ? image : null}
      <Typography.P2 as="span" nbrOflines={1} style={{ marginLeft: 6, color: "inherit" }}>
        {children}
      </Typography.P2>
    </span>
  </Link>
));

const FilterSection = React.forwardRef(({ title, children, emptyState, ...props }, ref) => {
  const [isExpanded, setExpanded] = React.useState(true);
  const toggleExpandState = () => setExpanded((prev) => !prev);

  const titleButtonId = `sidebar-${title}-button`;
  return (
    <div {...props} ref={ref}>
      {title && (
        <Tooltip.Root vertical="above" horizontal="right">
          <Tooltip.Trigger aria-describedby={titleButtonId} aria-expanded={isExpanded}>
            <FocusRing>
              <Typography.H6
                as="button"
                layoutId={title + "title"}
                css={STYLES_FILTER_TITLE_BUTTON}
                style={{ paddingLeft: 8, marginBottom: 4 }}
                onClick={toggleExpandState}
                color="textGray"
              >
                {title}
              </Typography.H6>
            </FocusRing>
          </Tooltip.Trigger>
          <Tooltip.Content css={Styles.HORIZONTAL_CONTAINER_CENTERED} style={{ marginTop: -4.5 }}>
            <System.H6 id={titleButtonId} as="p" color="textGrayDark">
              Click to toggle section
            </System.H6>
          </Tooltip.Content>
        </Tooltip.Root>
      )}
      {isExpanded ? (
        Array.isArray(children) && children?.length === 0 ? (
          <Show when={emptyState}>
            <System.P2 color="textGrayDark" style={{ paddingLeft: "8px" }}>
              {emptyState}
            </System.P2>
          </Show>
        ) : (
          <RovingTabIndex.Provider axis="vertical">
            <RovingTabIndex.List>
              <ul css={STYLES_FILTERS_GROUP}>{children}</ul>
            </RovingTabIndex.List>
          </RovingTabIndex.Provider>
        )
      ) : null}
    </div>
  );
});

/* -------------------------------------------------------------------------------------------------
 *  Library
 * -----------------------------------------------------------------------------------------------*/

function Library({ page, onAction }) {
  const [, { hidePopup }] = useFilterContext();

  const isSelected = page.id === "NAV_DATA";

  return (
    <>
      <FilterSection>
        <FilterButton
          href="/_/data"
          isSelected={isSelected}
          onAction={onAction}
          Icon={SVG.Clock}
          onClick={hidePopup}
        >
          Recent
        </FilterButton>
      </FilterSection>
    </>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Tags
 * -----------------------------------------------------------------------------------------------*/

function PrivateTags({ viewer, data, onAction, ...props }) {
  const [, { hidePopup }] = useFilterContext();
  let tags = viewer.slates.filter((slate) => !slate.isPublic);

  return (
    <FilterSection
      title="Private"
      emptyState="Tag files to see them here. Only you can see your private tags"
      {...props}
    >
      {tags.map((slate, index) => (
        <li key={slate.id}>
          <RovingTabIndex.Item index={index}>
            <FilterButton
              href={`/$/slate/${slate.id}`}
              isSelected={slate.id === data?.id}
              onAction={onAction}
              Icon={SVG.Hash}
              onClick={hidePopup}
            >
              {slate.slatename}
            </FilterButton>
          </RovingTabIndex.Item>
        </li>
      ))}
    </FilterSection>
  );
}

function PublicTags({ viewer, data, onAction, ...props }) {
  const [, { hidePopup }] = useFilterContext();
  let tags = viewer.slates.filter((slate) => slate.isPublic);

  return (
    <FilterSection
      title="Public"
      emptyState="Public tags are discoverable on your profile to other users"
      {...props}
    >
      {tags.map((slate, index) => (
        <li key={slate.id}>
          <RovingTabIndex.Item index={index}>
            <FilterButton
              href={`/$/slate/${slate.id}`}
              isSelected={slate.id === data?.id}
              onAction={onAction}
              Icon={SVG.Hash}
              onClick={hidePopup}
            >
              {slate.slatename}
            </FilterButton>
          </RovingTabIndex.Item>
        </li>
      ))}
    </FilterSection>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Following
 * -----------------------------------------------------------------------------------------------*/

function Following({ viewer, onAction, ...props }) {
  const [, { hidePopup }] = useFilterContext();

  return (
    <FilterSection title="Following" emptyState="Follow users to see them here" {...props}>
      {viewer.following.map((user, index) => (
        <li key={user.id}>
          <RovingTabIndex.Item index={index}>
            <FilterButton
              href={`/${user.username}`}
              isSelected={false}
              onAction={onAction}
              // Icon={SVG.ProfileUser}
              image={<ProfilePhoto user={user} style={{ borderRadius: "8px" }} size={20} />}
              onClick={hidePopup}
            >
              {user.username}
            </FilterButton>
          </RovingTabIndex.Item>
        </li>
      ))}
    </FilterSection>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Profile
 * -----------------------------------------------------------------------------------------------*/

function Profile({ viewer, onAction, data, page, ...props }) {
  if (page.id === "NAV_SLATE") {
    data = data.owner;
  }

  const isAuthenticated = !!viewer;
  const isOwner = viewer?.id === data.id;

  const [isFollowing, setIsFollowing] = React.useState(() =>
    isOwner || !viewer
      ? false
      : !!viewer?.following.some((entry) => {
          return entry.id === data.id;
        })
  );

  React.useEffect(() => {
    let updatedIsFollowing =
      isOwner || !viewer
        ? false
        : !!viewer?.following.some((entry) => {
            return entry.id === data.id;
          });
    setIsFollowing(updatedIsFollowing);
  }, [viewer?.following, data?.id]);

  const handleFollow = async (newStatus) => {
    if (!isAuthenticated) {
      Events.dispatchCustomEvent({ name: "slate-global-open-cta", detail: {} });
      return;
    }
    setIsFollowing(newStatus);
    await Actions.createSubscription({
      userId: data.id,
    });
  };

  const username = Utilities.getUserDisplayName(data);
  let { twitterUsername, body } = data;

  let backArrow = (
    <div style={{ display: "flex", alignItems: "flex-start", width: "100%", marginBottom: 12 }}>
      <Link onAction={onAction} href="/_/data">
        <div css={Styles.ICON_CONTAINER}>
          <SVG.RightArrow height="20px" style={{ transform: "rotate(180deg)" }} />
        </div>
      </Link>
    </div>
  );

  return (
    <FilterSection {...props}>
      <div css={Styles.VERTICAL_CONTAINER_CENTERED} style={{ gap: "12px" }}>
        {isAuthenticated ? backArrow : null}
        <ProfilePhoto user={data} style={{ borderRadius: "20px" }} size={80} />
        <div css={Styles.VERTICAL_CONTAINER_CENTERED} style={{ gap: "4px" }}>
          <Typography.H4 color="textGrayDark" style={{ marginTop: 10 }}>
            {username}
          </Typography.H4>
          {twitterUsername && (
            <div css={Styles.HORIZONTAL_CONTAINER_CENTERED} style={{ gap: "4px" }}>
              <SVG.Twitter style={{ width: "16px" }} />
              <Typography.P2 color="textGrayDark">{twitterUsername}</Typography.P2>
            </div>
          )}
          {body && (
            <Typography.P2 color="textGrayDark" nbrOflines={4} style={{ textAlign: "center" }}>
              {body}
            </Typography.P2>
          )}
        </div>
        {isFollowing ? (
          <ButtonSecondary
            full
            onClick={() => {
              handleFollow(false);
            }}
          >
            Unfollow
          </ButtonSecondary>
        ) : (
          <ButtonPrimary
            full
            onClick={() => {
              handleFollow(true);
            }}
          >
            Follow
          </ButtonPrimary>
        )}
      </div>
    </FilterSection>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  ProfileTags
 * -----------------------------------------------------------------------------------------------*/

function ProfileTags({ data, page, onAction, ...props }) {
  const [, { hidePopup }] = useFilterContext();

  let user = data;
  if (page.id === "NAV_SLATE") {
    user = data.owner;
  }

  return (
    <FilterSection {...props}>
      {user?.slates?.map((slate, index) => (
        <li key={slate.id}>
          <RovingTabIndex.Item index={index}>
            <FilterButton
              href={`/$/slate/${slate.id}`}
              isSelected={slate.id === data?.id}
              onAction={onAction}
              Icon={slate.isPublic ? SVG.Hash : SVG.SecurityLock}
              onClick={hidePopup}
            >
              {slate.slatename}
            </FilterButton>
          </RovingTabIndex.Item>
        </li>
      ))}
    </FilterSection>
  );
}

export { Library, PrivateTags, PublicTags, Following, Profile, ProfileTags };
