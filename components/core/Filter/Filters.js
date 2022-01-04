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
import { motion } from "framer-motion";
import { FocusRing } from "../FocusRing";

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
  ${Styles.BUTTON_RESET};
  padding: 5px 8px 3px;
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
    margin-top: 4px !important;
  }
  li {
    list-style: none;
  }
`;

const FilterButton = React.forwardRef(({ children, Icon, image, isSelected, ...props }, ref) => (
  <Link {...props} ref={ref}>
    <span as="span" css={[STYLES_FILTER_BUTTON, isSelected && STYLES_FILTER_BUTTON_HIGHLIGHTED]}>
      {Icon ? <Icon height={16} width={16} style={{ flexShrink: 0 }} /> : null}
      {image ? image : null}
      <Typography.P2 as="span" nbrOflines={1} style={{ marginLeft: 6 }}>
        {children}
      </Typography.P2>
    </span>
  </Link>
));

const FilterSection = React.forwardRef(({ title, children, ...props }, ref) => {
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
                as={motion.button}
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
              Click to show/hide the filter section
            </System.H6>
          </Tooltip.Content>
        </Tooltip.Root>
      )}
      {isExpanded ? (
        <RovingTabIndex.Provider axis="vertical">
          <RovingTabIndex.List>
            <motion.ul
              layoutId={title + "section"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              css={STYLES_FILTERS_GROUP}
            >
              {children}
            </motion.ul>
          </RovingTabIndex.List>
        </RovingTabIndex.Provider>
      ) : null}
    </div>
  );
});

/* -------------------------------------------------------------------------------------------------
 *  InitialFilters
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
          My Library
        </FilterButton>
      </FilterSection>
    </>
  );
}

function Tags({ viewer, data, onAction, ...props }) {
  const [, { hidePopup }] = useFilterContext();

  return (
    <FilterSection title="Tags" {...props}>
      {viewer.slates.map((slate, index) => (
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

function Following({ viewer, onAction, ...props }) {
  const [, { hidePopup }] = useFilterContext();

  return (
    <RovingTabIndex.Provider axis="vertical">
      <RovingTabIndex.List>
        <FilterSection title="Following" {...props}>
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
      </RovingTabIndex.List>
    </RovingTabIndex.Provider>
  );
}

function Profile({ viewer, data, page, ...props }) {
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

  return (
    <FilterSection {...props}>
      <div css={Styles.VERTICAL_CONTAINER_CENTERED} style={{ gap: "12px" }}>
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

function ProfileTags({ data, page, onAction, ...props }) {
  const [, { hidePopup }] = useFilterContext();

  let user = data;
  if (page.id === "NAV_SLATE") {
    user = data.owner;
  }

  return (
    <RovingTabIndex.Provider axis="vertical">
      <RovingTabIndex.List>
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
      </RovingTabIndex.List>
    </RovingTabIndex.Provider>
  );
}

export { Library, Tags, Following, Profile, ProfileTags };
